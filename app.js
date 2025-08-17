// FPL StatHub Application JavaScript

class FPLStatHub {
    constructor() {
        this.data = this.initializeData();
        this.currentMainTab = 'players';
        this.currentPlayerPosition = 'goalkeepers';
        this.selectedView = 'all';
        
        this.teamData = {
            all: null,
            last5: null,
            home: null,
            last5_home: null,
            away: null,
            last5_away: null
        };
        this.playerData = {};
        this.sortState = {
            column: 'pts',
            direction: 'desc'
        };
        this.currentSort = { column: null, direction: 'desc' };
        this.currentView = 'all';
        this.charts = {};
        this.dataFolder = 'data/';
        this.init();
    }

    initializeData() {
        // Expanded data based on provided JSON
        return {
            myTeam: {
                team_name: "Dream Team FC",
                totalPoints: 2134,
                rank: 15872,
                gameweekPoints: 72,
                lastUpdated: "2025-08-01T16:00:00Z",
                players: [
                    {"name":"Alisson","position":"GK","opponent":"ARS (H)","xPoints":5.1,"form":5.2,"captain":false,"total_points":6},
                    {"name":"Trent Alexander-Arnold","position":"DEF","opponent":"CHE (H)","xPoints":6.4,"form":6.8,"captain":false,"total_points":8},
                    {"name":"Virgil van Dijk","position":"DEF","opponent":"CHE (H)","xPoints":5.5,"form":6.2,"captain":false,"total_points":7},
                    {"name":"John Stones","position":"DEF","opponent":"BUR (H)","xPoints":5.0,"form":5.1,"captain":false,"total_points":4},
                    {"name":"Pervis Estupiñán","position":"DEF","opponent":"WHU (A)","xPoints":4.9,"form":4.6,"captain":false,"total_points":5},
                    {"name":"Bukayo Saka","position":"MID","opponent":"MCI (A)","xPoints":6.9,"form":7.5,"captain":false,"total_points":10},
                    {"name":"Mohamed Salah","position":"MID","opponent":"CHE (H)","xPoints":8.2,"form":8.1,"captain":true,"total_points":12},
                    {"name":"Kevin De Bruyne","position":"MID","opponent":"BUR (H)","xPoints":7.6,"form":7.4,"captain":false,"total_points":9},
                    {"name":"Phil Foden","position":"MID","opponent":"BUR (H)","xPoints":6.1,"form":6.0,"captain":false,"total_points":6},
                    {"name":"James Maddison","position":"MID","opponent":"WOL (H)","xPoints":5.7,"form":5.9,"captain":false,"total_points":5},
                    {"name":"Erling Haaland","position":"FWD","opponent":"BUR (H)","xPoints":9.6,"form":8.7,"captain":false,"total_points":11},
                    {"name":"Harry Kane","position":"FWD","opponent":"NEW (A)","xPoints":8.5,"form":7.5,"captain":false,"total_points":9},
                    {"name":"Ollie Watkins","position":"FWD","opponent":"FUL (A)","xPoints":6.2,"form":6.0,"captain":false,"total_points":7},
                    {"name":"Jordan Pickford","position":"GK","opponent":"MCI (A)","xPoints":4.4,"form":4.8,"captain":false,"total_points":3},
                    {"name":"Yoane Wissa","position":"FWD","opponent":"SOU (A)","xPoints":4.5,"form":4.4,"captain":false,"total_points":2}
                ]
            }
        };
    }

    async init() {
        await this.loadAllData();
        this.setupEventListeners();
        this.renderCurrentTab();
        this.renderTeamStats();
    }

