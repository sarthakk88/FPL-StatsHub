// FPL StatHub JavaScript

// Sample data from the provided JSON
const sampleData = {
  "players": [
    {"id": 1, "name": "Erling Haaland", "position": "Forward", "team": "Manchester City", "price": 15.0, "points": 195, "form": 8.2, "xG": 0.89, "xA": 0.12, "minutes": 2847, "ownership": 45.2, "bonus": 12},
    {"id": 2, "name": "Mohamed Salah", "position": "Midfielder", "team": "Liverpool", "price": 13.1, "points": 187, "form": 7.8, "xG": 0.67, "xA": 0.43, "minutes": 3104, "ownership": 51.8, "bonus": 18},
    {"id": 3, "name": "Harry Kane", "position": "Forward", "team": "Bayern Munich", "price": 11.5, "points": 168, "form": 7.2, "xG": 0.74, "xA": 0.21, "minutes": 2654, "ownership": 28.4, "bonus": 14},
    {"id": 4, "name": "Kevin De Bruyne", "position": "Midfielder", "team": "Manchester City", "price": 9.8, "points": 156, "form": 6.9, "xG": 0.31, "xA": 0.58, "minutes": 2387, "ownership": 19.7, "bonus": 22},
    {"id": 5, "name": "Virgil van Dijk", "position": "Defender", "team": "Liverpool", "price": 6.2, "points": 134, "form": 5.8, "xG": 0.09, "xA": 0.04, "minutes": 3298, "ownership": 34.1, "bonus": 8},
    {"id": 6, "name": "Alisson", "position": "Goalkeeper", "team": "Liverpool", "price": 5.6, "points": 142, "form": 5.2, "xG": 0.0, "xA": 0.0, "minutes": 3240, "ownership": 23.5, "bonus": 3},
    {"id": 7, "name": "Bukayo Saka", "position": "Midfielder", "team": "Arsenal", "price": 8.9, "points": 171, "form": 7.5, "xG": 0.34, "xA": 0.41, "minutes": 2987, "ownership": 42.3, "bonus": 16},
    {"id": 8, "name": "Marcus Rashford", "position": "Forward", "team": "Manchester United", "price": 8.2, "points": 149, "form": 6.4, "xG": 0.51, "xA": 0.18, "minutes": 2543, "ownership": 15.8, "bonus": 11},
    {"id": 9, "name": "Trent Alexander-Arnold", "position": "Defender", "team": "Liverpool", "price": 7.1, "points": 158, "form": 6.8, "xG": 0.07, "xA": 0.29, "minutes": 2876, "ownership": 38.9, "bonus": 13},
    {"id": 10, "name": "Ederson", "position": "Goalkeeper", "team": "Manchester City", "price": 5.4, "points": 138, "form": 5.0, "xG": 0.0, "xA": 0.01, "minutes": 3150, "ownership": 18.2, "bonus": 2}
  ],
  "teams": [
    {"id": 1, "name": "Manchester City", "logo": "MCI", "goals_for": 89, "goals_against": 31, "xG": 85.2, "xGA": 29.8, "clean_sheets": 18, "position": 1, "points": 91},
    {"id": 2, "name": "Arsenal", "logo": "ARS", "goals_for": 84, "goals_against": 43, "xG": 79.6, "xGA": 41.2, "clean_sheets": 15, "position": 2, "points": 84},
    {"id": 3, "name": "Liverpool", "logo": "LIV", "goals_for": 86, "goals_against": 41, "xG": 82.1, "xGA": 38.9, "clean_sheets": 16, "position": 3, "points": 82},
    {"id": 4, "name": "Newcastle United", "logo": "NEW", "goals_for": 68, "goals_against": 56, "xG": 64.3, "xGA": 52.7, "clean_sheets": 11, "position": 4, "points": 71},
    {"id": 5, "name": "Manchester United", "logo": "MUN", "goals_for": 58, "goals_against": 57, "xG": 61.4, "xGA": 54.8, "clean_sheets": 9, "position": 5, "points": 66}
  ],
  "myTeam": {
    "id": 12345,
    "name": "Dream Team FC",
    "totalPoints": 2147,
    "rank": 15432,
    "gameweekPoints": 78,
    "players": [
      {"id": 1, "name": "Erling Haaland", "position": "Forward", "points": 12, "captain": true},
      {"id": 2, "name": "Mohamed Salah", "position": "Midfielder", "points": 8, "captain": false},
      {"id": 6, "name": "Alisson", "position": "Goalkeeper", "points": 6, "captain": false}
    ]
  }
};

