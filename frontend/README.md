# Family Expense Tracker - Frontend

This is the frontend React application for the Family Expense Tracker, built with React 18 and Tailwind CSS.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm package manager
- Backend API server running on port 5000

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm start
   ```

3. **Access the application**
   - Development: http://localhost:3000
   - The app will automatically proxy API requests to http://localhost:5000

## 📁 Project Structure

```
frontend/
├── public/                # Static files
├── src/
│   ├── components/        # Reusable components
│   │   ├── ExpenseList.js
│   │   ├── CategoryManager.js
│   │   ├── FamilyManager.js
│   │   ├── ExpenseSplitting.js
│   │   ├── Navbar.js
│   │   └── Modal.js
│   ├── pages/            # Page components
│   │   ├── Dashboard.js
│   │   ├── AddExpense.js
│   │   └── Reports.js
│   ├── App.js           # Main app component
│   └── index.js         # Entry point
├── tailwind.config.js   # Tailwind configuration
└── package.json
```

## 🎨 Technology Stack

- **React 18** - UI library with hooks
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication
- **Create React App** - Build toolchain

## 🔧 Development

### Available Scripts

```bash
npm start      # Start development server
npm run build  # Build for production
npm test       # Run tests
```

### Features

- **Hot reload** - Changes reflected immediately
- **Error overlay** - Development errors shown in browser
- **Proxy setup** - API requests proxied to backend

## 🐛 Troubleshooting

### Common Issues

1. **API requests failing**

   - Ensure backend server is running on port 5000
   - Check browser console for errors

2. **Styling issues**

   - Clear browser cache
   - Verify Tailwind CSS is working

3. **Empty dropdowns**
   - Run `npm run init` in backend directory
   - Ensure family members and categories are created

---

**Ready to track family expenses! ✨**

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm package manager
- Backend API server running on port 5000

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm start
   ```

3. **Access the application**
   - Development: http://localhost:3000
   - The app will automatically proxy API requests to http://localhost:5000

## 📁 Project Structure

```
frontend/
├── public/                # Static files
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/        # Reusable components
│   │   ├── ExpenseList.js
│   │   ├── CategoryManager.js
│   │   ├── FamilyManager.js
│   │   ├── ExpenseSplitting.js
│   │   ├── Navbar.js
│   │   └── Modal.js
│   ├── pages/            # Page components
│   │   ├── Dashboard.js
│   │   ├── AddExpense.js
│   │   ├── Categories.js
│   │   ├── FamilyMembers.js
│   │   └── Reports.js
│   ├── App.js           # Main app component
│   ├── App.css          # Global styles
│   ├── index.js         # Entry point
│   └── index.css        # Tailwind imports
├── tailwind.config.js   # Tailwind configuration
└── package.json
```

## 🎨 Technology Stack

### Core Technologies

- **React 18** - UI library with hooks and concurrent features
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API communication

### Development Tools

- **Create React App** - Build toolchain
- **React Scripts** - Development and build scripts
- **ESLint** - Code linting
- **Prettier** - Code formatting

## 🧩 Components Overview

### Pages

- **Dashboard** - Main overview with tabbed navigation
- **AddExpense** - Expense creation form with splitting options
- **Categories** - Category management interface
- **FamilyMembers** - Family member management
- **Reports** - Expense reports and analytics

### Components

- **ExpenseList** - Display and manage all expenses
- **CategoryManager** - CRUD operations for categories
- **FamilyManager** - CRUD operations for family members
- **ExpenseSplitting** - Balance calculations and visualization
- **Navbar** - Main navigation component
- **Modal** - Reusable modal component

## 🎯 Key Features

### Responsive Design

- Mobile-first approach with Tailwind CSS
- Responsive tables and forms
- Touch-friendly interfaces

### Real-time Updates

- Automatic data refresh after CRUD operations
- Optimistic UI updates
- Error handling with user feedback

### Smart Forms

- Form validation and error messages
- Disabled states when prerequisites are missing
- Auto-population of default values

### User Experience

- Loading states for async operations
- Confirmation dialogs for destructive actions
- Clear navigation and visual feedback

## 🔧 Development

### Available Scripts

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from Create React App (irreversible)
npm run eject
```

### Development Server

- **Hot reload** - Changes reflected immediately
- **Error overlay** - Development errors shown in browser
- **Proxy setup** - API requests proxied to backend

### Building for Production

```bash
npm run build
```

- Creates optimized build in `build/` folder
- Minifies and optimizes all assets
- Ready for deployment

## 🎨 Styling with Tailwind CSS

### Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      // Custom colors, fonts, etc.
    },
  },
  plugins: [],
};
```

### Common Utilities

```css
/* Layout */
.container {
  @apply max-w-7xl mx-auto px-4;
}
.card {
  @apply bg-white p-6 rounded shadow-md;
}

/* Buttons */
.btn-primary {
  @apply px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700;
}
.btn-secondary {
  @apply px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700;
}

/* Forms */
.form-input {
  @apply w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500;
}
```

## 🔄 State Management

### Component State

- React hooks (`useState`, `useEffect`)
- Local component state for forms and UI
- Prop drilling for shared state

### API Integration

```javascript
// Example API call
const fetchExpenses = async () => {
  try {
    const response = await axios.get("/api/expenses");
    setExpenses(response.data);
  } catch (error) {
    console.error("Error fetching expenses:", error);
  }
};
```

### Data Flow

```
User Action → API Call → Update State → Re-render UI
```

## 🧪 Testing

### Test Setup

```bash
# Run tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Static Hosting

- **Netlify**: Connect GitHub repo for automatic deployments
- **Vercel**: Zero-config deployments
- **GitHub Pages**: Free hosting for static sites

### Environment Variables

```javascript
// For React apps, prefix with REACT_APP_
REACT_APP_API_URL=https://your-api-domain.com
REACT_APP_VERSION=2.0.0
```

## 📱 Responsive Design

### Breakpoints

```css
sm: 640px   /* Small devices */
md: 768px   /* Medium devices */
lg: 1024px  /* Large devices */
xl: 1280px  /* Extra large devices */
2xl: 1536px /* 2X large devices */
```

### Mobile Optimizations

- Touch-friendly button sizes (min 44px)
- Responsive tables with horizontal scroll
- Mobile-first CSS approach
- Optimized images and assets

## 🐛 Troubleshooting

### Common Issues

1. **Blank page after build**

   - Check browser console for errors
   - Verify API endpoints are accessible
   - Check for JavaScript errors

2. **API requests failing**

   - Ensure backend server is running
   - Check proxy configuration
   - Verify CORS settings on backend

3. **Styling issues**

   - Clear browser cache
   - Check Tailwind class names
   - Verify CSS build process

4. **Routing not working**
   - Ensure React Router is properly configured
   - Check for exact path matching
   - Verify server configuration for SPA

## 📊 Performance Optimization

### Current Optimizations

- Code splitting with React.lazy()
- Memoization with React.memo()
- Efficient re-renders with proper dependencies

### Future Enhancements

- [ ] Dark mode support
- [ ] Offline functionality with service workers
- [ ] Progressive Web App (PWA) capabilities
- [ ] Advanced animations and transitions

---

**Frontend ready for an amazing family expense tracking experience! ✨**
