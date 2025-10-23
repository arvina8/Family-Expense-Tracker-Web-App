# Family Expense Tracker 💰

A comprehensive MERN stack web application for tracking and managing group expenses with intelligent splitting, invitations, and multi-group membership functionality.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue)
![Node.js](https://img.shields.io/badge/Node.js-v18+-green)
![React](https://img.shields.io/badge/React-18-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)

## ✨ Features

- 👥 **Group Member Management** - Invite, add, and manage members per group
- ⚖️ **Smart Expense Splitting** - Even split or custom ratios among group members
- 📊 **Balance Calculations** - Real-time calculations showing who owes what across the group
- 📨 **Invitations & Join Codes** - Invite by email or join via group code/ID
- 🔐 **JWT Authentication** - Secure login & registration system
- 🏷️ **Category Management** - Organize expenses with custom categories
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🎨 **Modern UI** - Built with Tailwind CSS and Lucide icons
- 📈 **Visual Reports** - Charts and graphs for expense visualization

## 📁 Project Structure

```
Family-Expense-Tracker-Web-App/
├── backend/                    # Node.js Express API
│   ├── controllers/           # Business logic
│   ├── middleware/           # Auth middleware
│   ├── models/              # Mongoose schemas
│   ├── routes/              # API routes
│   ├── scripts/             # Utility scripts
│   └── server.js           # Entry point
├── frontend/               # React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React context providers
│   │   └── api/         # API client
│   └── package.json
└── README.md             # Project documentation
```

## 🚀 Quick Start

### Prerequisites

- **Docker** (latest version)
- **Docker Compose** (latest version)

### Running with Docker

1. **Clone the repository**

   ```bash
   git clone https://github.com/vikranth2711/Family-Expense-Tracker-Web-App.git
   cd Family-Expense-Tracker-Web-App
   ```

2. **Start the application**

   ```bash
   docker-compose up --build
   ```

3. **Access the application**

   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

4. **Stop the application**

   ```bash
   docker-compose down
   ```

### Environment Variables

Ensure the `.env` file is properly configured in the `backend` directory before running the application. Example:

```bash
MONGO_URI=mongodb://mongo:27017/family-expense-tracker
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

---

For manual setup instructions, refer to the `backend/README.md` and `frontend/README.md` files.

---

**Made with ❤️ for groups who want to track expenses together!**

⭐ If you find this project helpful, please consider giving it a star on GitHub!
