/**
 * Resources Page Logic
 * Handles resource browsing, uploading, and management
 */

let resourcesData = {
    resources: [],
    filters: {
        type: 'all',
        search: ''
    }
};

/**
 * Initialize resources page
 */
async function initResources() {
    // Require authentication
    if (!authManager.requireAuth()) {
        return;
    }

    // Load resources
    await loadResources();
    
    // Setup event listeners
    setupResourceEventListeners();
    
    // Render resources
    renderResources();
}

/**
 * Initialize resource upload page
 */
function initResourceUpload() {
    // Require authentication
    if (!authManager.requireAuth()) {
        return;
    }

    // Setup upload form
    setupUploadForm();
}

/**
 * Load all resources
 */
async function loadResources() {
    try {
        const response = await api.get('/resources/resources/');
        resourcesData.resources = response.results || response || [];
        return resourcesData.resources;
    } catch (error) {
        console.error('Failed to load resources:', error);
        showNotification('Failed to load resources', 'error');
        return [];
    }
}

/**
 * Upload new resource
 */
async function uploadResource(formData) {
    try {
        const response = await api.uploadFile('/resources/resources/', formData);
        showNotification('Resource uploaded successfully!', 'success');
        return { success: true, resource: response };
    } catch (error) {
        showNotification(error.message || 'Failed to upload resource', 'error');
        return { success: false, error };
    }
}

/**
 * Setup event listeners for resources page
 */
function setupResourceEventListeners() {
    // Search input
    const searchInput = document.getElementById('resource-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            resourcesData.filters.search = e.target.value;
            renderResources();
        }, 300));
    }

    // Type filter
    const typeFilter = document.getElementById('type-filter');
    if (typeFilter) {
        typeFilter.addEventListener('change', (e) => {
            resourcesData.filters.type = e.target.value;
            renderResources();
        });
    }
}

/**
 * Setup upload form
 */
function setupUploadForm() {
    const form = document.getElementById('upload-form');
    if (!form) return;

    // File input preview
    const fileInput = document.getElementById('file');
    const filePreview = document.getElementById('file-preview');
    
    if (fileInput && filePreview) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                filePreview.innerHTML = `
                    <div class="file-info">
                        <span class="file-icon">${getFileIcon(file.type)}</span>
                        <div>
                            <p><strong>${escapeHtml(file.name)}</strong></p>
                            <p class="text-sm">${formatFileSize(file.size)}</p>
                        </div>
                    </div>
                `;
            }
        });
    }

    // Form submission
    form.addEventListener('submit', handleUploadSubmit);
}

/**
 * Handle upload form submission
 */
async function handleUploadSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);

    // Validate file
    const file = formData.get('file');
    if (!file || file.size === 0) {
        showNotification('Please select a file to upload', 'warning');
        return;
    }

    // Disable submit button
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Uploading...';
    }

    const result = await uploadResource(formData);

    // Re-enable submit button
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload Resource';
    }

    if (result.success) {
        form.reset();
        document.getElementById('file-preview').innerHTML = '';
        
        // Redirect to resources page after 2 seconds
        setTimeout(() => {
            window.location.href = '/resources/index.html';
        }, 2000);
    }
}

/**
 * Render resources list
 */
function renderResources() {
    const container = document.getElementById('resources-container');
    if (!container) return;

    let filteredResources = resourcesData.resources;

    // Apply type filter
    if (resourcesData.filters.type !== 'all') {
        filteredResources = filteredResources.filter(r => 
            r.resource_type === resourcesData.filters.type
        );
    }

    // Apply search filter
    if (resourcesData.filters.search) {
        const search = resourcesData.filters.search.toLowerCase();
        filteredResources = filteredResources.filter(r =>
            r.title.toLowerCase().includes(search) ||
            (r.description && r.description.toLowerCase().includes(search))
        );
    }

    if (filteredResources.length === 0) {
        container.innerHTML = '<p class="empty-state">No resources found</p>';
        return;
    }

    container.innerHTML = filteredResources.map(resource => `
        <div class="resource-card">
            <div class="resource-icon-large">${getResourceIcon(resource.resource_type)}</div>
            <div class="resource-content">
                <h3>${escapeHtml(resource.title)}</h3>
                <p>${escapeHtml(resource.description || 'No description')}</p>
                <div class="resource-meta">
                    <span class="resource-type">${escapeHtml(resource.resource_type)}</span>
                    <span>👤 ${escapeHtml(resource.uploaded_by?.username || 'Unknown')}</span>
                    <span>⏰ ${formatDate(resource.created_at)}</span>
                </div>
                <div class="resource-actions">
                    ${resource.file ? `<a href="${resource.file}" class="btn btn-primary" download>Download</a>` : ''}
                    ${resource.url ? `<a href="${resource.url}" class="btn btn-secondary" target="_blank">Open Link</a>` : ''}
                    <button class="btn-icon" onclick="bookmarkResource(${resource.id})">🔖 Save</button>
                </div>
            </div>
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
        'slides': '📊',
        'code': '💻',
        'other': '📄'
    };
    return icons[type?.toLowerCase()] || icons.other;
}

/**
 * Get icon for file type
 */
function getFileIcon(mimeType) {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.startsWith('audio/')) return '🎵';
    if (mimeType.includes('pdf')) return '📕';
    if (mimeType.includes('word') || mimeType.includes('document')) return '📄';
    if (mimeType.includes('sheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📊';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '📦';
    return '📎';
}

/**
 * Format file size
 */
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Bookmark a resource
 */
async function bookmarkResource(resourceId) {
    try {
        await api.post(`/resources/resources/${resourceId}/bookmark/`);
        showNotification('Resource bookmarked!', 'success');
    } catch (error) {
        showNotification('Failed to bookmark resource', 'error');
    }
}

// Make bookmarkResource available globally
window.bookmarkResource = bookmarkResource;