// Chart colors matching FPL theme
const chartColors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325', '#944454', '#13343B'];
const fplColors = {
  primary: '#38003c',
  secondary: '#3D195B',
  accent: '#00ff85',
  light: '#f8f9fa'
};

// Global variables
let currentPlayers = [...sampleData.players];
let currentTeams = [...sampleData.teams];
let charts = {};

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeApp();
});

function initializeApp() {
  setupNavigation();
  setupMobileMenu();
  setupPlayerFilters();
  setupTeamFilters();
  setupModals();
  
  // Initialize default view
  renderPlayersTable();
  renderTeamsGrid();
  loadMyTeam();
  
  // Populate team filter options
  populateTeamFilter();
  
  // Initialize My Team charts after a short delay
  setTimeout(() => {
    initializeMyTeamCharts(sampleData.myTeam);
  }, 300);
}

// Navigation functionality
function setupNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  
  navButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const targetTab = this.getAttribute('data-tab');
      console.log('Switching to tab:', targetTab);
      
      switchTab(targetTab);
      
      // Update active nav button for both desktop and mobile
      navButtons.forEach(navBtn => navBtn.classList.remove('active'));
      document.querySelectorAll(`[data-tab="${targetTab}"]`).forEach(navBtn => 
        navBtn.classList.add('active')
      );
      
      // Close mobile menu if open
      const mobileNav = document.getElementById('mobileNav');
      if (mobileNav) {
        mobileNav.classList.remove('active');
      }
    });
  });
}

function switchTab(tabName) {
  console.log('Switching to tab:', tabName);
  
  // Hide all tab contents
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Show target tab
  const targetTab = document.getElementById(tabName);
  if (targetTab) {
    targetTab.classList.add('active');
    console.log(`Tab ${tabName} is now active`);
  } else {
    console.error(`Tab ${tabName} not found`);
  }
  
  // Initialize tab-specific content with delay to ensure DOM is ready
  if (tabName === 'teams') {
    setTimeout(() => {
      initializeTeamCharts();
    }, 200);
  }
}

// Mobile menu functionality
function setupMobileMenu() {
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      mobileNav.classList.toggle('active');
    });
  }
}

// My Team functionality
function loadMyTeam() {
  const loadTeamBtn = document.getElementById('loadTeamBtn');
  const teamIdInput = document.getElementById('teamId');
  
  if (loadTeamBtn && teamIdInput) {
    loadTeamBtn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const teamId = teamIdInput.value;
      console.log('Loading team with ID:', teamId);
      
      if (teamId) {
        showLoading();
        setTimeout(() => {
          displayMyTeamData(sampleData.myTeam);
          hideLoading();
        }, 1000);
      } else {
        alert('Please enter a valid team ID');
      }
    });
  }
  
  // Load default team on page load
  displayMyTeamData(sampleData.myTeam);
}

function displayMyTeamData(teamData) {
  // Update stats
  const totalPointsEl = document.getElementById('totalPoints');
  const overallRankEl = document.getElementById('overallRank');
  const gameweekPointsEl = document.getElementById('gameweekPoints');
  const teamNameEl = document.getElementById('teamName');
  
  if (totalPointsEl) totalPointsEl.textContent = teamData.totalPoints.toLocaleString();
  if (overallRankEl) overallRankEl.textContent = teamData.rank.toLocaleString();
  if (gameweekPointsEl) gameweekPointsEl.textContent = teamData.gameweekPoints;
  if (teamNameEl) teamNameEl.textContent = teamData.name;
  
  // Render team players
  renderTeamPlayers(teamData.players);
  
  // Initialize charts with delay
  setTimeout(() => {
    initializeMyTeamCharts(teamData);
  }, 200);
}