    async loadAllData() {
        // Team data files (6 files)
        const teamDataFiles = {
            all: 'team_all_matches.csv',
            last5: 'team_last5_matches.csv',
            home: 'team_all_home_matches.csv',
            home_last5: 'team_last5_home_matches.csv',
            away: 'team_all_away_matches.csv',
            away_last5: 'team_last5_away_matches.csv'
        };

        // Player data files (24 files = 4 positions × 6 scenarios)
        const positions = ['goalkeepers', 'defenders', 'midfielders', 'attackers'];
        const scenarios = ['all', 'last5', 'home', 'home_last5', 'away', 'away_last5'];
        
        const playerDataFiles = {};
        positions.forEach(position => {
            playerDataFiles[position] = {};
            scenarios.forEach(scenario => {
                playerDataFiles[position][scenario] = `${position}_${scenario}.csv`;
            });
        });

        try {
            console.log('Loading all data from folder:', this.dataFolder);
            
            // Load team data
            console.log('Loading team data...');
            const teamLoadPromises = Object.entries(teamDataFiles).map(async ([key, filename]) => {
                const filepath = `${this.dataFolder}${filename}`;
                console.log(`Loading team ${key} data from:`, filepath);
                
                try {
                    const response = await fetch(filepath);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const csvText = await response.text();
                    this.teamData[key] = this.parseCSV(csvText);
                    console.log(`Successfully loaded team ${key} data:`, this.teamData[key].length, 'teams');
                } catch (error) {
                    console.error(`Error loading team ${key} data from ${filepath}:`, error);
                    this.teamData[key] = [];
                }
            });

            // Load player data
            console.log('Loading player data...');
            const playerLoadPromises = [];
            
            positions.forEach(position => {
                this.playerData[position] = {};
                
                scenarios.forEach(scenario => {
                    const filename = playerDataFiles[position][scenario];
                    const filepath = `${this.dataFolder}${filename}`;
                    
                    const promise = (async () => {
                        console.log(`Loading ${position} ${scenario} data from:`, filepath);
                        
                        try {
                            const response = await fetch(filepath);
                            if (!response.ok) {
                                throw new Error(`HTTP error! status: ${response.status}`);
                            }
                            const csvText = await response.text();
                            this.playerData[position][scenario] = this.parseCSV(csvText);
                            console.log(`Successfully loaded ${position} ${scenario} data:`, 
                                       this.playerData[position][scenario].length, 'players');
                        } catch (error) {
                            console.error(`Error loading ${position} ${scenario} data from ${filepath}:`, error);
                            this.playerData[position][scenario] = [];
                        }
                    })();
                    
                    playerLoadPromises.push(promise);
                });
            });

            // Wait for all data to load
            await Promise.all([...teamLoadPromises, ...playerLoadPromises]);
            
            console.log('All data loaded successfully');
            console.log('Team data keys:', Object.keys(this.teamData));
            console.log('Player data structure:', Object.keys(this.playerData));
            
        } catch (error) {
            console.error('Error in loadAllData:', error);
        }
    }

    parseCSV(csvText) {
        if (!csvText || csvText.trim() === '') {
            console.warn('Empty CSV data received');
            return [];
        }
        
        const lines = csvText.trim().split('\n');
        if (lines.length < 2) {
            console.warn('CSV has insufficient data');
            return [];
        }
        
        const headers = lines[0].split(',').map(h => h.trim());
        console.log('CSV headers:', headers);
        
        return lines.slice(1).map((line, index) => {
            const values = line.split(',').map(v => v.trim());
            const row = {};
            
            headers.forEach((header, headerIndex) => {
                const value = values[headerIndex] || '';
                if (!isNaN(value) && value !== '' && value !== 'N/A') {
                    row[header] = parseFloat(value);
                } else {
                    row[header] = value;
                }
            });
            
            return row;
        }).filter(row => {
            // For team data, filter by team name
            if (row.team && row.team !== '') return true;
            // For player data, filter by player name
            if (row.first_name || row.second_name) return true;
            return false;
        });
    }

