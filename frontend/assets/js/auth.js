/**
 * Authentication Manager
 * Handles user authentication, registration, and session management
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.authToken = localStorage.getItem('authToken');
        this.init();
    }

    /**
     * Initialize auth manager
     */
    async init() {
        if (this.authToken) {
            try {
                await this.fetchCurrentUser();
            } catch (error) {
                console.error('Failed to fetch current user:', error);
                this.logout();
            }
        }
    }

    /**
     * Register new user
     */
    async register(userData) {
        try {
            const response = await api.post('/accounts/users/register/', userData, {
                requiresAuth: false,
            });

            if (response.token) {
                this.setAuthToken(response.token);
                this.currentUser = response.user;
                return { success: true, user: response.user };
            }

            return { success: true, message: 'Registration successful' };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Registration failed',
                errors: error.errors,
            };
        }
    }

    /**
     * Login user
     */
    async login(credentials) {
        try {
            const response = await api.post('/accounts/users/login/', credentials, {
                requiresAuth: false,
            });

            if (response.token) {
                this.setAuthToken(response.token);
                this.currentUser = response.user;
                return { success: true, user: response.user };
            }

            return { success: false, message: 'Invalid response from server' };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Login failed',
                errors: error.errors,
            };
        }
    }

    /**
     * Logout user
     */
    logout() {
        this.authToken = null;
        this.currentUser = null;
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/auth/login.html';
    }

    /**
     * Fetch current user data
     */
    async fetchCurrentUser() {
        try {
            const response = await api.get('/accounts/users/me/');
            this.currentUser = response;
            localStorage.setItem('user', JSON.stringify(response));
            return response;
        } catch (error) {
            throw error;
        }
    }

    /**
     * Update user profile
     */
    async updateProfile(profileData) {
        try {
            const response = await api.patch('/accounts/profiles/update_my_profile/', profileData);
            
            // Update current user data
            if (this.currentUser) {
                this.currentUser = { ...this.currentUser, ...response };
                localStorage.setItem('user', JSON.stringify(this.currentUser));
            }
            
            return { success: true, user: response };
        } catch (error) {
            return {
                success: false,
                message: error.message || 'Profile update failed',
                errors: error.errors,
            };
        }
    }

    /**
     * Set authentication token
     */
    setAuthToken(token) {
        this.authToken = token;
        localStorage.setItem('authToken', token);
    }

    /**
     * Check if user is authenticated
     */
    isAuthenticated() {
        return !!this.authToken;
    }

    /**
     * Get current user
     */
    getCurrentUser() {
        if (!this.currentUser) {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    this.currentUser = JSON.parse(userStr);
                } catch (e) {
                    console.error('Failed to parse user data:', e);
                }
            }
        }
        return this.currentUser;
    }

    /**
     * Require authentication (redirect to login if not authenticated)
     */
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/auth/login.html';
            return false;
        }
        return true;
    }

    /**
     * Redirect to dashboard if already authenticated
     */
    redirectIfAuthenticated() {
        if (this.isAuthenticated()) {
            window.location.href = '/dashboard/index.html';
            return true;
        }
        return false;
    }
}

// Create singleton instance
const authManager = new AuthManager();

// Export for use in other modules
window.authManager = authManager;
