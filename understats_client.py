import pandas as pd
import requests
import aiohttp
from understat import Understat
from tqdm import tqdm
from datetime import datetime, timezone
import json
from config import UNDERSTAT_YEAR


def get_current_gw():
    """
    Retrieve the list of upcoming Premier League Gameweek IDs using the FPL API.
    """
    url = "https://fantasy.premierleague.com/api/bootstrap-static/"
    response = requests.get(url)
    events = response.json()["events"]
    now = datetime.now(timezone.utc).timestamp()
    return [event['id'] for event in events if "deadline_time_epoch" in event and event["deadline_time_epoch"] > now]


class TeamDataProcessor:
    UNDERSTAT_LEAGUE = "epl"
    UNDERSTAT_YEAR = UNDERSTAT_YEAR  # imported from config

    def __init__(self):
        pass

    @staticmethod
    def http_get(url):
        return requests.get(url).json()

    @staticmethod
    def get(url):
        response = requests.get(url)
        return json.loads(response.content)

    def get_team_data(self, data):
        """
        Create and save 6 aggregated DataFrames:
        1. All matches
        2. Last 5 matches
        3. All home matches
        4. Last 5 home matches
        5. All away matches
        6. Last 5 away matches
        """
        def process_subset(df, n=None):
            if df.empty:
                return pd.DataFrame()  # return empty if no data
            if n:
                df = df.tail(n)
            return df.mean(numeric_only=True).to_frame().T

        cols = ['team', 'xG', 'xGA', 'npxG', 'npxGA', 'ppda', 'ppda_allowed',
                'deep', 'deep_allowed', 'scored', 'conceded', 'xpts',
                'wins', 'draws', 'loses', 'pts', 'npxGD']

        all_df = pd.DataFrame(columns=cols)
        last5_df = pd.DataFrame(columns=cols)
        home_df = pd.DataFrame(columns=cols)
        last5_home_df = pd.DataFrame(columns=cols)
        away_df = pd.DataFrame(columns=cols)
        last5_away_df = pd.DataFrame(columns=cols)

        for team in tqdm(data, desc="Parsing Team Stats"):
            history = pd.DataFrame(team.get("history", []))

            if history.empty:
                continue  # skip teams with no history

            # Flatten ppda dicts
            for match in history.itertuples():
                if isinstance(match.ppda, dict):
                    history.at[match.Index, "ppda"] = match.ppda["att"] / match.ppda["def"]
                if isinstance(match.ppda_allowed, dict):
                    history.at[match.Index, "ppda_allowed"] = match.ppda_allowed["att"] / match.ppda_allowed["def"]

            history.rename(columns={"missed": "conceded"}, inplace=True)

            # --- All matches ---
            all_row = pd.concat([
                pd.DataFrame({"team": [team["title"]]}),
                process_subset(history.drop(["result", "date", "h_a"], axis=1, errors='ignore'))
            ], axis=1)
            all_df = pd.concat([all_df, all_row], ignore_index=True)

            # --- Last 5 matches ---
            last5_row = pd.concat([
                pd.DataFrame({"team": [team["title"]]}),
                process_subset(history.drop(["result", "date", "h_a"], axis=1, errors='ignore'), n=5)
            ], axis=1)
            last5_df = pd.concat([last5_df, last5_row], ignore_index=True)

            # --- Home matches ---
            home_matches = history[history["h_a"] == "h"]
            home_row = pd.concat([
                pd.DataFrame({"team": [team["title"]]}),
                process_subset(home_matches.drop(["result", "date", "h_a"], axis=1, errors='ignore'))
            ], axis=1)
            home_df = pd.concat([home_df, home_row], ignore_index=True)

            # --- Last 5 home matches ---
            last5_home_row = pd.concat([
                pd.DataFrame({"team": [team["title"]]}),
                process_subset(home_matches.drop(["result", "date", "h_a"], axis=1, errors='ignore'), n=5)
            ], axis=1)
            last5_home_df = pd.concat([last5_home_df, last5_home_row], ignore_index=True)

            # --- Away matches ---
            away_matches = history[history["h_a"] == "a"]
            away_row = pd.concat([
                pd.DataFrame({"team": [team["title"]]}),
                process_subset(away_matches.drop(["result", "date", "h_a"], axis=1, errors='ignore'))
            ], axis=1)
            away_df = pd.concat([away_df, away_row], ignore_index=True)

            # --- Last 5 away matches ---
            last5_away_row = pd.concat([
                pd.DataFrame({"team": [team["title"]]}),
                process_subset(away_matches.drop(["result", "date", "h_a"], axis=1, errors='ignore'), n=5)
            ], axis=1)
            last5_away_df = pd.concat([last5_away_df, last5_away_row], ignore_index=True)

        return all_df, last5_df, home_df, last5_home_df, away_df, last5_away_df

    async def understat_team_data(self):
        async with aiohttp.ClientSession() as session:
            understat = Understat(session)
            team_data = await understat.get_teams(self.UNDERSTAT_LEAGUE, self.UNDERSTAT_YEAR)
            all_df, last5_df, home_df, last5_home_df, away_df, last5_away_df = self.get_team_data(team_data)
            return (
                all_df.set_index("team"),
                last5_df.set_index("team"),
                home_df.set_index("team"),
                last5_home_df.set_index("team"),
                away_df.set_index("team"),
                last5_away_df.set_index("team")
            )