    setupEventListeners() {
        // Main tab navigation
        document.querySelectorAll('.main-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchMainTab(e.target.dataset.tab);
            });
        });

        // Load team button
        const loadTeamBtn = document.getElementById('loadTeamBtn');
        if (loadTeamBtn) {
            loadTeamBtn.addEventListener('click', () => {
                this.loadMyTeamData();
            });
        }

        // Table sorting - use event delegation
        document.addEventListener('click', (e) => {
            if (e.target.hasAttribute('data-sort')) {
                this.sortTable(e.target.dataset.sort);
            }
        });

        // Player sub-tabs - use event delegation  
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('sub-tab')) {
                this.switchPlayerPosition(e.target.dataset.position);
            }
        });

        // Team stats view filter
        const statsViewFilter = document.getElementById('statsViewFilter');
        if (statsViewFilter) {
            statsViewFilter.addEventListener('change', (e) => {
                this.currentView = e.target.value;
                console.log('Stats view changed to:', this.currentView);
                this.updateTableTitle();
                this.renderTeamStats();
            });
        }

        // Player view filter 
        const playerViewFilter = document.getElementById('viewFilter');
        if (playerViewFilter) {
            playerViewFilter.addEventListener('change', (e) => {
                this.selectedView = e.target.value;
                console.log('Player view changed to:', this.selectedView);
                if (this.currentMainTab === 'players') {
                    this.renderPlayersContent();
                }
            });
        }

        // Sort listeners for table headers
        this.setupSortListeners();
    }

    getCurrentData() {
        const data = this.teamData[this.currentView];
        if (!data || data.length === 0) {
            console.warn(`No data available for view: ${this.currentView}`);
            return [];
        }
        console.log(`Using ${this.currentView} data:`, data.length, 'teams');
        return data;
    }

    getPlayerData() {
        const position = this.currentPlayerPosition;
        const view = this.selectedView || 'all';

        if (!this.playerData[position] || !this.playerData[position][view]) {
            console.warn(`No player data for position=${position}, view=${view}`);
            return [];
        }

        let data = this.playerData[position][view]; // ✅ Use let
        console.log(`Using player data for ${position} - ${view}:`, data.length, 'players');

        // Apply sorting if a sort column is set
        if (this.currentSort.column) {
            data = this.sortPlayerData(data); // ✅ Fixed
        } else {
            data = data.sort((a, b) => (b.xPoints || 0) - (a.xPoints || 0)); // ✅ Fixed
        }

        return data;
    }


    setupSortListeners() {
        document.addEventListener('click', (e) => {
            const sortableHeader = e.target.closest('.sortable');
            if (sortableHeader) {
                const column = sortableHeader.getAttribute('data-sort');
                const type = sortableHeader.getAttribute('data-type');
                this.handleSort(column, type);
            }
        });
    }

    handleSort(column, type) {
        // Toggle direction if same column, otherwise set to desc for numbers, asc for strings
        if (this.sortState.column === column) {
            this.sortState.direction = this.sortState.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortState.direction = type === 'number' ? 'desc' : 'asc';
        }
        
        this.sortState.column = column;
        console.log('Sorting by:', column, this.sortState.direction);
        
        this.updateSortIcons();
        this.renderLeagueTable();
    }

    updateSortIcons() {
        // Remove all sort classes
        document.querySelectorAll('.sortable').forEach(header => {
            header.classList.remove('sort-asc', 'sort-desc');
        });

        // Add sort class to current column
        const currentHeader = document.querySelector(`[data-sort="${this.sortState.column}"]`);
        if (currentHeader) {
            currentHeader.classList.add(`sort-${this.sortState.direction}`);
        }
    }

    sortData(data) {
        return [...data].sort((a, b) => {
            let aValue = a[this.sortState.column];
            let bValue = b[this.sortState.column];

            // Handle position sorting specially
            if (this.sortState.column === 'position') {
                // Calculate position based on points if not available
                const aPos = data.findIndex(team => team.team === a.team) + 1;
                const bPos = data.findIndex(team => team.team === b.team) + 1;
                aValue = aPos;
                bValue = bPos;
            }

            // Handle string comparison
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = (bValue || '').toLowerCase();
                if (this.sortState.direction === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            }

            // Handle numeric comparison
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;

            if (this.sortState.direction === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
    }

    sortPlayerData(data) {
        return [...data].sort((a, b) => {
            let aValue = a[this.currentSort.column];
            let bValue = b[this.currentSort.column];

            // Handle special column mappings for player data
            if (this.currentSort.column === 'name') {
                // Sort by full name (first_name + second_name)
                aValue = `${a.first_name || ''} ${a.second_name || ''}`.trim();
                bValue = `${b.first_name || ''} ${b.second_name || ''}`.trim();
            }

            // Handle form column specifically (might be number or string)
            if (this.currentSort.column === 'form') {
                aValue = parseFloat(a.form) || 0;
                bValue = parseFloat(b.form) || 0;
            }

            // Handle opponent column (team_against)
            if (this.currentSort.column === 'opponent') {
                aValue = a.team_against || '';
                bValue = b.team_against || '';
            }

            // Handle Home/Away column
            if (this.currentSort.column === 'home_away') {
                aValue = a.Home_Away || '';
                bValue = b.Home_Away || '';
            }

            // Handle string comparison
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = (bValue || '').toLowerCase();
                if (this.currentSort.direction === 'asc') {
                    return aValue.localeCompare(bValue);
                } else {
                    return bValue.localeCompare(aValue);
                }
            }

            // Handle numeric comparison (convert to numbers first)
            aValue = parseFloat(aValue) || 0;
            bValue = parseFloat(bValue) || 0;

            if (this.currentSort.direction === 'asc') {
                return aValue - bValue;
            } else {
                return bValue - aValue;
            }
        });
    }

    updateTableTitle() {
        const titleElement = document.getElementById('tableTitle');
        if (!titleElement) return;

        const titleMap = {
            all: 'Premier League Table - All Fixtures',
            last5: 'Premier League Form - Last 5 Fixtures', 
            home: 'Premier League Table - Home Only',
            last5_home: 'Premier League Form - Last 5 Home',
            away: 'Premier League Table - Away Only',
            last5_away: 'Premier League Form - Last 5 Away'
        };

        titleElement.textContent = titleMap[this.currentView] || 'Premier League Table';
    }

    renderTeamStats() {
        const currentData = this.getCurrentData();
        
        if (currentData.length === 0) {
            this.showNoDataMessage();
            return;
        }

        this.renderLeagueTable();
        
        // Delay chart rendering to ensure canvas is visible
        setTimeout(() => {
            this.renderNpxChart();
        }, 100);
    }

    showNoDataMessage() {
        const tbody = document.getElementById('leagueTable');
        if (tbody) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="14" class="no-data">
                        No data available for ${this.currentView} view. Please check if the data files are properly loaded.
                    </td>
                </tr>
            `;
        }
    }

    switchMainTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.main-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(tabName).classList.add('active');

        this.currentMainTab = tabName;
        this.currentSort = { column: null, direction: 'desc' }; // Reset sort
        
        // Render content for the new tab
        setTimeout(() => {
            this.renderCurrentTab();
        }, 50);
    }

    switchPlayerPosition(position) {
        // Update sub-tab buttons
        document.querySelectorAll('.sub-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-position="${position}"]`).classList.add('active');

        this.currentPlayerPosition = position;
        this.currentSort = { column: null, direction: 'desc' };
        this.renderPlayersContent();
    }

    renderCurrentTab() {
        if (this.currentMainTab === 'my-team') {
            this.loadMyTeamData();
        } else if (this.currentMainTab === 'players') {
            this.renderPlayersTab();
        } else if (this.currentMainTab === 'team-stats') {
            this.renderTeamStats();
        }
    }

    loadMyTeamData() {
        // Update summary cards
        document.getElementById('totalPoints').textContent = this.data.myTeam.totalPoints.toLocaleString();
        document.getElementById('overallRank').textContent = this.data.myTeam.rank.toLocaleString();
        document.getElementById('gameweekPoints').textContent = this.data.myTeam.gameweekPoints;

        this.renderMyTeamPlayers();
        
        // Delay chart rendering to ensure canvas is visible
        setTimeout(() => {
            this.renderTeamPointsChart();
        }, 100);
    }

    renderMyTeamPlayers() {
        const tbody = document.getElementById('teamPlayersTable');
        if (!tbody) return;

        tbody.innerHTML = this.data.myTeam.players.map(player => {
            const positionClass = this.getPositionClass(player.position);
            const formClass = this.getFormClass(player.form);
            const captainBadge = player.captain ? '<span class="captain-badge">C</span>' : '';

            return `
                <tr>
                    <td><span class="player-name">${player.name}</span></td>
                    <td><span class="position-badge ${positionClass}">${player.position}</span></td>
                    <td>${player.opponent}</td>
                    <td>${player.xPoints.toFixed(1)}</td>
                    <td><span class="${formClass}">${player.form.toFixed(1)}</span></td>
                    <td><strong>${player.total_points}</strong></td>
                    <td>${captainBadge}</td>
                </tr>
            `;
        }).join('');
    }

    renderTeamPointsChart() {
        const ctx = document.getElementById('teamPointsChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.teamPoints) {
            this.charts.teamPoints.destroy();
        }

        const players = this.data.myTeam.players.sort((a, b) => b.total_points - a.total_points);
        
        this.charts.teamPoints = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: players.map(p => p.name.split(' ').pop()),
                datasets: [{
                    label: 'Points',
                    data: players.map(p => p.total_points),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B', '#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Points'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Players'
                        }
                    }
                }
            }
        });
    }


    renderPlayersTab() {
        // Render the player sub-navigation (tabs wired elsewhere)
        this.renderPlayersContent();
    }

    renderPlayersContent() {
        const container = document.getElementById('playersContent');
        if (!container) return;

        // Use getPlayerData() to get current player list based on position & view
        const data = this.getPlayerData();

        // Render table with data
        container.innerHTML = this.generatePlayerTable(data);
    }

    generatePlayerTable(data) {
        if (!data.length) {
            return `
                <div class="table-container">
                    <p style="text-align:center; padding:2rem; color:var(--color-text-secondary);">
                        No players match the current filters
                    </p>
                </div>`;
        }

        const headers = this.getTableHeaders(this.currentPlayerPosition);
        const rows = data.map(player => this.generatePlayerRow(player)).join('');

        return `
            <div class="table-container">
                <table class="stats-table">
                    <thead><tr>${headers}</tr></thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>`;
    }

    getTableHeaders(position) {
        // Common headers for all with data-sort attributes
        let base = `
            <th data-sort="first_name" class="sortable">First Name</th>
            <th data-sort="second_name" class="sortable">Second Name</th>
            <th data-sort="form" class="sortable">Form</th>
            <th data-sort="team_against" class="sortable">Opponent</th>
            <th data-sort="Home_Away" class="sortable">Home/Away</th>
            <th data-sort="minutes" class="sortable">Minutes</th>`;

        switch (position) {
            case 'goalkeepers':
                base += `
                    <th data-sort="xGC" class="sortable">xGC</th>
                    <th data-sort="total_points" class="sortable">Points</th>
                    <th data-sort="xPoints" class="sortable">xPoints</th>
                    <th data-sort="clean_sheets" class="sortable">Clean Sheets</th>
                    <th data-sort="goals_conceded" class="sortable">Goals Conceded</th>
                    <th data-sort="bonus" class="sortable">Bonus</th>
                    <th data-sort="saves" class="sortable">Saves</th>
                    <th data-sort="penalties_saved" class="sortable">Penalties Saved</th>
                    <th data-sort="yellow_cards" class="sortable">Yellow Cards</th>
                    <th data-sort="red_cards" class="sortable">Red Cards</th>`;
                break;
            case 'defenders':
                base += `
                    <th data-sort="xG" class="sortable">xG</th>
                    <th data-sort="xA" class="sortable">xA</th>
                    <th data-sort="xGC" class="sortable">xGC</th>
                    <th data-sort="total_points" class="sortable">Points</th>
                    <th data-sort="xPoints" class="sortable">xPoints</th>
                    <th data-sort="goals_scored" class="sortable">Goals</th>
                    <th data-sort="assists" class="sortable">Assists</th>
                    <th data-sort="clean_sheets" class="sortable">Clean Sheets</th>
                    <th data-sort="goals_conceded" class="sortable">Goals Conceded</th>
                    <th data-sort="clearances_blocks_interceptions" class="sortable">CBI</th>
                    <th data-sort="recoveries" class="sortable">Recoveries</th>
                    <th data-sort="tackles" class="sortable">Tackles</th>
                    <th data-sort="defensive_contribution" class="sortable">Def Contrib</th>
                    <th data-sort="bonus" class="sortable">Bonus</th>
                    <th data-sort="yellow_cards" class="sortable">Yellow Cards</th>
                    <th data-sort="red_cards" class="sortable">Red Cards</th>`;
                break;
            case 'midfielders':
                base += `
                    <th data-sort="xG" class="sortable">xG</th>
                    <th data-sort="xA" class="sortable">xA</th>
                    <th data-sort="xGC" class="sortable">xGC</th>
                    <th data-sort="total_points" class="sortable">Points</th>
                    <th data-sort="xPoints" class="sortable">xPoints</th>
                    <th data-sort="goals_scored" class="sortable">Goals</th>
                    <th data-sort="assists" class="sortable">Assists</th>
                    <th data-sort="clean_sheets" class="sortable">Clean Sheets</th>
                    <th data-sort="goals_conceded" class="sortable">Goals Conceded</th>
                    <th data-sort="clearances_blocks_interceptions" class="sortable">CBI</th>
                    <th data-sort="recoveries" class="sortable">Recoveries</th>
                    <th data-sort="tackles" class="sortable">Tackles</th>
                    <th data-sort="defensive_contribution" class="sortable">Def Contrib</th>
                    <th data-sort="bonus" class="sortable">Bonus</th>
                    <th data-sort="yellow_cards" class="sortable">Yellow Cards</th>
                    <th data-sort="red_cards" class="sortable">Red Cards</th>`;
                break;
            case 'attackers':
                base += `
                    <th data-sort="xG" class="sortable">xG</th>
                    <th data-sort="xA" class="sortable">xA</th>
                    <th data-sort="total_points" class="sortable">Points</th>
                    <th data-sort="xPoints" class="sortable">xPoints</th>
                    <th data-sort="goals_scored" class="sortable">Goals</th>
                    <th data-sort="assists" class="sortable">Assists</th>
                    <th data-sort="bonus" class="sortable">Bonus</th>
                    <th data-sort="defensive_contribution" class="sortable">Def Contrib</th>
                    <th data-sort="yellow_cards" class="sortable">Yellow Cards</th>
                    <th data-sort="red_cards" class="sortable">Red Cards</th>`;
                break;
        }

        return base;
    }

    generatePlayerRow(player) {
        const firstName = player.first_name ?? '';
        const secondName = player.second_name ?? '';
        const badge = player.Home_Away ? `<span class="badge badge-${player.Home_Away.toLowerCase()}">${player.Home_Away}</span>` : '';
        const formClass = this.getFormClass ? this.getFormClass(player.form) : '';

        const base = `
            <td>${firstName}</td>
            <td>${secondName}</td>
            <td>${player.form?.toFixed(2) ?? '0.0'}</td>
            <td>${player.team_against ?? ''} ${badge}</td>
            <td>${player.Home_Away ?? ''}</td>
            <td>${player.minutes?.toLocaleString() ?? '0'}</td>`;

        switch(this.currentPlayerPosition) {
            case 'goalkeepers':
                return `
                    <tr>${base}
                        <td>${player.xGC?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.total_points?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.xPoints?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.clean_sheets?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.goals_conceded?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.bonus?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.saves?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.penalties_saved?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.yellow_cards?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.red_cards?.toFixed(2) ?? '0.0'}</td>
                    </tr>`;
            case 'defenders':
                return `
                    <tr>${base}
                        <td>${player.xG?.toFixed(2) ?? '0.00'}</td>
                        <td>${player.xA?.toFixed(2) ?? '0.00'}</td>
                        <td>${player.xGC?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.total_points?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.xPoints?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.goals_scored?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.assists?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.clean_sheets?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.goals_conceded?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.clearances_blocks_interceptions?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.recoveries?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.tackles?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.defensive_contribution?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.bonus?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.yellow_cards?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.red_cards?.toFixed(2) ?? '0.0'}</td>
                    </tr>`;
            case 'midfielders':
                return `
                    <tr>${base}
                        <td>${player.xG?.toFixed(2) ?? '0.00'}</td>
                        <td>${player.xA?.toFixed(2) ?? '0.00'}</td>
                        <td>${player.xGC?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.total_points?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.xPoints?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.goals_scored?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.assists?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.clean_sheets?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.goals_conceded?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.clearances_blocks_interceptions?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.recoveries?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.tackles?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.defensive_contribution?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.bonus?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.yellow_cards?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.red_cards?.toFixed(2) ?? '0.0'}</td>
                    </tr>`;
            case 'attackers':
                return `
                    <tr>${base}
                        <td>${player.xG?.toFixed(2) ?? '0.00'}</td>
                        <td>${player.xA?.toFixed(2) ?? '0.00'}</td>
                        <td>${player.total_points?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.xPoints?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.goals_scored?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.assists?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.bonus?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.defensive_contribution?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.yellow_cards?.toFixed(2) ?? '0.0'}</td>
                        <td>${player.red_cards?.toFixed(2) ?? '0.0'}</td>
                    </tr>`;
            default:
                return `<tr>${base}</tr>`;
        }
    }

    renderLeagueTable() {
        const tbody = document.getElementById('leagueTable');
        if (!tbody) return;

        const currentData = this.getCurrentData();
        if (currentData.length === 0) {
            this.showNoDataMessage();
            return;
        }

        // Sort data based on current sort state
        const sortedData = this.sortData(currentData);

        tbody.innerHTML = sortedData.map((team, index) => {
            // Position is based on current sort order, or calculated from points
            const position = this.sortState.column === 'pts' ? index + 1 : 
                            [...currentData].sort((a, b) => (b.pts || 0) - (a.pts || 0))
                            .findIndex(t => t.team === team.team) + 1;
                            
            const positionClass = this.getLeaguePositionClass(position);
            
            return `
                <tr class="${positionClass}">
                    <td>
                        <span class="league-position ${positionClass}">${position}</span>
                    </td>
                    <td class="sticky-column">
                        <span class="team-name">${team.team || 'N/A'}</span>
                    </td>
                    <td><strong>${(team.pts || 0).toFixed(2)}</strong></td>
                    <td>${(team.wins || 0).toFixed(2)}</td>
                    <td>${(team.draws || 0).toFixed(2)}</td>
                    <td>${(team.loses || 0).toFixed(2)}</td>
                    <td>${(team.scored || 0).toFixed(2)}</td>
                    <td>${(team.conceded || 0).toFixed(2)}</td>
                    <td>${(team.xG || 0).toFixed(2)}</td>
                    <td>${(team.xGA || 0).toFixed(2)}</td>
                    <td>${(team.npxG || 0).toFixed(2)}</td>
                    <td>${(team.npxGA || 0).toFixed(2)}</td>
                    <td>${(team.npxGD || 0).toFixed(2)}</td>                    
                    <td>${(team.xpts || 0).toFixed(2)}</td>
                    <td>${(team.ppda || 0).toFixed(2)}</td>
                    <td>${(team.ppda_allowed || 0).toFixed(2)}</td>
                    <td>${(team.deep || 0).toFixed(2)}</td>
                    <td>${(team.deep_allowed || 0).toFixed(2)}</td>
                </tr>
            `;
        }).join('');
    }

    renderNpxChart() {
    const ctx = document.getElementById('npxChart');
    if (!ctx) return;
    if (this.charts.npx) this.charts.npx.destroy();

    const data = this.getCurrentData();
    if (!data.length) return;

    // Scatter data points
    const points = data.map(team => ({
        x: team.npxG || 0,
        y: team.npxGA || 0,
        label: team.team
    }));

    this.charts.npx = new Chart(ctx, {
        type: 'scatter',
        data: { datasets: [{ label: 'Teams', data: points, backgroundColor: 'rgba(33,128,141,0.6)' }] },
        options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            tooltip: {
            callbacks: {
                label(ctx) {
                const p = ctx.raw;
                return `${p.label}: npxG ${p.x.toFixed(2)}, npxGA ${p.y.toFixed(2)}`;
                }
            }
            }
        },
        scales: {
            x: { title: { display: true, text: 'Non-Penalty xG' } },
            y: { title: { display: true, text: 'Non-Penalty xGA' }, reverse: true }
        }
        }
    });
    }

    getViewDisplayName() {
        const displayNames = {
            all: 'All Fixtures',
            last5: 'Last 5 Fixtures',
            home: 'Home Only',
            last5_home: 'Last 5 Home',
            away: 'Away Only',
            last5_away: 'Last 5 Away'
        };
        return displayNames[this.currentView] || this.currentView;
    }

    getLeaguePositionClass(position) {
        if (position <= 4) return 'champions-league';
        if (position <= 6) return 'europa-league';
        if (position >= 18) return 'relegation';
        return '';
    }

    async refreshData() {
        console.log('Refreshing team data...');
        await this.loadAllData();
        this.renderTeamStats();
    }

    sortTable(column) {
        if (this.currentSort.column === column) {
            this.currentSort.direction = this.currentSort.direction === 'asc' ? 'desc' : 'asc';
        } else {
            this.currentSort.column = column;
            this.currentSort.direction = 'desc';
        }

        // Update sort indicators
        document.querySelectorAll('[data-sort]').forEach(th => {
            th.classList.remove('sort-asc', 'sort-desc');
        });
        
        const currentTh = document.querySelector(`[data-sort="${column}"]`);
        if (currentTh) {
            currentTh.classList.add(`sort-${this.currentSort.direction}`);
        }

        if (this.currentMainTab === 'players') {
            this.renderPlayersContent();
        } else if (this.currentMainTab === 'team-stats') {
            this.renderLeagueTable();
        }
    }

    getPositionClass(position) {
        switch(position) {
            case 'GK': return 'gk';
            case 'DEF': return 'def';
            case 'MID': return 'mid';
            case 'FWD': return 'fwd';
            default: return '';
        }
    }

    getFormClass(form) {
        if (form >= 7.5) return 'form-excellent';
        if (form >= 6.0) return 'form-good';
        if (form >= 4.0) return 'form-average';
        return 'form-poor';
    }

    getLeaguePositionClass(position) {
        if (position <= 4) return 'top-4';
        if (position <= 7) return 'europe';
        if (position >= 18) return 'relegation';
        return 'mid-table';
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FPLStatHub();
});