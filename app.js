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
        this.currentSort = { column: null, direction: 'desc' };
        this.charts = {};
        
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
            ],
            teams: [
                {"name":"Manchester City","goals_for":89,"goals_against":31,"xG":85.2,"xGA":29.8,"clean_sheets":18,"position":1,"points":91},
                {"name":"Arsenal","goals_for":84,"goals_against":43,"xG":79.6,"xGA":41.2,"clean_sheets":15,"position":2,"points":84},
                {"name":"Liverpool","goals_for":86,"goals_against":41,"xG":82.1,"xGA":38.9,"clean_sheets":16,"position":3,"points":82},
                {"name":"Newcastle United","goals_for":68,"goals_against":56,"xG":64.3,"xGA":52.7,"clean_sheets":11,"position":4,"points":71},
                {"name":"Manchester United","goals_for":58,"goals_against":57,"xG":61.4,"xGA":54.8,"clean_sheets":9,"position":5,"points":66},
                {"name":"Chelsea","goals_for":55,"goals_against":49,"xG":60.2,"xGA":48.3,"clean_sheets":10,"position":6,"points":64},
                {"name":"Tottenham","goals_for":70,"goals_against":63,"xG":68.5,"xGA":58.2,"clean_sheets":8,"position":7,"points":60},
                {"name":"Brighton","goals_for":52,"goals_against":54,"xG":58.7,"xGA":52.1,"clean_sheets":9,"position":8,"points":58},
                {"name":"Aston Villa","goals_for":61,"goals_against":58,"xG":56.8,"xGA":55.3,"clean_sheets":7,"position":9,"points":55},
                {"name":"West Ham","goals_for":48,"goals_against":62,"xG":52.3,"xGA":59.1,"clean_sheets":6,"position":10,"points":52},
                {"name":"Brentford","goals_for":54,"goals_against":61,"xG":51.2,"xGA":58.7,"clean_sheets":8,"position":11,"points":49},
                {"name":"Fulham","goals_for":50,"goals_against":59,"xG":49.8,"xGA":56.4,"clean_sheets":7,"position":12,"points":47},
                {"name":"Crystal Palace","goals_for":40,"goals_against":56,"xG":45.7,"xGA":54.2,"clean_sheets":6,"position":13,"points":45},
                {"name":"Wolves","goals_for":38,"goals_against":58,"xG":43.1,"xGA":55.9,"clean_sheets":5,"position":14,"points":42},
                {"name":"Everton","goals_for":34,"goals_against":57,"xG":41.2,"xGA":56.8,"clean_sheets":4,"position":15,"points":39},
                {"name":"Nottingham Forest","goals_for":36,"goals_against":64,"xG":39.8,"xGA":61.3,"clean_sheets":3,"position":16,"points":38},
                {"name":"Luton Town","goals_for":35,"goals_against":65,"xG":38.4,"xGA":62.1,"clean_sheets":4,"position":17,"points":35},
                {"name":"Burnley","goals_for":32,"goals_against":68,"xG":36.2,"xGA":64.5,"clean_sheets":2,"position":18,"points":32},
                {"name":"Sheffield United","goals_for":28,"goals_against":78,"xG":33.1,"xGA":71.2,"clean_sheets":1,"position":19,"points":28},
                {"name":"Southampton","goals_for":31,"goals_against":75,"xG":35.6,"xGA":69.8,"clean_sheets":2,"position":20,"points":25}
            ]
        };
    }

    init() {
        this.setupEventListeners();
        this.renderCurrentTab();
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

    renderTeamStats() {
        this.renderLeagueTable();
        
        // Delay chart rendering to ensure canvas is visible
        setTimeout(() => {
            this.renderGoalsChart();
        }, 100);
    }

    renderLeagueTable() {
        const tbody = document.getElementById('leagueTable');
        if (!tbody) return;

        const teams = [...this.data.teams].sort((a, b) => a.position - b.position);

        tbody.innerHTML = teams.map(team => {
            const positionClass = this.getLeaguePositionClass(team.position);
            
            return `
                <tr>
                    <td><span class="league-position ${positionClass}">${team.position}</span></td>
                    <td><span class="team-name">${team.name}</span></td>
                    <td><strong>${team.points}</strong></td>
                    <td>${team.goals_for}</td>
                    <td>${team.goals_against}</td>
                    <td>${team.xG.toFixed(1)}</td>
                    <td>${team.xGA.toFixed(1)}</td>
                    <td>${team.clean_sheets}</td>
                </tr>
            `;
        }).join('');
    }

    renderGoalsChart() {
        const ctx = document.getElementById('goalsChart');
        if (!ctx) return;

        // Destroy existing chart if it exists
        if (this.charts.goals) {
            this.charts.goals.destroy();
        }

        const teams = this.data.teams.slice(0, 10); // Top 10 teams
        
        this.charts.goals = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: teams.map(t => t.name.replace(' United', ' Utd').replace(' City', '')),
                datasets: [
                    {
                        label: 'Goals For',
                        data: teams.map(t => t.goals_for),
                        backgroundColor: '#1FB8CD'
                    },
                    {
                        label: 'Goals Against',
                        data: teams.map(t => t.goals_against),
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
                        }
                    }
                }
            }
        });
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