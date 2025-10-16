/**
 * Dashboard Page Logic
 * Handles dashboard functionality and data loading
 */

let dashboardData = {
    resources: [],
    forums: [],
    events: [],
    stats: {}
};

/**
 * Initialize dashboard
 */
async function initDashboard() {
    // Require authentication
    if (!authManager.requireAuth()) {
        return;
    }

    // Load dashboard data
    await loadDashboardData();
    
    // Render dashboard sections
    renderUserInfo();
    renderStats();
    renderRecentResources();
    renderActiveForums();
    renderUpcomingEvents();
}

/**
 * Load dashboard data from API
 */
async function loadDashboardData() {
    try {
        // Show loading state
        showLoadingState();

        // Fetch data in parallel
        const [resourcesRes, forumsRes, eventsRes] = await Promise.allSettled([
            api.get('/resources/resources/').catch(() => ({ results: [] })),
            api.get('/forums/forums/').catch(() => ({ results: [] })),
            api.get('/events/events/').catch(() => ({ results: [] }))
        ]);

        dashboardData.resources = resourcesRes.value?.results || [];
        dashboardData.forums = forumsRes.value?.results || [];
        dashboardData.events = eventsRes.value?.results || [];

        // Calculate stats
        dashboardData.stats = {
            totalResources: dashboardData.resources.length,
            totalForums: dashboardData.forums.length,
            totalEvents: dashboardData.events.length,
            contributions: 0
        };

        hideLoadingState();
    } catch (error) {
        console.error('Failed to load dashboard data:', error);
        showNotification('Failed to load dashboard data', 'error');
        hideLoadingState();
    }
}

/**
 * Render user information
 */
function renderUserInfo() {
    const user = authManager.getCurrentUser();
    if (!user) return;

    const userInfoElement = document.getElementById('user-info');
    if (userInfoElement) {
        userInfoElement.innerHTML = `
            <div class="user-welcome">
                <h1>Welcome back, ${escapeHtml(user.username || user.email)}! 👋</h1>
                <p>Here's what's happening in your UniPeer community today</p>
            </div>
        `;
    }
}

/**
 * Render statistics cards
 */
function renderStats() {
    const statsContainer = document.getElementById('stats-container');
    if (!statsContainer) return;

    statsContainer.innerHTML = `
        <div class="stat-card stat-card-primary">
            <div class="stat-icon">📚</div>
            <div class="stat-content">
                <h3>${dashboardData.stats.totalResources}</h3>
                <p>Resources Available</p>
            </div>
        </div>
        <div class="stat-card stat-card-secondary">
            <div class="stat-icon">💬</div>
            <div class="stat-content">
                <h3>${dashboardData.stats.totalForums}</h3>
                <p>Active Discussions</p>
            </div>
        </div>
        <div class="stat-card stat-card-success">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
                <h3>${dashboardData.stats.totalEvents}</h3>
                <p>Upcoming Events</p>
            </div>
        </div>
        <div class="stat-card stat-card-accent">
            <div class="stat-icon">✨</div>
            <div class="stat-content">
                <h3>${dashboardData.stats.contributions}</h3>
                <p>Your Contributions</p>
            </div>
        </div>
    `;
}

/**
 * Render recent resources
 */
function renderRecentResources() {
    const container = document.getElementById('recent-resources');
    if (!container) return;

    const recentResources = dashboardData.resources.slice(0, 4);

    if (recentResources.length === 0) {
        container.innerHTML = '<p class="empty-state">No resources available yet</p>';
        return;
    }

    container.innerHTML = recentResources.map(resource => `
        <div class="resource-card">
            <div class="resource-icon">${getResourceIcon(resource.resource_type)}</div>
            <div class="resource-info">
                <h4>${escapeHtml(resource.title)}</h4>
                <p>${escapeHtml(resource.description || 'No description')}</p>
                <div class="resource-meta">
                    <span class="resource-type">${escapeHtml(resource.resource_type)}</span>
                    <span class="resource-date">${formatDate(resource.created_at)}</span>
                </div>
            </div>
            <a href="/resources/index.html?id=${resource.id}" class="resource-link">View</a>
        </div>
    `).join('');
}

/**
 * Render active forums
 */
function renderActiveForums() {
    const container = document.getElementById('active-forums');
    if (!container) return;

    const activeForums = dashboardData.forums.slice(0, 4);

    if (activeForums.length === 0) {
        container.innerHTML = '<p class="empty-state">No active discussions yet</p>';
        return;
    }

    container.innerHTML = activeForums.map(forum => `
        <div class="forum-card">
            <div class="forum-header">
                <h4>${escapeHtml(forum.title)}</h4>
                <span class="forum-category">${escapeHtml(forum.category || 'General')}</span>
            </div>
            <p>${escapeHtml(forum.description || 'No description')}</p>
            <div class="forum-meta">
                <span>👤 ${forum.created_by?.username || 'Unknown'}</span>
                <span>💬 ${forum.posts_count || 0} posts</span>
                <span>⏰ ${formatDate(forum.created_at)}</span>
            </div>
            <a href="/forums/post.html?id=${forum.id}" class="forum-link">Join Discussion</a>
        </div>
    `).join('');
}

/**
 * Render upcoming events
 */
function renderUpcomingEvents() {
    const container = document.getElementById('upcoming-events');
    if (!container) return;

    const upcomingEvents = dashboardData.events
        .filter(event => new Date(event.event_date) >= new Date())
        .slice(0, 4);

    if (upcomingEvents.length === 0) {
        container.innerHTML = '<p class="empty-state">No upcoming events</p>';
        return;
    }

    container.innerHTML = upcomingEvents.map(event => `
        <div class="event-card">
            <div class="event-date">
                <span class="event-day">${new Date(event.event_date).getDate()}</span>
                <span class="event-month">${new Date(event.event_date).toLocaleDateString('en-US', { month: 'short' })}</span>
            </div>
            <div class="event-info">
                <h4>${escapeHtml(event.title)}</h4>
                <p>${escapeHtml(event.description || 'No description')}</p>
                <div class="event-meta">
                    <span>📍 ${escapeHtml(event.location || 'Online')}</span>
                    <span>👥 ${event.participants_count || 0} attending</span>
                </div>
            </div>
            <a href="/events/index.html?id=${event.id}" class="event-link">Details</a>
        </div>
    `).join('');
}

/**
 * Get icon for resource type
 */
function getResourceIcon(type) {
    const icons = {
        'notes': '📝',
        'video': '🎥',
        'book': '📖',
        'assignment': '📋',
        'project': '💼',
        'other': '📄'
    };
    return icons[type?.toLowerCase()] || icons.other;
}

/**
 * Show loading state
 */
function showLoadingState() {
    const containers = ['recent-resources', 'active-forums', 'upcoming-events'];
    containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
            container.innerHTML = '<div class="loading-spinner"></div>';
        }
    });
}

/**
 * Hide loading state
 */
function hideLoadingState() {
    // Loading will be replaced by actual content
}

// Initialize dashboard when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDashboard);
} else {
    initDashboard();
}
