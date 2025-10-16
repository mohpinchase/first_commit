/**
 * Forums Page Logic
 * Handles forum listing, posting, and interactions
 */

let forumsData = {
    forums: [],
    currentForum: null,
    posts: [],
    filters: {
        category: 'all',
        search: ''
    }
};

/**
 * Initialize forums page
 */
async function initForums() {
    // Require authentication
    if (!authManager.requireAuth()) {
        return;
    }

    // Load forums
    await loadForums();
    
    // Setup event listeners
    setupForumEventListeners();
    
    // Render forums
    renderForums();
}

/**
 * Initialize single forum post page
 */
async function initForumPost() {
    // Require authentication
    if (!authManager.requireAuth()) {
        return;
    }

    const forumId = getQueryParam('id');
    if (!forumId) {
        showNotification('Forum not found', 'error');
        window.location.href = '/forums/index.html';
        return;
    }

    // Load forum and posts
    await loadForumDetails(forumId);
    
    // Setup event listeners
    setupPostEventListeners();
    
    // Render forum details and posts
    renderForumDetails();
    renderPosts();
}

/**
 * Load all forums
 */
async function loadForums() {
    try {
        const response = await api.get('/forums/forums/');
        forumsData.forums = response.results || response || [];
        return forumsData.forums;
    } catch (error) {
        console.error('Failed to load forums:', error);
        showNotification('Failed to load forums', 'error');
        return [];
    }
}

/**
 * Load forum details and posts
 */
async function loadForumDetails(forumId) {
    try {
        const [forum, posts] = await Promise.all([
            api.get(`/forums/forums/${forumId}/`),
            api.get(`/forums/forums/${forumId}/posts/`).catch(() => ({ results: [] }))
        ]);

        forumsData.currentForum = forum;
        forumsData.posts = posts.results || posts || [];
    } catch (error) {
        console.error('Failed to load forum details:', error);
        showNotification('Failed to load forum details', 'error');
    }
}

/**
 * Create new forum
 */
async function createForum(forumData) {
    try {
        const response = await api.post('/forums/forums/', forumData);
        showNotification('Forum created successfully!', 'success');
        return { success: true, forum: response };
    } catch (error) {
        showNotification(error.message || 'Failed to create forum', 'error');
        return { success: false, error };
    }
}

/**
 * Create new post in forum
 */
async function createPost(forumId, postContent) {
    try {
        const response = await api.post(`/forums/forums/${forumId}/posts/`, {
            content: postContent
        });
        showNotification('Post created successfully!', 'success');
        return { success: true, post: response };
    } catch (error) {
        showNotification(error.message || 'Failed to create post', 'error');
        return { success: false, error };
    }
}

/**
 * Setup event listeners for forums list page
 */
function setupForumEventListeners() {
    // Search input
    const searchInput = document.getElementById('forum-search');
    if (searchInput) {
        searchInput.addEventListener('input', debounce((e) => {
            forumsData.filters.search = e.target.value;
            renderForums();
        }, 300));
    }

    // Category filter
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', (e) => {
            forumsData.filters.category = e.target.value;
            renderForums();
        });
    }

    // Create forum form
    const createForumForm = document.getElementById('create-forum-form');
    if (createForumForm) {
        createForumForm.addEventListener('submit', handleCreateForum);
    }

    // Create forum button
    const createBtn = document.getElementById('create-forum-btn');
    if (createBtn) {
        createBtn.addEventListener('click', () => {
            const modal = document.getElementById('create-forum-modal');
            if (modal) modal.style.display = 'flex';
        });
    }
}

/**
 * Setup event listeners for forum post page
 */
function setupPostEventListeners() {
    // Create post form
    const createPostForm = document.getElementById('create-post-form');
    if (createPostForm) {
        createPostForm.addEventListener('submit', handleCreatePost);
    }
}

/**
 * Handle create forum form submission
 */
async function handleCreateForum(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const forumData = {
        title: formData.get('title'),
        description: formData.get('description'),
        category: formData.get('category')
    };

    const result = await createForum(forumData);
    
    if (result.success) {
        e.target.reset();
        const modal = document.getElementById('create-forum-modal');
        if (modal) modal.style.display = 'none';
        
        // Reload forums
        await loadForums();
        renderForums();
    }
}

/**
 * Handle create post form submission
 */
