/**
 * Events Page Logic
 * Handles event listing, registration, and management
 */

let eventsData = {
    events: [],
    filters: {
        type: 'all',
        search: ''
    }
};

/**
 * Initialize events page
 */
async function initEvents() {
    // Require authentication
    if (!authManager.requireAuth()) {
        return;
    }

    // Load events
    await loadEvents();
    
    // Setup event listeners
    setupEventListeners();
    
    // Render events
    renderEvents();
}

/**
 * Load all events
 */
async function loadEvents() {
    try {
        const response = await api.get('/events/events/');
        eventsData.events = response.results || response || [];
        return eventsData.events;
    } catch (error) {
        console.error('Failed to load events:', error);
        showNotification('Failed to load events', 'error');
        return [];
    }
}

/**
 * Create new event
 */
async function createEvent(eventData) {
    try {
        const response = await api.post('/events/events/', eventData);
        showNotification('Event created successfully!', 'success');
        return { success: true, event: response };
    } catch (error) {
        showNotification(error.message || 'Failed to create event', 'error');
        return { success: false, error };
    }
}

/**
 * Register for an event
 */
async function registerForEvent(eventId) {
    try {
        await api.post(`/events/events/${eventId}/register/`);
        showNotification('Successfully registered for event!', 'success');
        
        // Reload events
        await loadEvents();
        renderEvents();
        
        return { success: true };
    } catch (error) {
        showNotification(error.message || 'Failed to register for event', 'error');
        return { success: false };
    }
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Search input
    const searchInput = document.getElementById('event-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            eventsData.filters.search = e.target.value;
            renderEvents();
        }, 300));
    }

    // Type filter
    const typeFilter = document.getElementById('type-filter');
    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            eventsData.filters.type = e.target.value;
            renderEvents();
        });
    }

    // Create event button
    const createBtn = document.getElementById('create-event-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            const modal = document.getElementById('create-event-modal');
            if (modal) modal.style.display = 'flex';
        });
    }

    // Create event form
    const createForm = document.getElementById('create-event-form');
    if (createForm) {
        createForm.addEventListener('submit', handleCreateEvent);
    }
}

/**
 * Handle create event form submission
 */
async function handleCreateEvent(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const eventData = {
        title: formData.get('title'),
        description: formData.get('description'),
        event_date: formData.get('event_date'),
        event_time: formData.get('event_time'),
        location: formData.get('location'),
        event_type: formData.get('event_type'),
        max_participants: formData.get('max_participants')
    };

    const result = await createEvent(eventData);
    
    if (result.success) {
        e.target.reset();
        const modal = document.getElementById('create-event-modal');
        if (modal) modal.style.display = 'none';
        
        // Reload events
        await loadEvents();
        renderEvents();
    }
}

/**
 * Render events list
 */
function renderEvents() {
    const container = document.getElementById('events-container');
    if (!container) return;

    let filteredEvents = eventsData.events;

    // Apply type filter
    if (eventsData.filters.type !== 'all') {
        filteredEvents = filteredEvents.filter(e => 
            e.event_type === eventsData.filters.type
        );
    }

    // Apply search filter
    if (eventsData.filters.search) {
        const search = eventsData.filters.search.toLowerCase();
        filteredEvents = filteredEvents.filter(e =>
            e.title.toLowerCase().includes(search) ||
            (e.description && e.description.toLowerCase().includes(search))
        );
    }

    // Separate upcoming and past events
    const now = new Date();
    const upcomingEvents = filteredEvents.filter(e => new Date(e.event_date) >= now);
    const pastEvents = filteredEvents.filter(e => new Date(e.event_date) < now);

    let html = '';

    // Render upcoming events
    if (upcomingEvents.length > 0) {
        html += '<h2 class="section-title">Upcoming Events</h2>';
        html += '<div class="events-grid">';
        html += upcomingEvents.map(event => renderEventCard(event, true)).join('');
        html += '</div>';
    }

    // Render past events
    if (pastEvents.length > 0) {
        html += '<h2 class="section-title">Past Events</h2>';
        html += '<div class="events-grid">';
        html += pastEvents.map(event => renderEventCard(event, false)).join('');
        html += '</div>';
    }

    if (filteredEvents.length === 0) {
        html = '<p class="empty-state">No events found</p>';
    }

    container.innerHTML = html;
}

/**
 * Render individual event card
 */
function renderEventCard(event, isUpcoming) {
    const eventDate = new Date(event.event_date);
    const isRegistered = event.is_registered || false;
    const isFull = event.participants_count >= event.max_participants;

    return `
        <div class="event-card ${isUpcoming ? '' : 'past-event'}">
            <div class="event-date-badge">
                <span class="event-day">${eventDate.getDate()}</span>
                <span class="event-month">${eventDate.toLocaleDateString('en-US', { month: 'short' })}</span>
            </div>
            <div class="event-content">
                <div class="event-header">
                    <h3>${escapeHtml(event.title)}</h3>
                    <span class="event-type-badge">${escapeHtml(event.event_type || 'General')}</span>
                </div>
                <p class="event-description">${escapeHtml(event.description || 'No description')}</p>
                <div class="event-details">
                    <div class="event-detail">
                        <span class="detail-icon">📍</span>
                        <span>${escapeHtml(event.location || 'Online')}</span>
                    </div>
                    <div class="event-detail">
                        <span class="detail-icon">⏰</span>
                        <span>${event.event_time || 'TBA'}</span>
                    </div>
                    <div class="event-detail">
                        <span class="detail-icon">👥</span>
                        <span>${event.participants_count || 0}/${event.max_participants || '∞'} attending</span>
                    </div>
                </div>
                ${isUpcoming ? `
                    <div class="event-actions">
                        ${isRegistered ? 
                            '<button class="btn btn-success" disabled>✓ Registered</button>' :
                            isFull ?
                            '<button class="btn btn-secondary" disabled>Event Full</button>' :
                            `<button class="btn btn-primary" onclick="registerForEvent(${event.id})">Register</button>`
                        }
                    </div>
                ` : ''}
            </div>
        </div>
    `;
}

// Make registerForEvent available globally
window.registerForEvent = registerForEvent;
