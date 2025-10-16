# UniPeer Frontend - AI-Powered Student Collaboration Platform

Built with pure HTML, CSS, and Vanilla JavaScript (no frameworks).

## 🚀 Features

- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Dark/Light Mode**: Theme toggle with localStorage persistence
- **Authentication**: Complete login/register system with validation
- **Dashboard**: User overview with stats and recent activity
- **Forums**: Discussion boards with posts and replies
- **Resources**: Upload and browse study materials
- **Events**: Create and join study events
- **Profile Management**: User profile with settings

## 📁 Project Structure

```
frontend/
├── assets/
│   ├── css/
│   │   ├── auth.css          # Authentication pages
│   │   ├── components.css    # Reusable components
│   │   ├── dashboard.css     # Dashboard specific
│   │   ├── events.css        # Events page
│   │   ├── forums.css        # Forums page
│   │   ├── main.css          # Base styles & variables
│   │   ├── resources.css     # Resources page
│   │   └── responsive.css    # Media queries
│   ├── images/               # Image assets
│   └── js/
│       ├── api.js           # API client
│       ├── auth.js          # Authentication manager
│       ├── dashboard.js     # Dashboard logic
│       ├── events.js        # Events logic
│       ├── forums.js        # Forums logic
│       ├── resources.js     # Resources logic
│       └── utils.js         # Utility functions
├── auth/
│   ├── login.html           # Login page
│   └── register.html        # Registration page
├── components/
│   ├── footer.html          # Footer component
│   └── navbar.html          # Navbar component
├── dashboard/
│   └── index.html           # Dashboard page
├── events/
│   └── index.html           # Events listing
├── forums/
│   ├── index.html           # Forums listing
│   └── post.html            # Forum post/discussion
├── profile/
│   └── index.html           # User profile
├── resources/
│   ├── index.html           # Resources listing
│   └── upload.html          # Upload resource
├── index.html               # Landing page
└── README.md                # This file
```

## 🎨 Design System

### Colors
- **Primary**: `#3A6FF8` (Blue)
- **Accent**: `#F7C948` (Yellow)
- **Success**: `#38C172` (Green)
- **Secondary**: `#9B59B6` (Purple)

### Typography
- **Font**: Poppins (Google Fonts)
- Mobile-first responsive sizing

### Features
- Smooth animations and transitions
- Card shadows and hover effects
- Sidebar with hamburger menu on mobile
- Dark/light mode support
- Emojis for visual engagement 🎓✨📚💬

## 🔧 Setup Instructions

### 1. Prerequisites
- A local web server (Live Server, Python HTTP server, or similar)
- Django backend running at `http://localhost:8000`

### 2. Running the Frontend

#### Option A: Using VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option B: Using Python
```bash
cd frontend
python -m http.server 8080
```
Then open: http://localhost:8080

#### Option C: Using Node.js
```bash
cd frontend
npx http-server -p 8080
```
Then open: http://localhost:8080

### 3. Backend Configuration
Ensure your Django backend is running at `http://localhost:8000/api`

The frontend expects these endpoints:
- `POST /api/accounts/users/register/` - User registration
- `POST /api/accounts/users/login/` - User login
- `GET /api/accounts/users/me/` - Get current user
- `PATCH /api/accounts/profiles/update_my_profile/` - Update profile
- `GET /api/resources/resources/` - Get resources
- `GET /api/forums/forums/` - Get forums
- `GET /api/events/events/` - Get events

## 🌐 API Integration

### Authentication Flow
1. User registers/logs in
2. Backend returns authentication token
3. Token stored in localStorage
4. Token sent with all subsequent requests in Authorization header

### Example API Usage
```javascript
// Login
const result = await authManager.login({
    username: 'user@example.com',
    password: 'password123'
});

// Make authenticated request
const resources = await api.get('/resources/resources/');
```

## 📱 Pages Overview

### Landing Page (`index.html`)
- Hero section with CTA buttons
- Features showcase
- Statistics
- Testimonials
- Responsive design

### Authentication (`auth/`)
- Login with validation
- Registration with password strength indicator
- Social login buttons (UI only)
- Inline error display

### Dashboard (`dashboard/index.html`)
- User welcome section
- Statistics cards
- Recent resources
- Active forums
- Upcoming events
- Quick actions

### Forums (`forums/`)
- Discussion listing
- Search and filter
- Create new discussion
- View posts and replies
- Like/reply functionality

### Resources (`resources/`)
- Resource listing
- Upload new resources
- Filter by type
- Download/bookmark

### Events (`events/index.html`)
- Event listing
- Create new event
- Register for events
- Filter by type
- Calendar view (future enhancement)

### Profile (`profile/index.html`)
- User information
- Edit profile
- Settings
- Statistics

## 🎯 Key Features

### Component Loading
Navbar and footer are dynamically loaded into each page:
```javascript
await loadComponent('/components/navbar.html', '#navbar-container');
await loadComponent('/components/footer.html', '#footer-container');
```

### Dark Mode
Theme toggle with persistence:
```javascript
toggleDarkMode(); // Toggles between light and dark
initDarkMode();   // Loads saved preference
```

### Form Validation
Client-side validation with inline error messages:
- Email format validation
- Password strength checking
- Required field validation
- Real-time feedback

### Notifications
Toast notifications for user feedback:
```javascript
showNotification('Success message', 'success');
showNotification('Error message', 'error');
```

## 🔒 Security

- XSS prevention with `escapeHtml()` function
- CSRF protection via Django backend
- Token-based authentication
- Input validation and sanitization

## 📝 Code Style

- Clean, commented code
- Consistent naming conventions
- Modular JavaScript functions
- Semantic HTML5 elements
- BEM-inspired CSS naming

## 🚧 Future Enhancements

- Real-time notifications
- File upload progress
- Advanced search
- Calendar integration
- Direct messaging
- Gamification (badges, points)

## 🐛 Troubleshooting

### CORS Issues
If you encounter CORS errors, ensure your Django backend has proper CORS headers configured.

### API Connection
Check that the backend is running at `http://localhost:8000` and endpoints are accessible.

### Authentication
If login fails, check browser console for detailed error messages.

## 📄 License

This project is part of the UniPeer platform.

## 👥 Contributing

1. Follow the existing code style
2. Test on multiple browsers
3. Ensure mobile responsiveness
4. Comment complex logic
5. Update this README if needed

---

Built with ❤️ for students, by students.
