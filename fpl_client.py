# fpl_client.py

import asyncio
import logging
import time
from datetime import datetime, timezone
from functools import wraps
import numpy as np
import aiohttp
import pandas as pd

# Base URLs for Fantasy Premier League API endpoints
BOOTSTRAP_URL   = "https://fantasy.premierleague.com/api/bootstrap-static/"
ELEMENT_URL     = "https://fantasy.premierleague.com/api/element-summary/{id}/"
ENTRY_EVENT_URL = "https://fantasy.premierleague.com/api/entry/{team}"
FIXTURES_URL    = "https://fantasy.premierleague.com/api/fixtures/?event={gw}"

# Configure logger
_log = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

def timed(fn):
    """Measure wall-time of any coroutine or normal function."""
    @wraps(fn)
    async def _async_wrapper(*a, **kw):
        t0 = time.perf_counter()
        res = await fn(*a, **kw)
        _log.info("%s finished in %.2fs", fn.__name__, time.perf_counter() - t0)
        return res
    @wraps(fn)
    def _sync_wrapper(*a, **kw):
        t0 = time.perf_counter()
        res = fn(*a, **kw)
        _log.info("%s finished in %.2fs", fn.__name__, time.perf_counter() - t0)
        return res
    return _async_wrapper if asyncio.iscoroutinefunction(fn) else _sync_wrapper

def ensure_loaded(method):
    """Guarantee that bootstrap data are ready before any downstream call."""
    @wraps(method)
    async def wrapper(self, *args, **kwargs):
        if self._bootstrap is None:
            await self.load_bootstrap()
        return await method(self, *args, **kwargs)
    return wrapper

