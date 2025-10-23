# Family Expense Tracker - Frontend

This is the frontend React application for the Family Expense Tracker, built with React 18, Tailwind CSS, and modern UI components for an exceptional user experience.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** package manager
- **Backend API server** running on port 5000

### Installation

1. **Navigate to frontend directory**

   ```bash
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm start
   ```

4. **Access the application**
   - Development: http://localhost:3000
   - The app will automatically proxy API requests to http://localhost:5000

### Running with Docker

1. **Navigate to the project root directory**

   ```bash
   cd ..
   ```

2. **Start the frontend service**

   ```bash
   docker-compose up --build
   ```

3. **Access the application**

   - Local: `http://localhost:3000`

4. **Stop the frontend service**

   ```bash
   docker-compose down
   ```

---

For manual setup instructions, refer to the `Quick Start` section above.

## 📁 Project Structure

```
frontend/
├── public/                # Static files
│   ├── index.html         # Main HTML file
│   ├── favicon.ico        # App icon
│   └── manifest.json      # PWA manifest
├── src/
│   ├── components/        # Reusable components
│   │   ├── AddMemberModal.js      # Group member management
│   │   ├── CategoryManager.js     # Category CRUD operations
│   │   ├── ExpenseList.js         # Expense display and management
│   │   ├── ExpenseSplitting.js    # Balance calculations
│   │   ├── FamilyManager.js       # Family/group management
│   │   ├── GroupMembersManager.js # Group member operations
│   │   ├── GroupSwitcher.js       # Group selection component
│   │   ├── Modal.js               # Reusable modal component
│   │   ├── Navbar.js              # Main navigation
│   │   ├── PendingInvitesList.js  # Invitation management
│   │   ├── ThemeToggle.js         # Dark/light mode toggle
│   │   ├── TopRightMenu.js        # User menu
│   │   ├── Charts/
│   │   │   └── ExpenseChart.js    # Data visualization
│   │   └── UI/
│   │       ├── Components.js      # Common UI components
│   │       └── StatsCards.js      # Statistics cards
│   ├── pages/             # Page components
│   │   ├── AddExpense.js          # Expense creation form
│   │   ├── Categories.js          # Category management page
│   │   ├── Dashboard.js           # Main dashboard
│   │   ├── FamilyMembers.js       # Member management page
│   │   ├── GroupSelect.js         # Group selection page
│   │   ├── InviteAcceptPage.js    # Invitation acceptance
│   │   ├── Login.js               # Login form
│   │   ├── Register.js            # Registration form
│   │   ├── Reports.js             # Analytics and reports
│   │   └── WelcomeGroup.js        # Group welcome screen
│   ├── context/           # React context providers
│   │   ├── AuthContext.js         # Authentication state
│   │   ├── ThemeContext.js        # Theme management
│   │   └── ToastContext.js        # Notification system
│   ├── api/               # API client
│   │   └── client.js              # Axios HTTP client
│   ├── App.js             # Main app component
│   ├── App.css            # Global styles
│   ├── index.js           # Entry point
│   └── index.css          # Tailwind imports
├── tailwind.config.js     # Tailwind configuration
├── postcss.config.js      # PostCSS configuration
└── package.json           # Dependencies and scripts
```

## 🎨 Technology Stack

### Core Technologies

- **React 18** - UI library with hooks and concurrent features
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication

### UI & Visualization

- **Chart.js** - Data visualization and charts
- **React Chart.js 2** - React wrapper for Chart.js
- **Framer Motion** - Advanced animations and transitions
- **Lucide React** - Beautiful, customizable icons
- **React Spring** - Spring-physics animations

### Development Tools

- **Create React App** - Build toolchain
- **React Scripts** - Development and build scripts
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## ✨ Key Features

### Responsive Design

- **Mobile-first approach** with Tailwind CSS
- **Responsive tables** and forms that work on all devices
- **Touch-friendly interfaces** for mobile users
- **Adaptive layouts** that scale beautifully

### Real-time Updates

- **Automatic data refresh** after CRUD operations
- **Optimistic UI updates** for better user experience
- **Error handling** with user-friendly feedback
- **Loading states** for all async operations

### Smart Forms

- **Form validation** with clear error messages
- **Disabled states** when prerequisites are missing
- **Auto-population** of default values
- **Smart defaults** based on user context

