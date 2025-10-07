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

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/Family-Expense-Tracker-Web-App.git
   cd Family-Expense-Tracker-Web-App
   ```

2. **Setup Backend**

   ```bash
   cd backend
   npm install

   # Create .env file from example
   copy .env.example .env
   # Edit .env file with your MongoDB connection and JWT secret

   # Initialize database with sample data
   npm run init

   # Start development server
   npm run dev
   ```

3. **Setup Frontend**

   ```bash
   cd ../frontend
   npm install

   # Start development server
   npm start
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Environment Variables

Create a `.env` file in the backend directory:

```bash
MONGO_URI=mongodb://localhost:27017/family-expense-tracker
PORT=5000
NODE_ENV=development
JWT_SECRET=your-secret-key-here
```

## 💡 How to Use

### Getting Started

1. **Register** a new account or **login** with existing credentials
2. **Create a group** or **join an existing group** using group code/ID
3. **Add categories** to organize your expenses
4. **Invite members** to your group via email or share the group code
5. **Start tracking expenses** with smart splitting options

### Expense Splitting Options

- **Even Split**: Automatically divides equally among all group members
- **Custom Split**: Set specific ratios for each member (must sum to 100%)

### Group Management

- **Invite Members**: Send email invitations or share group codes
- **Manage Permissions**: Group creators have admin privileges
- **View Balances**: See who owes what in real-time

## 🔌 API Documentation

### Auth & Users

- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Current user + memberships

### Groups

- `POST /api/groups` - Create new group (creator admin)
- `GET /api/groups/mine` - List my memberships
- `GET /api/groups/:groupId` - Group detail (members + invites snapshot)
- `POST /api/groups/join` - Join by id or code `{ groupIdOrCode }`
- `POST /api/groups/:groupId/members` - Add existing user (admin)
- `DELETE /api/groups/:groupId/members` - Remove member (admin)
- `POST /api/groups/:groupId/invite` - Invite by email (admin)
- `GET /api/groups/:groupId/invites` - Pending invites (admin)
- `POST /api/groups/invites/:token/accept` - Accept invite

### Categories

Categories are scoped per group and require authentication + membership.

Endpoints:

- `GET /api/categories?groupId=<groupId>` – List categories in a group
- `POST /api/categories` – Create category `{ name, group }`
- `PUT /api/categories/:id` – Rename a category `{ name }`
- `DELETE /api/categories/:id` – Remove a category (expenses keep the ObjectId reference; consider soft-delete in future)

Uniqueness: `(group, name)` is enforced with a unique compound index.

Default seeding: When a group is created, a default set of categories is inserted (see `DEFAULT_CATEGORIES` in backend controller/model logic).

### Expenses

- `GET /api/expenses?groupId=<groupId>` - Retrieve group expenses
- `POST /api/expenses` - Add new expense (body: `group, amount, category, date, paidBy, notes, split?`)
- `GET /api/expenses/:id` - Get specific expense
- `PUT /api/expenses/:id` - Update expense fields
- `DELETE /api/expenses/:id` - Remove an expense
- `GET /api/expenses/balances?groupId=<groupId>` - Aggregated per-member paid/owes/balance

Split logic:

- Even split (no `split[]` provided): divides equally among current group members
- Custom split: provide `split: [{ user, ratio }, ...]` where ratios sum to 1.0 (±0.001 tolerance)

Validation ensures total ratio correctness.

Requirements to create an expense:

- Valid group membership
- Existing category inside that group
- `paidBy` user must be a member of the group

### Finding / Using Group ID or Code

You can join a group via either its MongoDB ObjectId (`_id`) or its short auto-generated `code`.

Where to find them:

1. After creating a group (response body contains `_id` and `code`).
2. Call `GET /api/groups/:groupId` (if you are a member) – returns full group including `code`.
3. In the frontend, open the network tab when creating or viewing a group; or enhance UI (next improvement) to display it.

Join endpoint usage:

```
POST /api/groups/join
{ "groupIdOrCode": "ABC123" }
```

If the value matches a 24-char hex it attempts an `_id` lookup first; otherwise it uppercases and searches by `code`.

Future UI improvement suggestion: Add a small panel on the Members tab showing “Group Code: ABC123” with a copy-to-clipboard button.

## 🔧 Development

cd backend
npm run dev # Uses nodemon for auto-restart on file changes

````
```bash
npm start    # React development server with hot reload
**Made with ❤️ for groups who want to track expenses together!**

### Database Management

```bash
cd backend
npm run init    # Reinitialize database with default data
npm run setup   # Complete setup (install + initialize)
````

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

- [ ] Email notifications for expense settlements
- [ ] Export data to CSV/PDF
- [ ] Mobile app using React Native
- [ ] Advanced reporting and analytics
- [ ] Receipt photo uploads
- [ ] Recurring expense templates
- [ ] Multi-currency support
- [ ] Offline capability with sync
- [ ] Dark mode support
- [ ] Advanced filtering and search

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

**Made with ❤️ for groups who want to track expenses together!**

⭐ If you find this project helpful, please consider giving it a star on GitHub!
