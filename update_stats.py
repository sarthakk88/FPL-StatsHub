import os
import asyncio
from datetime import datetime
from fpl_client import FPLClient
from understats_client import TeamDataProcessor

# Configuration
OUTPUT_DIR = "data"
POSITIONS = {
    "gk": "goalkeepers",
    "def": "defenders", 
    "mid": "midfielders",
    "fwd": "attackers"
}
SCENARIOS = ["all", "last5", "home", "home_last5", "away", "away_last5"]


async def fetch_and_save():
    """Fetch all player and team statistics and save to CSV files"""
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # Fetch player statistics
    print("Fetching player statistics...")
    async with FPLClient() as client:
        print("Fetching goalkeepers...")
        gk_stats = await client.goalies_stats(last=5)
        
        print("Fetching defenders...")
        def_stats = await client.defenders_stats(last=5)
        
        print("Fetching midfielders...")
        mid_stats = await client.midfielders_stats(last=5)
        
        print("Fetching attackers...")
        fwd_stats = await client.attackers_stats(last=5)
        
        # Store all position data
        position_data = {
            "gk": gk_stats,
            "def": def_stats,
            "mid": mid_stats,
            "fwd": fwd_stats
        }
        
        # Save player stats files
        for pos_key, pos_name in POSITIONS.items():
            pos_stats = position_data[pos_key]
            
            print(f"\nProcessing {pos_key} data...")
            if isinstance(pos_stats, dict):
                print(f"Found scenarios: {list(pos_stats.keys())}")
                # Save each scenario
                for scenario in SCENARIOS:
                    if scenario in pos_stats:
                        filename = f"{pos_name}_{scenario}.csv"
                        filepath = os.path.join(OUTPUT_DIR, filename)
                        pos_stats[scenario].to_csv(filepath, index=False)
                        print(f"✓ Saved {filename}")
                    else:
                        print(f"⚠ Warning: {scenario} not found in {pos_key} data")
            else:
                # Fallback: save as single file
                print(f"Single DataFrame format detected for {pos_key}")
                filename = f"{pos_name}.csv"
                filepath = os.path.join(OUTPUT_DIR, filename)
                if hasattr(pos_stats, 'to_csv'):
                    pos_stats.to_csv(filepath, index=False)
                    print(f"✓ Saved {filename}")

    # Fetch team statistics
    print("\nFetching team statistics...")
    team_proc = TeamDataProcessor()
    all_df, last5_df, home_df, last5_home_df, away_df, last5_away_df = await team_proc.understat_team_data()
    
    # Save team files
    team_files = {
        "team_all_matches.csv": all_df,
        "team_last5_matches.csv": last5_df,
        "team_all_home_matches.csv": home_df,
        "team_last5_home_matches.csv": last5_home_df,
        "team_all_away_matches.csv": away_df,
        "team_last5_away_matches.csv": last5_away_df,
    }
    
    for filename, df in team_files.items():
        filepath = os.path.join(OUTPUT_DIR, filename)
        df.to_csv(filepath, index=False)
        print(f"✓ Saved {filename}")

def git_commit_and_push():
    """Commit and push changes to GitHub"""
    print("\nCommitting changes to GitHub...")
    os.system("git config user.name 'github-actions[bot]'")
    os.system("git config user.email 'github-actions[bot]@users.noreply.github.com'")
    os.system("git add data/*.csv")
    
    timestamp = datetime.utcnow().isoformat()
    commit_msg = f"Daily stats update: {timestamp}"
    os.system(f"git commit -m '{commit_msg}' || echo 'No changes to commit'")
    os.system("git push origin HEAD:main")

async def main():
    """Main execution function"""
    try:
        print(f"🚀 Starting daily stats update at {datetime.now().strftime('%Y-%m-%d %H:%M:%S IST')}")
        await fetch_and_save()
        print("\n✅ Data fetch completed successfully")
        
        # git_commit_and_push()
        # print("✅ Git operations completed")
        
    except Exception as e:
        print(f"❌ Error during execution: {str(e)}")
        raise

if __name__ == "__main__":
    asyncio.run(main())