### User Experience

- **Intuitive navigation** with clear visual hierarchy
- **Confirmation dialogs** for destructive actions
- **Toast notifications** for user feedback
- **Contextual help** and guidance

### Theme Support

- **Dark mode** support with theme toggle
- **Consistent color palette** across all components
- **Accessible contrast** ratios
- **System theme detection**

## 🧩 Component Overview

### Pages

- **Dashboard** - Main overview with tabbed navigation
- **AddExpense** - Expense creation form with splitting options
- **Categories** - Category management interface
- **FamilyMembers** - Group member management and invitations
- **Reports** - Expense reports and data visualization
- **Login/Register** - Authentication forms

### Core Components

- **ExpenseList** - Display, filter, and manage expenses
- **CategoryManager** - CRUD operations for categories
- **FamilyManager** - Group and member management
- **ExpenseSplitting** - Balance calculations and settlement
- **Navbar** - Main navigation with user menu
- **Modal** - Reusable modal component

## 🔧 Development

### Available Scripts

```bash
npm start      # Start development server with hot reload
npm run build  # Build optimized production bundle
npm test       # Run test suite
npm run eject  # Eject from Create React App (irreversible)
```

### Development Server Features

- **Hot reload** - Changes reflected immediately
- **Error overlay** - Development errors shown in browser
- **Proxy setup** - API requests automatically proxied to backend
- **Fast refresh** - Preserves component state during edits

### Building for Production

```bash
npm run build
```

- Creates optimized build in `build/` folder
- Minifies and optimizes all assets
- Generates service worker for caching
- Ready for deployment to any static hosting

## 🎨 Styling with Tailwind CSS

### Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
        },
      },
    },
  },
  plugins: [],
};
```

### Common Utility Classes

```css
/* Layout */
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.card {
  @apply bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md;
}

/* Buttons */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 
         focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors;
}

/* Forms */
.form-input {
  @apply w-full p-3 border border-gray-300 rounded-md 
         focus:ring-blue-500 focus:border-blue-500 
         dark:bg-gray-700 dark:border-gray-600 dark:text-white;
}
```

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px   /* Small devices (landscape phones) */
md: 768px   /* Medium devices (tablets) */
lg: 1024px  /* Large devices (laptops) */
xl: 1280px  /* Extra large devices (large laptops) */
2xl: 1536px /* 2X large devices (larger desktops) */
```

### Mobile Optimizations

- **Touch-friendly button sizes** (minimum 44px)
- **Responsive tables** with horizontal scroll on mobile
- **Mobile-first CSS** approach for better performance
- **Optimized images** and assets for faster loading

## 🚀 Deployment

### Static Hosting Options

- **Netlify** - Automatic deployments from Git
- **Vercel** - Zero-config deployments with preview URLs
- **GitHub Pages** - Free hosting for open source projects
- **AWS S3 + CloudFront** - Scalable hosting with CDN

### Environment Variables

```bash
# For React apps, prefix with REACT_APP_
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_VERSION=2.0.0
REACT_APP_ENVIRONMENT=production
```

## 🐛 Troubleshooting

### Common Issues

1. **Blank page after build**

   - Check browser console for JavaScript errors
   - Verify API endpoints are accessible
   - Check for missing environment variables

2. **API requests failing**

   - Ensure backend server is running on port 5000
   - Check proxy configuration in package.json
   - Verify CORS settings on backend

3. **Styling issues**

   - Clear browser cache and hard reload
   - Check Tailwind class names for typos
   - Verify CSS build process completed

4. **Empty dropdowns**
   - Run `npm run init` in backend directory
   - Ensure categories and group members are created

### Development Debugging

```javascript
// Enable React DevTools
// Install React Developer Tools browser extension

// Debug API calls
console.log("API Request:", response.config);
console.log("API Response:", response.data);
```

## 🌟 Future Enhancements

- [ ] **PWA features** - Offline support and app installation
- [ ] **Advanced animations** - Micro-interactions and transitions
- [ ] **Accessibility improvements** - Full WCAG compliance
- [ ] **Internationalization** - Multi-language support
- [ ] **Advanced filtering** - Complex search and filter options
- [ ] **Real-time updates** - WebSocket integration

---

**Frontend ready for an amazing family expense tracking experience! ✨**