function renderTeamPlayers(players) {
  const container = document.getElementById('teamPlayersList');
  if (container) {
    container.innerHTML = players.map(player => `
      <div class="player-card" onclick="showPlayerModal(${player.id})" style="cursor: pointer;">
        <div class="player-name">
          ${player.name}
          ${player.captain ? '<span class="captain-badge">C</span>' : ''}
        </div>
        <div class="player-position">${player.position}</div>
        <div class="player-points">${player.points} pts</div>
      </div>
    `).join('');
  }
}

function initializeMyTeamCharts(teamData) {
  // Player Performance Chart
  const playerCtx = document.getElementById('playerPerformanceChart');
  if (playerCtx && !charts.playerPerformance) {
    charts.playerPerformance = new Chart(playerCtx, {
      type: 'bar',
      data: {
        labels: teamData.players.map(p => p.name.split(' ').pop()),
        datasets: [{
          label: 'Points',
          data: teamData.players.map(p => p.points),
          backgroundColor: chartColors.slice(0, teamData.players.length),
          borderColor: fplColors.accent,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: fplColors.light
            }
          }
        },
        scales: {
          x: {
            ticks: { color: fplColors.light },
            grid: { color: 'rgba(248, 249, 250, 0.1)' }
          },
          y: {
            ticks: { color: fplColors.light },
            grid: { color: 'rgba(248, 249, 250, 0.1)' }
          }
        }
      }
    });
  }
  
  // Captain Success Chart
  const captainCtx = document.getElementById('captainChart');
  if (captainCtx && !charts.captain) {
    charts.captain = new Chart(captainCtx, {
      type: 'doughnut',
      data: {
        labels: ['Captain Points', 'Other Points'],
        datasets: [{
          data: [24, 54], // Sample captain vs other points
          backgroundColor: [fplColors.accent, chartColors[1]],
          borderColor: fplColors.primary,
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: fplColors.light
            }
          }
        }
      }
    });
  }
}

// Player functionality
function setupPlayerFilters() {
  const searchInput = document.getElementById('playerSearch');
  const priceRange = document.getElementById('priceRange');
  const priceValue = document.getElementById('priceValue');
  const teamFilter = document.getElementById('teamFilter');
  const positionTabs = document.querySelectorAll('.position-tab');
  
  // Search functionality
  if (searchInput) {
    searchInput.addEventListener('input', function() {
      filterPlayers();
    });
  }
  
  // Price range functionality
  if (priceRange && priceValue) {
    priceRange.addEventListener('input', function() {
      priceValue.textContent = `£${this.value}m`;
      filterPlayers();
    });
  }
  
  // Team filter functionality
  if (teamFilter) {
    teamFilter.addEventListener('change', function() {
      filterPlayers();
    });
  }
  
  // Position tabs functionality
  positionTabs.forEach(tab => {
    tab.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      positionTabs.forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      filterPlayers();
    });
  });
  
  // Table sorting functionality
  setupTableSorting();
}

function populateTeamFilter() {
  const teamFilter = document.getElementById('teamFilter');
  if (teamFilter) {
    const teams = [...new Set(sampleData.players.map(p => p.team))].sort();
    
    teams.forEach(team => {
      const option = document.createElement('option');
      option.value = team;
      option.textContent = team;
      teamFilter.appendChild(option);
    });
  }
}

function filterPlayers() {
  const searchInput = document.getElementById('playerSearch');
  const priceRange = document.getElementById('priceRange');
  const teamFilter = document.getElementById('teamFilter');
  const activePositionTab = document.querySelector('.position-tab.active');
  
  const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
  const maxPrice = priceRange ? parseFloat(priceRange.value) : 15;
  const selectedTeam = teamFilter ? teamFilter.value : '';
  const selectedPosition = activePositionTab ? activePositionTab.getAttribute('data-position') : 'all';
  
  currentPlayers = sampleData.players.filter(player => {
    const matchesSearch = !searchTerm || player.name.toLowerCase().includes(searchTerm);
    const matchesPrice = player.price <= maxPrice;
    const matchesTeam = !selectedTeam || player.team === selectedTeam;
    const matchesPosition = selectedPosition === 'all' || player.position === selectedPosition;
    
    return matchesSearch && matchesPrice && matchesTeam && matchesPosition;
  });
  
  renderPlayersTable();
}

