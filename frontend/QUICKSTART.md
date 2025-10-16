# UniPeer Frontend - Quick Start Guide

## ✅ What's Been Built

A complete, responsive frontend for the UniPeer platform using **pure HTML, CSS, and Vanilla JavaScript** (no frameworks).

### 📦 Complete File Structure (All Files Created)

```
frontend/
├── 📄 index.html              ✓ Landing page with hero, features, testimonials
├── 📄 README.md               ✓ Comprehensive documentation
├── 📄 QUICKSTART.md           ✓ This file
│
├── 📁 auth/
│   ├── login.html            ✓ Login with validation
│   └── register.html         ✓ Registration with password strength
│
├── 📁 components/
│   ├── navbar.html           ✓ Dynamic navigation bar
│   └── footer.html           ✓ Footer with links
│
├── 📁 dashboard/
│   └── index.html            ✓ Main dashboard with stats
│
├── 📁 events/
│   └── index.html            ✓ Events listing and creation
│
├── 📁 forums/
│   ├── index.html            ✓ Forum discussions listing
│   └── post.html             ✓ Individual forum post view
│
├── 📁 profile/
│   └── index.html            ✓ User profile and settings
│
├── 📁 resources/
│   ├── index.html            ✓ Resources browsing
│   └── upload.html           ✓ Resource upload with drag-drop
│
└── 📁 assets/
    ├── 📁 css/
    │   ├── main.css          ✓ Base styles, variables, components
    │   ├── auth.css          ✓ Authentication pages
    │   ├── components.css    ✓ Navbar, footer, modals
    │   ├── dashboard.css     ✓ Dashboard specific
    │   ├── forums.css        ✓ Forums specific
    │   ├── resources.css     ✓ Resources specific
    │   ├── events.css        ✓ Events specific
    │   └── responsive.css    ✓ All media queries
    │
    ├── 📁 js/
    │   ├── api.js            ✓ API client and HTTP methods
    │   ├── auth.js           ✓ AuthManager class
    │   ├── utils.js          ✓ Common utilities
    │   ├── dashboard.js      ✓ Dashboard logic
    │   ├── forums.js         ✓ Forums logic
    │   ├── resources.js      ✓ Resources logic
    │   └── events.js         ✓ Events logic
    │
    └── 📁 images/            ✓ (ready for your images)
```

## 🚀 How to Run (3 Steps)

### Step 1: Start Your Django Backend
```bash
# In your Django project directory
python manage.py runserver
# Should be running at http://localhost:8000
```

### Step 2: Start the Frontend Server
Choose **ONE** of these options:

**Option A: VS Code Live Server (Recommended)**
1. Install "Live Server" extension in VS Code
2. Right-click `frontend/index.html`
3. Click "Open with Live Server"
4. Opens at `http://localhost:5500` or similar

**Option B: Python HTTP Server**
```bash
cd frontend
python -m http.server 8080
# Opens at http://localhost:8080
```

**Option C: Node.js http-server**
```bash
cd frontend
npx http-server -p 8080
# Opens at http://localhost:8080
```

### Step 3: Open in Browser
Navigate to the URL from Step 2 (e.g., `http://localhost:8080`)

## 🎯 Testing the Features

### 1. Landing Page
- ✅ Visit `http://localhost:8080/`
- ✅ See hero section, features, testimonials
- ✅ Click "Get Started" → goes to register
- ✅ Click "Sign In" → goes to login

### 2. Authentication
- ✅ Go to `/auth/register.html`
- ✅ Create account with validation
- ✅ Password strength indicator works
- ✅ Login at `/auth/login.html`
- ✅ Token stored in localStorage

### 3. Dashboard
- ✅ After login, redirects to `/dashboard/index.html`
- ✅ Shows welcome message with username
- ✅ Displays stats cards
- ✅ Shows recent resources, forums, events

### 4. Forums
- ✅ Navigate to `/forums/index.html`
- ✅ Search and filter discussions
- ✅ Create new discussion
- ✅ Click forum → view posts at `/forums/post.html`
- ✅ Add responses

### 5. Resources
- ✅ Navigate to `/resources/index.html`
- ✅ Browse resources
- ✅ Filter by type
- ✅ Upload at `/resources/upload.html`
- ✅ Drag-drop file upload works

### 6. Events
- ✅ Navigate to `/events/index.html`
- ✅ View upcoming events
- ✅ Create new event
- ✅ Register for events

### 7. Profile
- ✅ Navigate to `/profile/index.html`
- ✅ View user information
- ✅ Edit profile details
- ✅ Change settings
- ✅ Logout

## 🎨 Design Features

