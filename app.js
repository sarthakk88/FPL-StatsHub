// FPL StatHub Application JavaScript

class FPLStatHub {
    constructor() {
        this.data = this.initializeData();
        this.currentMainTab = 'my-team';
        this.currentPlayerPosition = 'goalkeepers';
        this.filters = {
            minutes: 500,
            form: 0,
            xPoints: 0,
            venue: 'all'
        };
        this.teamData = {
            all: null,
            last5: null,
            home: null,
            last5_home: null,
            away: null,
            last5_away: null
        };
        this.sortState = {
            column: 'pts',
            direction: 'desc'
        };
        this.currentSort = { column: null, direction: 'desc' };
        this.currentView = 'all'; ///Teams
        this.charts = {}; ///Teams
        this.dataFolder = 'data/'; ///Teams
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
            },
            goalkeepers: [
                {"name":"Alisson","team":"Liverpool","price":5.6,"points":142,"form":5.2,"xG":0.0,"xA":0.0,"xPoints":4.8,"minutes":3240,"opponent":"Arsenal","homeAway":"H","cleanSheets":18,"saves":95,"xGC":28.5},
                {"name":"Jordan Pickford","team":"Everton","price":5.0,"points":138,"form":4.8,"xG":0.0,"xA":0.0,"xPoints":4.2,"minutes":3150,"opponent":"Man City","homeAway":"A","cleanSheets":12,"saves":108,"xGC":45.2},
                {"name":"Aaron Ramsdale","team":"Arsenal","price":5.2,"points":135,"form":5.0,"xG":0.0,"xA":0.0,"xPoints":4.6,"minutes":2880,"opponent":"Liverpool","homeAway":"A","cleanSheets":14,"saves":89,"xGC":35.1},
                {"name":"Nick Pope","team":"Newcastle","price":5.1,"points":140,"form":5.3,"xG":0.0,"xA":0.0,"xPoints":4.9,"minutes":3060,"opponent":"Brighton","homeAway":"H","cleanSheets":16,"saves":102,"xGC":32.8},
                {"name":"José Sá","team":"Wolves","price":4.8,"points":125,"form":4.5,"xG":0.0,"xA":0.0,"xPoints":4.1,"minutes":2970,"opponent":"Tottenham","homeAway":"A","cleanSheets":10,"saves":115,"xGC":42.3},
                {"name":"Kepa Arrizabalaga","team":"Chelsea","price":5.3,"points":118,"form":4.2,"xG":0.0,"xA":0.0,"xPoints":3.9,"minutes":2520,"opponent":"Liverpool","homeAway":"A","cleanSheets":9,"saves":92,"xGC":38.7}
            ],
            defenders: [
                {"name":"Trent Alexander-Arnold","team":"Liverpool","price":7.1,"points":158,"form":6.8,"xG":0.07,"xA":0.29,"xPoints":6.4,"minutes":2876,"opponent":"Arsenal","homeAway":"H","cleanSheets":14,"goals":2,"assists":8},
                {"name":"Virgil van Dijk","team":"Liverpool","price":6.2,"points":134,"form":6.2,"xG":0.09,"xA":0.04,"xPoints":5.5,"minutes":3298,"opponent":"Arsenal","homeAway":"H","cleanSheets":16,"goals":3,"assists":1},
                {"name":"John Stones","team":"Man City","price":5.8,"points":125,"form":5.1,"xG":0.05,"xA":0.02,"xPoints":5.0,"minutes":2654,"opponent":"Burnley","homeAway":"H","cleanSheets":19,"goals":1,"assists":2},
                {"name":"William Saliba","team":"Arsenal","price":5.9,"points":142,"form":6.1,"xG":0.08,"xA":0.03,"xPoints":5.8,"minutes":3150,"opponent":"Liverpool","homeAway":"A","cleanSheets":15,"goals":2,"assists":1},
                {"name":"Kieran Trippier","team":"Newcastle","price":6.8,"points":145,"form":6.5,"xG":0.04,"xA":0.22,"xPoints":6.1,"minutes":2734,"opponent":"Brighton","homeAway":"H","cleanSheets":12,"goals":1,"assists":6},
                {"name":"Reece James","team":"Chelsea","price":6.5,"points":128,"form":5.8,"xG":0.06,"xA":0.18,"xPoints":5.9,"minutes":2456,"opponent":"Liverpool","homeAway":"A","cleanSheets":11,"goals":2,"assists":5},
                {"name":"Kyle Walker","team":"Man City","price":6.0,"points":132,"form":5.9,"xG":0.02,"xA":0.08,"xPoints":5.2,"minutes":2876,"opponent":"Burnley","homeAway":"H","cleanSheets":18,"goals":0,"assists":3},
                {"name":"Gabriel Magalhães","team":"Arsenal","price":5.7,"points":139,"form":6.0,"xG":0.11,"xA":0.02,"xPoints":5.6,"minutes":3015,"opponent":"Liverpool","homeAway":"A","cleanSheets":14,"goals":4,"assists":0}
            ],
            midfielders: [
                {"name":"Mohamed Salah","team":"Liverpool","price":13.1,"points":187,"form":8.1,"xG":0.67,"xA":0.43,"xPoints":8.2,"minutes":3104,"opponent":"Arsenal","homeAway":"H","goals":18,"assists":12},
                {"name":"Kevin De Bruyne","team":"Man City","price":9.8,"points":156,"form":7.4,"xG":0.31,"xA":0.58,"xPoints":7.6,"minutes":2387,"opponent":"Burnley","homeAway":"H","goals":7,"assists":16},
                {"name":"Bukayo Saka","team":"Arsenal","price":8.9,"points":171,"form":7.5,"xG":0.34,"xA":0.41,"xPoints":6.9,"minutes":2987,"opponent":"Liverpool","homeAway":"A","goals":9,"assists":11},
                {"name":"Phil Foden","team":"Man City","price":8.2,"points":149,"form":6.0,"xG":0.45,"xA":0.28,"xPoints":6.1,"minutes":2543,"opponent":"Burnley","homeAway":"H","goals":11,"assists":8},
                {"name":"James Maddison","team":"Tottenham","price":7.8,"points":134,"form":5.9,"xG":0.38,"xA":0.35,"xPoints":5.7,"minutes":2456,"opponent":"Wolves","homeAway":"H","goals":8,"assists":9},
                {"name":"Bruno Fernandes","team":"Man United","price":8.5,"points":152,"form":6.7,"xG":0.42,"xA":0.33,"xPoints":6.5,"minutes":2734,"opponent":"Sheffield Utd","homeAway":"H","goals":10,"assists":8},
                {"name":"Martin Ødegaard","team":"Arsenal","price":8.1,"points":148,"form":6.4,"xG":0.29,"xA":0.38,"xPoints":6.2,"minutes":2658,"opponent":"Liverpool","homeAway":"A","goals":6,"assists":12},
                {"name":"Jarrod Bowen","team":"West Ham","price":7.5,"points":138,"form":6.1,"xG":0.35,"xA":0.25,"xPoints":5.8,"minutes":2876,"opponent":"Brighton","homeAway":"A","goals":9,"assists":7}
            ],
            attackers: [
                {"name":"Erling Haaland","team":"Man City","price":15.0,"points":195,"form":8.7,"xG":0.89,"xA":0.12,"xPoints":9.6,"minutes":2847,"opponent":"Burnley","homeAway":"H","goals":24,"assists":3},
                {"name":"Harry Kane","team":"Tottenham","price":11.5,"points":168,"form":7.5,"xG":0.74,"xA":0.21,"xPoints":8.5,"minutes":2654,"opponent":"Wolves","homeAway":"H","goals":21,"assists":6},
                {"name":"Ollie Watkins","team":"Aston Villa","price":9.2,"points":145,"form":6.0,"xG":0.52,"xA":0.18,"xPoints":6.2,"minutes":2734,"opponent":"Fulham","homeAway":"A","goals":14,"assists":5},
                {"name":"Darwin Núñez","team":"Liverpool","price":8.8,"points":132,"form":5.8,"xG":0.61,"xA":0.15,"xPoints":6.0,"minutes":2456,"opponent":"Arsenal","homeAway":"H","goals":13,"assists":4},
                {"name":"Yoane Wissa","team":"Brentford","price":6.1,"points":118,"form":4.4,"xG":0.41,"xA":0.08,"xPoints":4.5,"minutes":2187,"opponent":"Southampton","homeAway":"A","goals":10,"assists":2},
                {"name":"Ivan Toney","team":"Brentford","price":7.2,"points":141,"form":6.3,"xG":0.58,"xA":0.14,"xPoints":6.1,"minutes":2543,"opponent":"Southampton","homeAway":"A","goals":15,"assists":4},
                {"name":"Callum Wilson","team":"Newcastle","price":7.8,"points":128,"form":5.7,"xG":0.64,"xA":0.11,"xPoints":5.9,"minutes":2298,"opponent":"Brighton","homeAway":"H","goals":12,"assists":3},
                {"name":"Alexander Isak","team":"Newcastle","price":8.5,"points":136,"form":6.1,"xG":0.59,"xA":0.13,"xPoints":6.0,"minutes":2456,"opponent":"Brighton","homeAway":"H","goals":13,"assists":3}
            ]
        };
    }

    async init() {
        await this.loadAllData();
        this.setupEventListeners();
        this.renderCurrentTab();
        this.renderTeamStats();
    }

    async loadAllData() {
        const dataFiles = {
            all: 'team_all_matches.csv',
            last5: 'team_last5_matches.csv',
            home: 'team_all_home_matches.csv',
            last5_home: 'team_last5_home_matches.csv',
            away: 'team_all_away_matches.csv',
            last5_away: 'team_last5_away_matches.csv'
        };

        try {
            console.log('Loading team data from folder:', this.dataFolder);
            
            const loadPromises = Object.entries(dataFiles).map(async ([key, filename]) => {
                const filepath = `${this.dataFolder}${filename}`;
                console.log(`Loading ${key} data from:`, filepath);
                
                try {
                    const response = await fetch(filepath);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const csvText = await response.text();
                    this.teamData[key] = this.parseCSV(csvText);
                    console.log(`Successfully loaded ${key} data:`, this.teamData[key].length, 'teams');
                } catch (error) {
                    console.error(`Error loading ${key} data from ${filepath}:`, error);
                    this.teamData[key] = [];
                }
            });

            await Promise.all(loadPromises);
            console.log('All team data loaded successfully');
            
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
        }).filter(row => row.team && row.team !== '');
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

        // Filters
        this.setupFilters();

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

        // View filter listener
        const viewFilter = document.getElementById('statsViewFilter');
        if (viewFilter) {
            viewFilter.addEventListener('change', (e) => {
                this.currentView = e.target.value;
                console.log('View changed to:', this.currentView);
                this.updateTableTitle();
                this.renderTeamStats();
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
            this.renderGoalsChart();
            this.renderXGoalsChart(); 
            this.renderPointsChart();
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

    setupFilters() {
        const minutesFilter = document.getElementById('minutesFilter');
        if (minutesFilter) {
            minutesFilter.addEventListener('input', (e) => {
                this.filters.minutes = parseInt(e.target.value);
                document.getElementById('minutesValue').textContent = e.target.value;
                if (this.currentMainTab === 'players') {
                    this.renderPlayersContent();
                }
            });
        }

        const formFilter = document.getElementById('formFilter');
        if (formFilter) {
            formFilter.addEventListener('input', (e) => {
                this.filters.form = parseFloat(e.target.value);
                document.getElementById('formValue').textContent = e.target.value + '+';
                if (this.currentMainTab === 'players') {
                    this.renderPlayersContent();
                }
            });
        }

        const xPointsFilter = document.getElementById('xPointsFilter');
        if (xPointsFilter) {
            xPointsFilter.addEventListener('input', (e) => {
                this.filters.xPoints = parseFloat(e.target.value);
                document.getElementById('xPointsValue').textContent = e.target.value + '+';
                if (this.currentMainTab === 'players') {
                    this.renderPlayersContent();
                }
            });
        }

        const venueFilter = document.getElementById('venueFilter');
        if (venueFilter) {
            venueFilter.addEventListener('change', (e) => {
                this.filters.venue = e.target.value;
                if (this.currentMainTab === 'players') {
                    this.renderPlayersContent();
                }
            });
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
        // Create sub-navigation and content for players tab
        this.renderPlayersContent();
    }

    renderPlayersContent() {
        const playersContent = document.getElementById('playersContent');
        if (!playersContent) return;

        const rawData = this.data[this.currentPlayerPosition] || [];
        const filteredData = this.filterPlayerData(rawData);
        const sortedData = this.sortData(filteredData);

        const tableHTML = this.generatePlayerTable(sortedData);
        playersContent.innerHTML = tableHTML;
    }

    generatePlayerTable(data) {
        if (data.length === 0) {
            return '<div class="table-container"><p style="text-align: center; padding: 2rem; color: var(--color-text-secondary);">No players match the current filters</p></div>';
        }

        const headers = this.getTableHeaders(this.currentPlayerPosition);
        const rows = data.map(player => this.generatePlayerRow(player)).join('');

        return `
            <div class="table-container">
                <table class="stats-table">
                    <thead>
                        <tr>${headers}</tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </div>
        `;
    }

    getTableHeaders(position) {
        const baseHeaders = `
            <th data-sort="name">Player</th>
            <th data-sort="team">Team</th>
            <th data-sort="minutes">Minutes</th>
        `;

        if (position === 'goalkeepers') {
            return baseHeaders + `
                <th data-sort="points">Points</th>
                <th data-sort="xPoints">xPoints</th>
                <th data-sort="cleanSheets">Clean Sheets</th>
                <th data-sort="saves">Saves</th>
                <th data-sort="xGC">xGC</th>
                <th data-sort="form">Form</th>
                <th data-sort="opponent">Next Fixture</th>
            `;
        } else if (position === 'defenders') {
            return baseHeaders + `
                <th data-sort="xG">xG</th>
                <th data-sort="xA">xA</th>
                <th data-sort="points">Points</th>
                <th data-sort="xPoints">xPoints</th>
                <th data-sort="cleanSheets">Clean Sheets</th>
                <th data-sort="goals">Goals</th>
                <th data-sort="assists">Assists</th>
                <th data-sort="form">Form</th>
                <th data-sort="opponent">Next Fixture</th>
            `;
        } else {
            return baseHeaders + `
                <th data-sort="xG">xG</th>
                <th data-sort="xA">xA</th>
                <th data-sort="points">Points</th>
                <th data-sort="xPoints">xPoints</th>
                <th data-sort="goals">Goals</th>
                <th data-sort="assists">Assists</th>
                <th data-sort="form">Form</th>
                <th data-sort="opponent">Next Fixture</th>
            `;
        }
    }

    generatePlayerRow(player) {
        const formClass = this.getFormClass(player.form);
        const homeAwayBadge = player.homeAway ? 
            `<span class="badge badge-${player.homeAway.toLowerCase()}">${player.homeAway}</span>` : '';

        const baseData = `
            <td><span class="player-name">${player.name}</span></td>
            <td><span class="team-name">${player.team}</span></td>
            <td>${player.minutes.toLocaleString()}</td>
        `;

        if (this.currentPlayerPosition === 'goalkeepers') {
            return `<tr>${baseData}
                <td><strong>${player.points}</strong></td>
                <td>${player.xPoints.toFixed(1)}</td>
                <td>${player.cleanSheets}</td>
                <td>${player.saves}</td>
                <td>${player.xGC.toFixed(1)}</td>
                <td><span class="${formClass}">${player.form.toFixed(1)}</span></td>
                <td>${player.opponent} ${homeAwayBadge}</td>
            </tr>`;
        } else if (this.currentPlayerPosition === 'defenders') {
            return `<tr>${baseData}
                <td>${player.xG.toFixed(2)}</td>
                <td>${player.xA.toFixed(2)}</td>
                <td><strong>${player.points}</strong></td>
                <td>${player.xPoints.toFixed(1)}</td>
                <td>${player.cleanSheets}</td>
                <td>${player.goals}</td>
                <td>${player.assists}</td>
                <td><span class="${formClass}">${player.form.toFixed(1)}</span></td>
                <td>${player.opponent} ${homeAwayBadge}</td>
            </tr>`;
        } else {
            return `<tr>${baseData}
                <td>${player.xG.toFixed(2)}</td>
                <td>${player.xA.toFixed(2)}</td>
                <td><strong>${player.points}</strong></td>
                <td>${player.xPoints.toFixed(1)}</td>
                <td>${player.goals}</td>
                <td>${player.assists}</td>
                <td><span class="${formClass}">${player.form.toFixed(1)}</span></td>
                <td>${player.opponent} ${homeAwayBadge}</td>
            </tr>`;
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
                    <td><strong>${team.pts || 0}</strong></td>
                    <td>${(team.wins || 0).toFixed(2)}</td>
                    <td>${(team.draws || 0).toFixed(2)}</td>
                    <td>${(team.loses || 0).toFixed(2)}</td>
                    <td>${(team.scored || 0).toFixed(2)}</td>
                    <td>${(team.conceded || 0).toFixed(2)}</td>
                    <td>${(team.xG || 0).toFixed(2)}</td>
                    <td>${(team.xGA || 0).toFixed(2)}</td>
                    <td>${(team.npxG || 0).toFixed(2)}</td>
                    <td>${(team.npxGA || 0).toFixed(2)}</td>
                    <td>${(team.xpts || 0).toFixed(2)}</td>
                    <td>${(team.ppda || 0).toFixed(2)}</td>
                    <td>${(team.deep || 0).toFixed(2)}</td>
                </tr>
            `;
        }).join('');
    }

    renderGoalsChart() {
        const ctx = document.getElementById('goalsChart');
        if (!ctx) return;

        if (this.charts.goals) {
            this.charts.goals.destroy();
        }

        const currentData = this.getCurrentData();
        if (currentData.length === 0) return;

        const teams = [...currentData]
            .sort((a, b) => (b.scored || 0) - (a.scored || 0))
            .slice(0, 15); // Show top 15 for better visibility
        
        this.charts.goals = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: teams.map(t => (t.team || '').replace(' United', ' Utd').replace(' City', '')),
                datasets: [
                    {
                        label: 'Goals For',
                        data: teams.map(t => t.scored || 0),
                        backgroundColor: '#1FB8CD'
                    },
                    {
                        label: 'Goals Against',
                        data: teams.map(t => t.conceded || 0),
                        backgroundColor: '#B4413C'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: `Goals Comparison - ${this.getViewDisplayName()}`
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Goals'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Teams'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                }
            }
        });
    }

    renderXGoalsChart() {
        const ctx = document.getElementById('xGoalsChart');
        if (!ctx) return;

        if (this.charts.xGoals) {
            this.charts.xGoals.destroy();
        }

        const currentData = this.getCurrentData();
        if (currentData.length === 0) return;

        const teams = [...currentData]
            .sort((a, b) => (b.xG || 0) - (a.xG || 0))
            .slice(0, 15);
        
        this.charts.xGoals = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: teams.map(t => (t.team || '').replace(' United', ' Utd').replace(' City', '')),
                datasets: [
                    {
                        label: 'Expected Goals (xG)',
                        data: teams.map(t => parseFloat((t.xG || 0).toFixed(2))),
                        backgroundColor: '#FF6B6B'
                    },
                    {
                        label: 'Actual Goals',
                        data: teams.map(t => t.scored || 0),
                        backgroundColor: '#4ECDC4'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: `Expected vs Actual Goals - ${this.getViewDisplayName()}`
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Goals'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Teams'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
                }
            }
        });
    }

    renderPointsChart() {
        const ctx = document.getElementById('pointsChart');
        if (!ctx) return;

        if (this.charts.points) {
            this.charts.points.destroy();
        }

        const currentData = this.getCurrentData();
        if (currentData.length === 0) return;

        const teams = [...currentData]
            .sort((a, b) => (b.pts || 0) - (a.pts || 0))
            .slice(0, 15);
        
        this.charts.points = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: teams.map(t => (t.team || '').replace(' United', ' Utd').replace(' City', '')),
                datasets: [
                    {
                        label: 'Expected Points (xPts)',
                        data: teams.map(t => parseFloat((t.xpts || 0).toFixed(2))),
                        backgroundColor: '#95E1D3'
                    },
                    {
                        label: 'Actual Points',
                        data: teams.map(t => t.pts || 0),
                        backgroundColor: '#F38BA8'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: `Expected vs Actual Points - ${this.getViewDisplayName()}`
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
                            text: 'Teams'
                        },
                        ticks: {
                            maxRotation: 45,
                            minRotation: 0
                        }
                    }
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
    
    filterPlayerData(data) {
        return data.filter(player => {
            return player.minutes >= this.filters.minutes &&
                   player.form >= this.filters.form &&
                   player.xPoints >= this.filters.xPoints;
        });
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

    sortData(data) {
        if (!this.currentSort.column) return data;

        return [...data].sort((a, b) => {
            let aVal = a[this.currentSort.column];
            let bVal = b[this.currentSort.column];

            if (typeof aVal === 'string') {
                return this.currentSort.direction === 'asc' ? 
                    aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }

            if (aVal === undefined || aVal === null) aVal = 0;
            if (bVal === undefined || bVal === null) bVal = 0;

            return this.currentSort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        });
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