function renderPlayersTable() {
  const tbody = document.getElementById('playersTableBody');
  
  if (tbody) {
    tbody.innerHTML = currentPlayers.map(player => `
      <tr onclick="showPlayerModal(${player.id})" style="cursor: pointer;">
        <td>${player.name}</td>
        <td>${player.position}</td>
        <td>${player.team}</td>
        <td>£${player.price}m</td>
        <td>${player.points}</td>
        <td>${player.form}</td>
        <td>${player.ownership}%</td>
        <td>${player.xG.toFixed(2)}</td>
        <td>${player.xA.toFixed(2)}</td>
      </tr>
    `).join('');
  }
}

function setupTableSorting() {
  const sortableHeaders = document.querySelectorAll('.sortable');
  
  sortableHeaders.forEach(header => {
    header.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      
      const sortKey = this.getAttribute('data-sort');
      sortPlayers(sortKey);
    });
  });
}

function sortPlayers(key) {
  const isNumeric = ['price', 'points', 'form', 'ownership', 'xG', 'xA'].includes(key);
  
  currentPlayers.sort((a, b) => {
    if (isNumeric) {
      return b[key] - a[key]; // Descending for numeric
    } else {
      return a[key].localeCompare(b[key]); // Ascending for text
    }
  });
  
  renderPlayersTable();
}

// Team functionality
function setupTeamFilters() {
  const teamSort = document.getElementById('teamSort');
  
  if (teamSort) {
    teamSort.addEventListener('change', function() {
      sortTeams(this.value);
    });
  }
}

function sortTeams(sortBy) {
  currentTeams.sort((a, b) => {
    if (sortBy === 'position') {
      return a[sortBy] - b[sortBy]; // Ascending for position
    } else {
      return b[sortBy] - a[sortBy]; // Descending for others
    }
  });
  
  renderTeamsGrid();
}

function renderTeamsGrid() {
  const container = document.getElementById('teamsGrid');
  
  if (container) {
    container.innerHTML = currentTeams.map(team => `
      <div class="team-card">
        <div class="team-header">
          <div class="team-name">${team.name}</div>
          <div class="team-logo">${team.logo}</div>
        </div>
        <div class="team-stats-grid">
          <div class="team-stat">
            <div class="team-stat-value">${team.position}</div>
            <div class="team-stat-label">Position</div>
          </div>
          <div class="team-stat">
            <div class="team-stat-value">${team.points}</div>
            <div class="team-stat-label">Points</div>
          </div>
          <div class="team-stat">
            <div class="team-stat-value">${team.goals_for}</div>
            <div class="team-stat-label">Goals For</div>
          </div>
          <div class="team-stat">
            <div class="team-stat-value">${team.goals_against}</div>
            <div class="team-stat-label">Goals Against</div>
          </div>
          <div class="team-stat">
            <div class="team-stat-value">${team.clean_sheets}</div>
            <div class="team-stat-label">Clean Sheets</div>
          </div>
          <div class="team-stat">
            <div class="team-stat-value">${team.xG.toFixed(1)}</div>
            <div class="team-stat-label">xG</div>
          </div>
        </div>
      </div>
    `).join('');
  }
}