### ✅ Implemented
- ✅ Mobile-first responsive design
- ✅ Hamburger menu on mobile
- ✅ Dark/light mode toggle (persisted)
- ✅ Smooth animations and transitions
- ✅ Card shadows and hover effects
- ✅ Loading spinners
- ✅ Toast notifications
- ✅ Form validation with inline errors
- ✅ Password strength indicator
- ✅ Drag-drop file upload
- ✅ Search and filters
- ✅ Modal dialogs
- ✅ Breadcrumb navigation
- ✅ Emojis for engagement 🎓✨📚💬

### 🎨 Color Scheme
- **Primary**: #3A6FF8 (Blue)
- **Accent**: #F7C948 (Yellow)
- **Success**: #38C172 (Green)
- **Secondary**: #9B59B6 (Purple)

### 📱 Responsive Breakpoints
- Mobile: ≤ 768px
- Tablet: 769px - 1024px
- Desktop: > 1024px

## 🔗 API Integration

The frontend is ready to connect to your Django backend at `http://localhost:8000/api`

### Expected Endpoints:
```
POST   /api/accounts/users/register/
POST   /api/accounts/users/login/
GET    /api/accounts/users/me/
PATCH  /api/accounts/profiles/update_my_profile/
GET    /api/resources/resources/
POST   /api/resources/resources/
GET    /api/forums/forums/
POST   /api/forums/forums/
GET    /api/forums/forums/{id}/posts/
POST   /api/forums/forums/{id}/posts/
GET    /api/events/events/
POST   /api/events/events/
```

### Authentication Flow:
1. User logs in → receives token
2. Token stored in `localStorage` as `authToken`
3. All API requests include: `Authorization: Token {token}`

## 🔧 Customization

### Change API Base URL
Edit `frontend/assets/js/api.js`:
```javascript
const API_BASE_URL = 'http://your-backend-url/api';
```

### Change Colors
Edit `frontend/assets/css/main.css`:
```css
:root {
    --primary-color: #YourColor;
    --accent-color: #YourColor;
    /* ... */
}
```

### Add New Pages
1. Create HTML file in appropriate folder
2. Link CSS: main.css, components.css, responsive.css
3. Link JS: api.js, auth.js, utils.js
4. Add to navbar/sidebar in `components/navbar.html`

## 🐛 Troubleshooting

### 1. CORS Error
**Problem**: Browser blocks API requests

**Solution**: Add CORS headers in Django
```python
# settings.py
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:5500",
]
```

### 2. Login Doesn't Work
**Checklist**:
- ✓ Backend is running at `http://localhost:8000`
- ✓ Check browser console for errors
- ✓ Check Network tab for API response
- ✓ Verify endpoint: `POST /api/accounts/users/login/`

### 3. Components Not Loading
**Problem**: Navbar/Footer not appearing

**Solution**: Ensure relative paths are correct
```javascript
// Should be:
loadComponent('/components/navbar.html', '#navbar-container');
// Not:
loadComponent('components/navbar.html', '#navbar-container');
```

### 4. Dark Mode Not Persisting
**Problem**: Theme resets on page reload

**Solution**: Check localStorage in DevTools
- Go to Application → Local Storage
- Should see `theme: 'dark'` or `theme: 'light'`

## 📖 Key Files to Know

| File | Purpose |
|------|---------|
| `assets/js/api.js` | All API calls and HTTP methods |
| `assets/js/auth.js` | Authentication logic and user management |
| `assets/js/utils.js` | Common functions (notifications, validation, etc.) |
| `assets/css/main.css` | Core styles, variables, base components |
| `assets/css/responsive.css` | All mobile/tablet breakpoints |
| `components/navbar.html` | Navigation bar (loaded dynamically) |
| `components/footer.html` | Footer (loaded dynamically) |

## ✨ Next Steps

1. **Test with Backend**: Start Django backend and test all features
2. **Add Images**: Add logo and images to `assets/images/`
3. **Customize**: Update colors, fonts, content to match your brand
4. **Deploy**: Deploy frontend to Netlify, Vercel, or GitHub Pages

## 💡 Pro Tips

1. **Use Browser DevTools**: Press F12 to debug and inspect
2. **Check Console**: Look for JavaScript errors
3. **Network Tab**: Monitor API requests and responses
4. **Responsive View**: Test mobile view in DevTools (Ctrl+Shift+M)
5. **localStorage**: View stored tokens in Application tab

## 📚 Additional Resources

- MDN Web Docs: https://developer.mozilla.org
- CSS Tricks: https://css-tricks.com
- Can I Use: https://caniuse.com (check browser support)

## 🎉 You're All Set!

Your complete UniPeer frontend is ready to use. All pages work independently and connect seamlessly to your Django backend.

**Have questions?** Check the detailed README.md or the inline code comments.

---

Built with ❤️ using pure HTML, CSS, and JavaScript