class FPLClient:
    """Async client for Fantasy Premier League API, storing teams & players in memory."""
    def __init__(self):
        self._bootstrap: dict | None = None
        self._aio_session: aiohttp.ClientSession | None = None
        
        # these will hold in-memory DataFrames once loaded
        self.teams: pd.DataFrame | None = None
        self.players: pd.DataFrame | None = None
        self.goalkeepers: pd.DataFrame | None = None
        self.defenders: pd.DataFrame | None = None
        self.midfielders: pd.DataFrame | None = None
        self.attackers: pd.DataFrame | None = None
    
    async def __aenter__(self):
        # initialize aiohttp session
        self._aio_session = aiohttp.ClientSession(timeout=aiohttp.ClientTimeout(total=30))
        # automatically load bootstrap into memory
        await self.load_bootstrap()
        return self

    async def __aexit__(self, *exc):
        await self._aio_session.close()

    async def _get_json(self, url: str) -> dict:
        if self._aio_session is None:
            raise RuntimeError("Use 'async with FPLClient()' context manager")
        async with self._aio_session.get(url) as resp:
            resp.raise_for_status()
            return await resp.json()

    @timed
    async def load_bootstrap(self):
        """Load & cache bootstrap; split players by position in memory."""
        self._bootstrap = await self._get_json(BOOTSTRAP_URL)
        # teams + players DataFrames
        self.teams = pd.DataFrame(self._bootstrap["teams"])
        self.players = pd.DataFrame(self._bootstrap["elements"])
        # map team names
        name_map = dict(zip(self.teams.id, self.teams.name))
        self.players["team_name"] = self.players["team"].map(name_map)
        # split by element_type: 1=GK,2=DEF,3=MID,4=FWD
        grouped = self.players.groupby("element_type")
        self.goalkeepers  = grouped.get_group(1).drop(columns=["element_type"])
        self.defenders    = grouped.get_group(2).drop(columns=["element_type"])
        self.midfielders  = grouped.get_group(3).drop(columns=["element_type"])
        self.attackers    = grouped.get_group(4).drop(columns=["element_type"])
        _log.info("Cached %d teams, %d players (gk=%d, def=%d, mid=%d, fwd=%d)",
                  len(self.teams), len(self.players),
                  len(self.goalkeepers), len(self.defenders),
                  len(self.midfielders), len(self.attackers))

    @ensure_loaded
    async def current_gw(self) -> int:
        events = pd.DataFrame(self._bootstrap["events"])
        now_ts = datetime.now(timezone.utc).timestamp()
        return int(events.loc[events.deadline_time_epoch > now_ts, "id"].min())

    @ensure_loaded
    async def fetch_team_picks(self, team_id: str, gameweek: int | None = None) -> dict:
        gw = gameweek or await self.current_gw()
        url = ENTRY_EVENT_URL.format(team=team_id)
        return await self._get_json(url)

    @ensure_loaded
    async def fixtures_df(self, gw: int | None = None) -> pd.DataFrame:
        gw = gw or await self.current_gw()
        data = await self._get_json(FIXTURES_URL.format(gw=gw))
        df = pd.DataFrame(data)
        name_map = dict(zip(self.teams.id, self.teams.name))
        df["team_a_name"] = df["team_a"].map(name_map)
        df["team_h_name"] = df["team_h"].map(name_map)
        return df

    async def _position_stats(
        self,
        position_code: int,      # 1 GK, 2 DEF, 3 MID, 4 FWD
        last: int,
        xp_weights: tuple[int,int,int]   # (xG-weight , xA-weight , CS-weight or 0)
    ) -> dict[str, pd.DataFrame]:
        """
        Generic routine that builds six DataFrames for a single position:
        all , last5 , home , home_last5 , away , away_last5
        """
        # ── game-week context & fixtures ─────────────────────────────────────────
        players_df = self.players.copy()
        teams_df   = self.teams
        now_ts     = datetime.now(timezone.utc).timestamp()
        events_df  = pd.DataFrame(self._bootstrap["events"])
        next_gw    = int(events_df.loc[events_df.deadline_time_epoch > now_ts, "id"].min())
        last_gw    = next_gw - 1

        fixtures     = await self.fixtures_df(gw=last_gw + 1)
        fixtures     = fixtures.drop(columns=["id"], errors="ignore")
        name_map     = dict(zip(teams_df.id, teams_df.name))
        home_opp_map = dict(zip(fixtures.team_h, fixtures.team_a.map(name_map)))
        away_opp_map = dict(zip(fixtures.team_a, fixtures.team_h.map(name_map)))

        # ── filter to position and annotate opponent / home-away flags ──────────
        pos_df = players_df[players_df.element_type == position_code].copy()
        hmap   = pos_df.team.map(home_opp_map)
        amap   = pos_df.team.map(away_opp_map)
        pos_df["Home/Away"]    = np.where(hmap.notna(), "Home",
                            np.where(amap.notna(), "Away", None))
        pos_df["team_against"] = np.where(pos_df["Home/Away"]=="Home", hmap,
                            np.where(pos_df["Home/Away"]=="Away", amap, None))

        # ── initialise record lists ─────────────────────────────────────────────
        recs = {k: [] for k in
                ("all","last5","home","home_last5","away","away_last5")}

        # ── loop through every player ───────────────────────────────────────────
        w_xG , w_xA , w_CS  = xp_weights   # convenience

        for _, row in pos_df.iterrows():
            pid  = row.id
            data = await self._get_json(ELEMENT_URL.format(id=pid))
            hist = pd.DataFrame(data["history"])
            if hist.empty:     # skip players with no history
                continue

            # keep matches w/ >20 minutes
            hist = hist[hist.minutes > 20].copy()
            if hist.empty:
                continue

            # CAST these to numeric
            for col in ("expected_goals", "expected_assists", "expected_goals_conceded"):
                hist[col] = hist[col].astype(float)

            # split 6 scenarios
            all_all  = hist
            all_l5   = hist.tail(last)
            h_all    = hist[hist.was_home==True]
            h_l5     = h_all.tail(last)
            a_all    = hist[hist.was_home==False]
            a_l5     = a_all.tail(last)

            def summarise(df: pd.DataFrame):
                if df.empty:          # guard against 0 minutes
                    return None, None
                df = df.copy()
                # position-specific xPoints weighting
                df["xPoints"] = (
                    df.expected_goals   * w_xG
                    + df.expected_assists * w_xA
                    + (df.minutes // 60)  * 2
                    + np.maximum(0, 1 - df.expected_goals_conceded) * w_CS
                    + (df.saves//3 if position_code==1 else 0)
                    + df.bonus
                    - df.yellow_cards
                    - 2*df.red_cards
                    - 2*df.penalties_missed
                    - 2*df.own_goals
                )
                tot = df.sum(numeric_only=True)
                tot_minutes = pd.to_numeric(tot.minutes, errors='coerce')

                if tot_minutes > 0:
                    # Create a copy of tot with numeric minutes
                    per90 = tot.copy()
                    per90 = per90 / (tot_minutes / 90)
                else:
                    return None, None
                
                return tot, per90

            packs = {
                "all"        : summarise(all_all),
                "last5"      : summarise(all_l5),
                "home"       : summarise(h_all),
                "home_last5" : summarise(h_l5),
                "away"       : summarise(a_all),
                "away_last5" : summarise(a_l5)
            }

            # build base record
            base = dict(
                first_name   = row.first_name,
                second_name  = row.second_name,
                form         = row.form,
                team_against = row.team_against,
                Home_Away    = row["Home/Away"]
            )

            # append to record lists if minutes > 60 AND totals exist
            for key,(tot,per90) in packs.items():
                # FIXED: Check for None (0 minutes) AND insufficient minutes (<=60)
                if tot is None or per90 is None or tot.minutes <= 60:
                    continue
                recs[key].append({
                    **base,
                    "minutes"       : tot.minutes,
                    "xG"            : per90.get("expected_goals",         np.nan),
                    "xA"            : per90.get("expected_assists",       np.nan),
                    "xGC"           : per90.get("expected_goals_conceded",np.nan),
                    "xPoints"       : per90.xPoints,
                    "total_points"  : per90.total_points,
                    "goals_scored"  : per90.get("goals_scored", np.nan),
                    "assists"       : per90.get("assists",       np.nan),
                    "clean_sheets"  : per90.clean_sheets,
                    "goals_conceded": per90.goals_conceded,
                    "bonus"         : per90.bonus,
                    "saves"         : per90.get("saves", np.nan)
                })
        # convert to DataFrames
        return {k: pd.DataFrame.from_records(v) for k,v in recs.items()}

    # ──────────────────────────────────────────────────────────────────────────────
    #  Public wrappers for each position
    # ──────────────────────────────────────────────────────────────────────────────
    @ensure_loaded
    @timed
    async def goalies_stats(self, last:int=5) -> dict[str,pd.DataFrame]:
        # GK weights: goals 6 , assists 3 , clean-sheet 4
        return await self._position_stats(position_code=1, last=last,
                                    xp_weights=(6,3,4))

    @ensure_loaded
    @timed
    async def defenders_stats(self, last:int=5) -> dict[str,pd.DataFrame]:
        # DEF weights: goals 6 , assists 3 , clean-sheet 4
        return await self._position_stats(position_code=2, last=last,
                                    xp_weights=(6,3,4))

    @ensure_loaded
    @timed
    async def midfielders_stats(self, last:int=5) -> dict[str,pd.DataFrame]:
        # MID weights: goals 5 , assists 3 , clean-sheet 1
        return await self._position_stats(position_code=3, last=last,
                                    xp_weights=(5,3,1))

    @ensure_loaded
    @timed
    async def attackers_stats(self, last:int=5) -> dict[str,pd.DataFrame]:
        # FWD weights: goals 4 , assists 3 , clean-sheet 0
        return await self._position_stats(position_code=4, last=last,
                                    xp_weights=(4,3,0))