async function handleCreatePost(e) {
    e.preventDefault();
    
    const content = e.target.content.value.trim();
    if (!content) {
        showNotification('Please enter post content', 'warning');
        return;
    }

    const forumId = forumsData.currentForum?.id;
    if (!forumId) return;

    const result = await createPost(forumId, content);
    
    if (result.success) {
        e.target.reset();
        
        // Reload posts
        await loadForumDetails(forumId);
        renderPosts();
    }
}

/**
 * Render forums list
 */
function renderForums() {
    const container = document.getElementById('forums-container');
    if (!container) return;

    let filteredForums = forumsData.forums;

    // Apply category filter
    if (forumsData.filters.category !== 'all') {
        filteredForums = filteredForums.filter(f => 
            f.category === forumsData.filters.category
        );
    }

    // Apply search filter
    if (forumsData.filters.search) {
        const search = forumsData.filters.search.toLowerCase();
        filteredForums = filteredForums.filter(f =>
            f.title.toLowerCase().includes(search) ||
            (f.description && f.description.toLowerCase().includes(search))
        );
    }

    if (filteredForums.length === 0) {
        container.innerHTML = '<p class="empty-state">No forums found</p>';
        return;
    }

    container.innerHTML = filteredForums.map(forum => `
        <div class="forum-card">
            <div class="forum-header">
                <h3>${escapeHtml(forum.title)}</h3>
                <span class="forum-category">${escapeHtml(forum.category || 'General')}</span>
            </div>
            <p class="forum-description">${escapeHtml(forum.description || 'No description')}</p>
            <div class="forum-meta">
                <span>👤 ${escapeHtml(forum.created_by?.username || 'Unknown')}</span>
                <span>💬 ${forum.posts_count || 0} posts</span>
                <span>⏰ ${formatDate(forum.created_at)}</span>
            </div>
            <a href="/forums/post.html?id=${forum.id}" class="btn btn-primary">View Discussion</a>
        </div>
    `).join('');
}

/**
 * Render forum details
 */
function renderForumDetails() {
    const container = document.getElementById('forum-details');
    if (!container || !forumsData.currentForum) return;

    const forum = forumsData.currentForum;
    container.innerHTML = `
        <div class="forum-header-section">
            <div class="forum-title-group">
                <h1>${escapeHtml(forum.title)}</h1>
                <span class="forum-category">${escapeHtml(forum.category || 'General')}</span>
            </div>
            <p class="forum-description">${escapeHtml(forum.description || '')}</p>
            <div class="forum-meta">
                <span>👤 Created by ${escapeHtml(forum.created_by?.username || 'Unknown')}</span>
                <span>💬 ${forumsData.posts.length} posts</span>
                <span>⏰ ${formatDate(forum.created_at)}</span>
            </div>
        </div>
    `;
}

/**
 * Render forum posts
 */
function renderPosts() {
    const container = document.getElementById('posts-container');
    if (!container) return;

    if (forumsData.posts.length === 0) {
        container.innerHTML = '<p class="empty-state">No posts yet. Be the first to contribute!</p>';
        return;
    }

    container.innerHTML = forumsData.posts.map(post => `
        <div class="post-card">
            <div class="post-author">
                <div class="author-avatar">
                    ${post.author?.avatar ? 
                        `<img src="${post.author.avatar}" alt="${escapeHtml(post.author.username)}">` :
                        `<div class="avatar-placeholder">${(post.author?.username || 'U')[0].toUpperCase()}</div>`
                    }
                </div>
                <div class="author-info">
                    <h4>${escapeHtml(post.author?.username || 'Unknown User')}</h4>
                    <span class="post-date">${formatDate(post.created_at)}</span>
                </div>
            </div>
            <div class="post-content">
                ${escapeHtml(post.content)}
            </div>
            <div class="post-actions">
                <button class="btn-icon" onclick="likePost(${post.id})">
                    👍 ${post.likes_count || 0}
                </button>
                <button class="btn-icon">💬 Reply</button>
            </div>
        </div>
    `).join('');
}

/**
 * Like a post
 */
async function likePost(postId) {
    try {
        await api.post(`/forums/posts/${postId}/like/`);
        showNotification('Post liked!', 'success');
        
        // Reload posts
        if (forumsData.currentForum) {
            await loadForumDetails(forumsData.currentForum.id);
            renderPosts();
        }
    } catch (error) {
        showNotification('Failed to like post', 'error');
    }
}

// Make likePost available globally
window.likePost = likePost;