function initializeTeamCharts() {
  // Goals Chart
  const goalsCtx = document.getElementById('goalsChart');
  if (goalsCtx && !charts.goals) {
    charts.goals = new Chart(goalsCtx, {
      type: 'bar',
      data: {
        labels: currentTeams.map(t => t.logo),
        datasets: [
          {
            label: 'Goals For',
            data: currentTeams.map(t => t.goals_for),
            backgroundColor: fplColors.accent,
            borderColor: fplColors.primary,
            borderWidth: 1
          },
          {
            label: 'Goals Against',
            data: currentTeams.map(t => t.goals_against),
            backgroundColor: chartColors[2],
            borderColor: fplColors.primary,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: fplColors.light
            }
          }
        },
        scales: {
          x: {
            ticks: { color: fplColors.light },
            grid: { color: 'rgba(248, 249, 250, 0.1)' }
          },
          y: {
            ticks: { color: fplColors.light },
            grid: { color: 'rgba(248, 249, 250, 0.1)' }
          }
        }
      }
    });
  }
  
  // xG Chart
  const xgCtx = document.getElementById('xgChart');
  if (xgCtx && !charts.xg) {
    charts.xg = new Chart(xgCtx, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'Teams',
          data: currentTeams.map(t => ({
            x: t.xG,
            y: t.xGA,
            teamName: t.name
          })),
          backgroundColor: chartColors.slice(0, currentTeams.length),
          borderColor: fplColors.accent,
          borderWidth: 2,
          pointRadius: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: fplColors.light
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const point = context.raw;
                return `${point.teamName}: xG ${point.x.toFixed(1)}, xGA ${point.y.toFixed(1)}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Expected Goals (xG)',
              color: fplColors.light
            },
            ticks: { color: fplColors.light },
            grid: { color: 'rgba(248, 249, 250, 0.1)' }
          },
          y: {
            title: {
              display: true,
              text: 'Expected Goals Against (xGA)',
              color: fplColors.light
            },
            ticks: { color: fplColors.light },
            grid: { color: 'rgba(248, 249, 250, 0.1)' }
          }
        }
      }
    });
  }
}

// Modal functionality
function setupModals() {
  const modal = document.getElementById('playerModal');
  const modalClose = document.getElementById('modalClose');
  const modalOverlay = document.getElementById('modalOverlay');
  
  if (modalClose) {
    modalClose.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      hidePlayerModal();
    });
  }
  
  if (modalOverlay) {
    modalOverlay.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      hidePlayerModal();
    });
  }
  
  // Close modal on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      hidePlayerModal();
    }
  });
}

function showPlayerModal(playerId) {
  console.log('Showing modal for player ID:', playerId);
  
  const player = sampleData.players.find(p => p.id === playerId);
  if (!player) {
    console.error('Player not found:', playerId);
    return;
  }
  
  const modal = document.getElementById('playerModal');
  const modalPlayerName = document.getElementById('modalPlayerName');
  const modalBody = document.getElementById('modalBody');
  
  if (modal && modalPlayerName && modalBody) {
    modalPlayerName.textContent = player.name;
    modalBody.innerHTML = `
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">£${player.price}m</div>
          <div class="stat-label">Price</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${player.points}</div>
          <div class="stat-label">Total Points</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${player.form}</div>
          <div class="stat-label">Form</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${player.ownership}%</div>
          <div class="stat-label">Ownership</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${player.xG.toFixed(2)}</div>
          <div class="stat-label">Expected Goals</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${player.xA.toFixed(2)}</div>
          <div class="stat-label">Expected Assists</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${player.minutes.toLocaleString()}</div>
          <div class="stat-label">Minutes Played</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${player.bonus}</div>
          <div class="stat-label">Bonus Points</div>
        </div>
      </div>
      <div style="margin-top: 24px;">
        <h4 style="color: #00ff85; margin-bottom: 16px;">Player Information</h4>
        <p><strong>Position:</strong> ${player.position}</p>
        <p><strong>Team:</strong> ${player.team}</p>
        <p><strong>Points per Million:</strong> ${(player.points / player.price).toFixed(1)}</p>
        <p><strong>Minutes per Point:</strong> ${(player.minutes / player.points).toFixed(1)}</p>
      </div>
    `;
    
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }
}

function hidePlayerModal() {
  const modal = document.getElementById('playerModal');
  if (modal) {
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
  }
}

// Loading functionality
function showLoading() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  if (loadingSpinner) {
    loadingSpinner.classList.remove('hidden');
  }
}

function hideLoading() {
  const loadingSpinner = document.getElementById('loadingSpinner');
  if (loadingSpinner) {
    loadingSpinner.classList.add('hidden');
  }
}

// Make showPlayerModal globally accessible
window.showPlayerModal = showPlayerModal;

// Utility functions
function formatNumber(num) {
  return num.toLocaleString();
}

function formatPrice(price) {
  return `£${price.toFixed(1)}m`;
}
