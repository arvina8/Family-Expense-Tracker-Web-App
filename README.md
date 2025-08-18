# Family Expense Tracker 💰

A comprehensive MERN stack web application for tracking and managing family expenses with intelligent splitting and balance calculations.

![Family Expense Tracker](https://img.shields.io/badge/MERN-Stack-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Node](https://img.shields.io/badge/Node.js-16%2B-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## ✨ Features

- 👨‍👩‍👧‍👦 **Family Member Management** - Add, edit, and manage family members
- 💰 **Expense Tracking** - Create, edit, and delete expenses with full history
- ⚖️ **Smart Expense Splitting** - Even split or custom ratios among family members
- 📊 **Balance Calculations** - Real-time calculations showing who owes what to whom
- 🏷️ **Category Management** - Organize expenses with customizable categories
- 📱 **Responsive Design** - Seamless experience on desktop, tablet, and mobile
- 🔄 **Real-time Updates** - Instant UI updates after any data modification
- 🚀 **Quick Setup** - One-command database initialization with default data

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **MongoDB** (local installation) - [Setup Guide](https://docs.mongodb.com/manual/installation/)
- **npm** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/vikranth2711/Family-Expense-Tracker-Web-App.git
   cd Family-Expense-Tracker-Web-App
   ```

2. **Backend Setup**

   ```bash
   cd backend
   npm install

   # Start MongoDB (if not already running)
   # Windows: Open MongoDB as a service or run mongod
   # macOS: brew services start mongodb-community
   # Linux: sudo systemctl start mongod

   # Initialize database with default data
   npm run init

   # Start the backend server
   npm start
   ```

3. **Frontend Setup** (in a new terminal)

   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Access the application**
   - **Frontend**: http://localhost:3000
   - **Backend API**: http://localhost:5000/api

## 🎯 Default Setup

The application comes pre-configured with:

- **Default Family Members**: Dad, Mom, Child 1, Child 2
- **Default Categories**: Food & Dining, Transportation, Utilities, Entertainment, Healthcare, Shopping, Education, Travel, Home & Garden, Other
- **Sample Data**: Ready to use immediately after setup

## 📖 Usage Guide

### 1. First Time Setup

1. Run `npm run init` in the backend directory
2. Navigate to **Family Members** tab to manage your family
3. Go to **Categories** tab to customize expense categories
4. Start adding and tracking expenses!

### 2. Adding Expenses

1. Click **Add Expense** tab
2. Fill in amount, select category, date, and who paid
3. Choose split type:
   - **Even Split**: Automatically divides equally among all family members
   - **Custom Split**: Set specific ratios (must sum to 100%)

### 3. Managing Data

- **Edit Expenses**: Click "Edit" on any expense for inline editing
- **Delete Expenses**: Click "Delete" with confirmation dialog
- **Manage Categories**: Full CRUD operations for expense categories
- **Manage Family**: Add, edit, or remove family members

### 4. Viewing Balances

- Navigate to **Split & Balance** tab
- View detailed breakdown of who paid what and who owes what
- Get clear settlement recommendations

## 🛠️ Technology Stack

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### Frontend

- **React 18** - UI library with hooks
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **Tailwind CSS** - Utility-first CSS framework
- **React Scripts** - Build tools and development server

## 📁 Project Structure

```
Family-Expense-Tracker-Web-App/
├── backend/                    # Express.js API server
│   ├── controllers/           # Business logic
│   │   ├── expenseController.js
│   │   ├── categoryController.js
│   │   └── userController.js
│   ├── models/               # Mongoose schemas
│   │   ├── Expense.js
│   │   ├── Category.js
│   │   └── User.js
│   ├── routes/               # API routes
│   │   ├── expenseRoutes.js
│   │   ├── categoryRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/              # Utility scripts
│   │   └── initializeDB.js
│   ├── .env                  # Environment variables
│   ├── server.js            # Entry point
│   └── package.json
├── frontend/                  # React application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── ExpenseList.js
│   │   │   ├── CategoryManager.js
│   │   │   ├── FamilyManager.js
│   │   │   ├── ExpenseSplitting.js
│   │   │   ├── Navbar.js
│   │   │   └── Modal.js
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.js
│   │   │   ├── AddExpense.js
│   │   │   ├── Categories.js
│   │   │   ├── FamilyMembers.js
│   │   │   └── Reports.js
│   │   ├── App.js           # Main app component
│   │   └── index.js         # Entry point
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
├── .gitignore               # Git ignore rules
├── README.md               # Project documentation
├── FIXES_SUMMARY.md       # Implementation details
└── IMPLEMENTATION_SUMMARY.md # Feature documentation
```

## 🔌 API Endpoints

### Family Members

- `GET /api/users` - Retrieve all family members
- `POST /api/users` - Add new family member
- `GET /api/users/:id` - Get specific family member
- `PUT /api/users/:id` - Update family member
- `DELETE /api/users/:id` - Remove family member
- `POST /api/users/initialize` - Create default family members

### Categories

- `GET /api/categories` - Retrieve all categories
- `POST /api/categories` - Add new category
- `GET /api/categories/:id` - Get specific category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses

- `GET /api/expenses` - Retrieve all expenses
- `POST /api/expenses` - Add new expense
- `GET /api/expenses/:id` - Get specific expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/balances` - Get balance calculations

## 🔧 Development

### Backend Development

```bash
cd backend
npm run dev  # Uses nodemon for auto-restart on file changes
```

### Frontend Development

```bash
cd frontend
npm start    # React development server with hot reload
```

### Database Management

```bash
cd backend
npm run init    # Reinitialize database with default data
npm run setup   # Complete setup (install + initialize)
```

## 🐛 Troubleshooting

### Backend Issues

- **Server won't start**: Check if MongoDB is running and MONGO_URI is correct
- **Database connection failed**: Verify MongoDB service status
- **Port already in use**: Change PORT in .env or kill process using port 5000

### Frontend Issues

- **Empty dropdowns**: Run `npm run init` in backend to create default data
- **Can't add expenses**: Ensure family members and categories exist
- **API connection failed**: Verify backend is running on port 5000

### Common Solutions

- **Clear browser cache** if seeing old data
- **Restart both servers** after making configuration changes
- **Check console logs** in browser and terminal for detailed error messages

## 🚧 Development Scripts

### Backend Scripts

```bash
npm start        # Start production server
npm run dev      # Start development server with nodemon
npm run init     # Initialize database with default data
npm run setup    # Install dependencies and initialize database
```

### Frontend Scripts

```bash
npm start        # Start development server
npm run build    # Build for production
npm test         # Run tests
npm run eject    # Eject from Create React App (irreversible)
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 💡 Future Enhancements

- [ ] User authentication and authorization
- [ ] Email notifications for expense settlements
- [ ] Export data to CSV/PDF
- [ ] Mobile app using React Native
- [ ] Advanced reporting and analytics
- [ ] Receipt photo uploads
- [ ] Recurring expense templates
- [ ] Multi-currency support

## 🆘 Support

For support and questions:

1. **Check the troubleshooting section** above
2. **Review existing issues** in the GitHub repository
3. **Create a new issue** with detailed description
4. **Contact the maintainers** for urgent matters

## 🙏 Acknowledgments

- Built with the MERN stack
- UI components styled with Tailwind CSS
- Icons and design inspiration from various open-source projects

---

**Made with ❤️ for families who want to track expenses together!**

⭐ If you find this project helpful, please consider giving it a star on GitHub!
