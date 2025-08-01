// FPL StatHub Application JavaScript

class FPLStatHub {
    constructor() {
        this.data = {
            goalkeepers: [],
            defenders: [],
            midfielders: [],
            attackers: [],
            metadata: {}
        };
        
        this.currentPosition = 'goalkeepers';
        this.currentSort = { column: null, direction: 'desc' };
        this.filters = {
            minutes: 500,
            form: 0,
            xPoints: 0,
            performance: 'all'
        };
        this.performanceMode = 'overall';
        
        this.init();
    }

    init() {
        this.loadSampleData();
        this.setupEventListeners();
        this.renderCurrentTab();
        this.updateLastUpdated();
    }

    loadSampleData() {
        // Sample data from the provided JSON
        this.data = {
            goalkeepers: [
                {"first_name": "Alisson", "second_name": "Ramses Becker", "id": 1, "minutes": 2880, "xGC": 1.12, "total_points": 4.5, "xPoints": 4.8, "Home/Away_minutes": 1440, "total_points_Home/Away": 4.8, "xPoints_Home/Away": 5.1, "clean_sheets": 0.45, "goals_conceded": 1.05, "bonus": 0.15, "saves": 2.8, "form": 5.2, "diff": -0.3, "team_against": "Arsenal", "Home/Away": "Home"},
                {"first_name": "Jordan", "second_name": "Pickford", "id": 2, "minutes": 2790, "xGC": 1.35, "total_points": 3.9, "xPoints": 4.2, "Home/Away_minutes": 1395, "total_points_Home/Away": 4.1, "xPoints_Home/Away": 4.4, "clean_sheets": 0.32, "goals_conceded": 1.28, "bonus": 0.08, "saves": 3.2, "form": 4.8, "diff": 0.2, "team_against": "Manchester City", "Home/Away": "Away"}
            ],
            defenders: [
                {"first_name": "Virgil", "second_name": "van Dijk", "id": 3, "minutes": 3150, "xG": 0.12, "xA": 0.08, "xGC": 0.89, "total_points": 5.1, "xPoints": 5.4, "Home/Away_minutes": 1575, "total_points_Home/Away": 5.3, "xPoints_Home/Away": 5.6, "goal_scored": 0.11, "assists": 0.06, "clean_sheets": 0.52, "goals_conceded": 0.86, "bonus": 0.18, "form": 6.2, "diff": -0.5, "team_against": "Chelsea", "Home/Away": "Home"},
                {"first_name": "Trent", "second_name": "Alexander-Arnold", "id": 4, "minutes": 2970, "xG": 0.08, "xA": 0.31, "xGC": 0.92, "total_points": 5.8, "xPoints": 6.1, "Home/Away_minutes": 1485, "total_points_Home/Away": 6.2, "xPoints_Home/Away": 6.5, "goal_scored": 0.06, "assists": 0.27, "clean_sheets": 0.49, "goals_conceded": 0.89, "bonus": 0.22, "form": 6.8, "diff": -0.5, "team_against": "Chelsea", "Home/Away": "Home"}
            ],
            midfielders: [
                {"first_name": "Mohamed", "second_name": "Salah", "id": 5, "minutes": 3060, "xG": 0.68, "xA": 0.41, "xGC": 0.95, "total_points": 7.2, "xPoints": 7.8, "Home/Away_minutes": 1530, "total_points_Home/Away": 7.6, "xPoints_Home/Away": 8.2, "goal_scored": 0.62, "assists": 0.35, "clean_sheets": 0.21, "goals_conceded": 0.92, "bonus": 0.31, "form": 8.1, "diff": -0.5, "team_against": "Chelsea", "Home/Away": "Home"},
                {"first_name": "Kevin", "second_name": "De Bruyne", "id": 6, "minutes": 2520, "xG": 0.29, "xA": 0.67, "xGC": 0.78, "total_points": 6.8, "xPoints": 7.3, "Home/Away_minutes": 1260, "total_points_Home/Away": 7.1, "xPoints_Home/Away": 7.6, "goal_scored": 0.25, "assists": 0.61, "clean_sheets": 0.28, "goals_conceded": 0.75, "bonus": 0.35, "form": 7.4, "diff": 0.8, "team_against": "Burnley", "Home/Away": "Home"}
            ],
            attackers: [
                {"first_name": "Erling", "second_name": "Haaland", "id": 7, "minutes": 2880, "xG": 0.89, "xA": 0.15, "total_points": 8.9, "xPoints": 9.2, "Home/Away_minutes": 1440, "total_points_Home/Away": 9.3, "xPoints_Home/Away": 9.6, "goal_scored": 0.85, "assists": 0.12, "bonus": 0.41, "form": 8.7, "diff": 0.8, "team_against": "Burnley", "Home/Away": "Home"},
                {"first_name": "Harry", "second_name": "Kane", "id": 8, "minutes": 2970, "xG": 0.74, "xA": 0.23, "total_points": 7.8, "xPoints": 8.1, "Home/Away_minutes": 1485, "total_points_Home/Away": 8.2, "xPoints_Home/Away": 8.5, "goal_scored": 0.69, "assists": 0.19, "bonus": 0.28, "form": 7.5, "diff": 0.1, "team_against": "Newcastle", "Home/Away": "Away"}
            ],
            metadata: {
                lastUpdated: "2025-08-01T16:00:00Z",
                gameweek: 20,
                dataSource: "FPL API via Python Client",
                minutesThreshold: 60,
                matchesAnalyzed: 5
            }
        };
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const position = e.target.dataset.position;
                this.switchTab(position);
            });
        });

        // Table sorting
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-sort]')) {
                const column = e.target.dataset.sort;
                this.sortTable(column);
            }
        });

        // Filters
        const minutesFilter = document.getElementById('minutesFilter');
        if (minutesFilter) {
            minutesFilter.addEventListener('input', (e) => {
                this.filters.minutes = parseInt(e.target.value);
                document.getElementById('minutesValue').textContent = e.target.value;
                this.renderCurrentTab();
            });
        }

        const formFilter = document.getElementById('formFilter');
        if (formFilter) {
            formFilter.addEventListener('input', (e) => {
                this.filters.form = parseFloat(e.target.value);
                document.getElementById('formValue').textContent = e.target.value + '+';
                this.renderCurrentTab();
            });
        }

        const xPointsFilter = document.getElementById('xPointsFilter');
        if (xPointsFilter) {
            xPointsFilter.addEventListener('input', (e) => {
                this.filters.xPoints = parseFloat(e.target.value);
                document.getElementById('xPointsValue').textContent = e.target.value + '+';
                this.renderCurrentTab();
            });
        }

        const performanceFilter = document.getElementById('performanceFilter');
        if (performanceFilter) {
            performanceFilter.addEventListener('change', (e) => {
                this.filters.performance = e.target.value;
                this.renderCurrentTab();
            });
        }

        // Performance mode toggle
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                this.setPerformanceMode(mode);
            });
        });

        // Refresh button
        const refreshBtn = document.getElementById('refreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.refreshData();
            });
        }
    }

    switchTab(position) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        const activeTab = document.querySelector(`[data-position="${position}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Update active tab pane
        document.querySelectorAll('.tab-pane').forEach(pane => {
            pane.classList.remove('active');
        });
        
        if (position === 'analytics') {
            const analyticsPane = document.getElementById('analytics');
            if (analyticsPane) {
                analyticsPane.classList.add('active');
                this.renderAnalytics();
            }
        } else {
            const positionPane = document.getElementById(position);
            if (positionPane) {
                positionPane.classList.add('active');
                this.currentPosition = position;
                this.currentSort = { column: null, direction: 'desc' }; // Reset sort when switching tabs
                this.renderCurrentTab();
            }
        }
    }

    setPerformanceMode(mode) {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const activeBtn = document.querySelector(`[data-mode="${mode}"]`);
        if (activeBtn) {
            activeBtn.classList.add('active');
        }
        
        this.performanceMode = mode;
        this.renderCurrentTab();
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

        this.renderCurrentTab();
    }

    filterData(data) {
        return data.filter(player => {
            const minutes = this.performanceMode === 'home' ? (player['Home/Away_minutes'] || player.minutes / 2) :
                           this.performanceMode === 'away' ? (player['Home/Away_minutes'] || player.minutes / 2) :
                           player.minutes;
            
            return minutes >= this.filters.minutes &&
                   player.form >= this.filters.form &&
                   player.xPoints >= this.filters.xPoints;
        });
    }

    sortData(data) {
        if (!this.currentSort.column) return data;

        return [...data].sort((a, b) => {
            let aVal = a[this.currentSort.column];
            let bVal = b[this.currentSort.column];

            if (this.currentSort.column === 'name') {
                aVal = `${a.first_name} ${a.second_name}`;
                bVal = `${b.first_name} ${b.second_name}`;
            }

            if (typeof aVal === 'string') {
                return this.currentSort.direction === 'asc' ? 
                    aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }

            // Handle undefined/null values
            if (aVal === undefined || aVal === null) aVal = 0;
            if (bVal === undefined || bVal === null) bVal = 0;

            return this.currentSort.direction === 'asc' ? aVal - bVal : bVal - aVal;
        });
    }

    renderCurrentTab() {
        if (this.currentPosition === 'analytics') return;

        const rawData = this.data[this.currentPosition] || [];
        const filteredData = this.filterData(rawData);
        const sortedData = this.sortData(filteredData);

        const tbody = document.getElementById(`${this.currentPosition}Table`);
        if (!tbody) return;

        if (sortedData.length === 0) {
            tbody.innerHTML = '<tr><td colspan="10" style="text-align: center; color: var(--color-text-secondary);">No players match the current filters</td></tr>';
            return;
        }

        tbody.innerHTML = sortedData.map(player => {
            return this.renderPlayerRow(player);
        }).join('');
    }

    renderPlayerRow(player) {
        const name = `${player.first_name} ${player.second_name}`;
        const difficultyClass = this.getDifficultyClass(player.diff);
        const formClass = this.getFormClass(player.form);
        const homeAwayBadge = player['Home/Away'] ? 
            `<span class="badge badge-${player['Home/Away'].toLowerCase()}">${player['Home/Away']}</span>` : '';

        // Get stats based on performance mode
        const stats = this.getStatsForMode(player);

        if (this.currentPosition === 'goalkeepers') {
            return `
                <tr>
                    <td><span class="player-name">${name}</span></td>
                    <td>${stats.minutes}</td>
                    <td>${stats.xGC.toFixed(2)}</td>
                    <td>${stats.total_points.toFixed(1)}</td>
                    <td>${stats.xPoints.toFixed(1)}</td>
                    <td>${(player.clean_sheets || 0).toFixed(2)}</td>
                    <td>${(player.saves || 0).toFixed(1)}</td>
                    <td><span class="${formClass}">${player.form.toFixed(1)}</span></td>
                    <td>${player.team_against} ${homeAwayBadge}</td>
                    <td><span class="${difficultyClass}">${player.diff > 0 ? '+' : ''}${player.diff.toFixed(1)}</span></td>
                </tr>
            `;
        } else if (this.currentPosition === 'defenders') {
            return `
                <tr>
                    <td><span class="player-name">${name}</span></td>
                    <td>${stats.minutes}</td>
                    <td>${(player.xG || 0).toFixed(2)}</td>
                    <td>${(player.xA || 0).toFixed(2)}</td>
                    <td>${(player.xGC || 0).toFixed(2)}</td>
                    <td>${stats.total_points.toFixed(1)}</td>
                    <td>${stats.xPoints.toFixed(1)}</td>
                    <td>${(player.clean_sheets || 0).toFixed(2)}</td>
                    <td><span class="${formClass}">${player.form.toFixed(1)}</span></td>
                    <td>${player.team_against} ${homeAwayBadge}</td>
                    <td><span class="${difficultyClass}">${player.diff > 0 ? '+' : ''}${player.diff.toFixed(1)}</span></td>
                </tr>
            `;
        } else if (this.currentPosition === 'midfielders') {
            return `
                <tr>
                    <td><span class="player-name">${name}</span></td>
                    <td>${stats.minutes}</td>
                    <td>${(player.xG || 0).toFixed(2)}</td>
                    <td>${(player.xA || 0).toFixed(2)}</td>
                    <td>${stats.total_points.toFixed(1)}</td>
                    <td>${stats.xPoints.toFixed(1)}</td>
                    <td>${(player.goal_scored || 0).toFixed(2)}</td>
                    <td>${(player.assists || 0).toFixed(2)}</td>
                    <td><span class="${formClass}">${player.form.toFixed(1)}</span></td>
                    <td>${player.team_against} ${homeAwayBadge}</td>
                    <td><span class="${difficultyClass}">${player.diff > 0 ? '+' : ''}${player.diff.toFixed(1)}</span></td>
                </tr>
            `;
        } else if (this.currentPosition === 'attackers') {
            return `
                <tr>
                    <td><span class="player-name">${name}</span></td>
                    <td>${stats.minutes}</td>
                    <td>${(player.xG || 0).toFixed(2)}</td>
                    <td>${(player.xA || 0).toFixed(2)}</td>
                    <td>${stats.total_points.toFixed(1)}</td>
                    <td>${stats.xPoints.toFixed(1)}</td>
                    <td>${(player.goal_scored || 0).toFixed(2)}</td>
                    <td>${(player.assists || 0).toFixed(2)}</td>
                    <td><span class="${formClass}">${player.form.toFixed(1)}</span></td>
                    <td>${player.team_against} ${homeAwayBadge}</td>
                    <td><span class="${difficultyClass}">${player.diff > 0 ? '+' : ''}${player.diff.toFixed(1)}</span></td>
                </tr>
            `;
        }
        return '';
    }

    getStatsForMode(player) {
        if (this.performanceMode === 'home') {
            return {
                minutes: player['Home/Away_minutes'] || Math.round(player.minutes / 2),
                total_points: player['total_points_Home/Away'] || player.total_points,
                xPoints: player['xPoints_Home/Away'] || player.xPoints,
                xGC: player.xGC || 0
            };
        } else if (this.performanceMode === 'away') {
            return {
                minutes: player['Home/Away_minutes'] || Math.round(player.minutes / 2),
                total_points: player['total_points_Home/Away'] || player.total_points * 0.9,
                xPoints: player['xPoints_Home/Away'] || player.xPoints * 0.9,
                xGC: player.xGC || 0
            };
        } else {
            return {
                minutes: player.minutes,
                total_points: player.total_points,
                xPoints: player.xPoints,
                xGC: player.xGC || 0
            };
        }
    }

    getDifficultyClass(diff) {
        if (diff <= -0.3) return 'difficulty-easy';
        if (diff >= 0.3) return 'difficulty-hard';
        return 'difficulty-medium';
    }

    getFormClass(form) {
        if (form >= 7.5) return 'form-excellent';
        if (form >= 6.0) return 'form-good';
        if (form >= 4.0) return 'form-average';
        return 'form-poor';
    }

    renderAnalytics() {
        setTimeout(() => {
            this.renderXgXaChart();
            this.renderFormChart();
            this.renderPointsChart();
            this.renderHomeAwayChart();
        }, 100);
    }

    renderXgXaChart() {
        const ctx = document.getElementById('xgXaChart');
        if (!ctx) return;

        const allPlayers = [
            ...this.data.defenders,
            ...this.data.midfielders,
            ...this.data.attackers
        ].filter(p => p.xG !== undefined && p.xA !== undefined);

        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'xG vs xA',
                    data: allPlayers.map(p => ({
                        x: p.xG,
                        y: p.xA,
                        label: `${p.first_name} ${p.second_name}`
                    })),
                    backgroundColor: '#1FB8CD',
                    borderColor: '#1FB8CD'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const point = context.raw;
                                return `${point.label}: xG: ${point.x.toFixed(2)}, xA: ${point.y.toFixed(2)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Expected Goals (xG)' }
                    },
                    y: {
                        title: { display: true, text: 'Expected Assists (xA)' }
                    }
                }
            }
        });
    }

    renderFormChart() {
        const ctx = document.getElementById('formChart');
        if (!ctx) return;

        const allPlayers = [
            ...this.data.goalkeepers,
            ...this.data.defenders,
            ...this.data.midfielders,
            ...this.data.attackers
        ];

        const formRanges = {
            'Excellent (7.5+)': allPlayers.filter(p => p.form >= 7.5).length,
            'Good (6.0-7.4)': allPlayers.filter(p => p.form >= 6.0 && p.form < 7.5).length,
            'Average (4.0-5.9)': allPlayers.filter(p => p.form >= 4.0 && p.form < 6.0).length,
            'Poor (<4.0)': allPlayers.filter(p => p.form < 4.0).length
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(formRanges),
                datasets: [{
                    data: Object.values(formRanges),
                    backgroundColor: ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    renderPointsChart() {
        const ctx = document.getElementById('pointsChart');
        if (!ctx) return;

        const allPlayers = [
            ...this.data.goalkeepers,
            ...this.data.defenders,
            ...this.data.midfielders,
            ...this.data.attackers
        ];

        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'xPoints vs Actual Points',
                    data: allPlayers.map(p => ({
                        x: p.xPoints,
                        y: p.total_points,
                        label: `${p.first_name} ${p.second_name}`
                    })),
                    backgroundColor: '#FFC185',
                    borderColor: '#FFC185'
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const point = context.raw;
                                return `${point.label}: xPoints: ${point.x.toFixed(1)}, Points: ${point.y.toFixed(1)}`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Expected Points (xPoints)' }
                    },
                    y: {
                        title: { display: true, text: 'Actual Points' }
                    }
                }
            }
        });
    }

    renderHomeAwayChart() {
        const ctx = document.getElementById('homeAwayChart');
        if (!ctx) return;

        const allPlayers = [
            ...this.data.goalkeepers,
            ...this.data.defenders,
            ...this.data.midfielders,
            ...this.data.attackers
        ];

        const homeStats = allPlayers.map(p => p['total_points_Home/Away'] || p.total_points).reduce((a, b) => a + b, 0) / allPlayers.length;
        const awayStats = allPlayers.map(p => p['total_points_Home/Away'] || p.total_points * 0.9).reduce((a, b) => a + b, 0) / allPlayers.length;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Home', 'Away'],
                datasets: [{
                    label: 'Average Points',
                    data: [homeStats, awayStats],
                    backgroundColor: ['#B4413C', '#ECEBD5']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: { display: true, text: 'Average Points' }
                    }
                }
            }
        });
    }

    updateLastUpdated() {
        const lastUpdated = new Date().toLocaleString();
        const lastUpdatedEl = document.getElementById('lastUpdated');
        if (lastUpdatedEl) {
            lastUpdatedEl.textContent = `Updated: ${lastUpdated}`;
        }
    }

    refreshData() {
        const refreshBtn = document.getElementById('refreshBtn');
        const refreshIcon = document.getElementById('refreshIcon');
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        // Show loading state
        if (refreshIcon) {
            refreshIcon.style.animation = 'spin 1s linear infinite';
        }
        if (loadingOverlay) {
            loadingOverlay.classList.remove('hidden');
        }
        
        // Simulate data fetch
        setTimeout(() => {
            this.loadSampleData();
            this.renderCurrentTab();
            this.updateLastUpdated();
            
            // Hide loading state
            if (refreshIcon) {
                refreshIcon.style.animation = '';
            }
            if (loadingOverlay) {
                loadingOverlay.classList.add('hidden');
            }
            
            // Add update animation to tables
            document.querySelectorAll('.stats-table tbody tr').forEach(row => {
                row.classList.add('data-update');
                setTimeout(() => row.classList.remove('data-update'), 500);
            });
        }, 1500);
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FPLStatHub();
});
