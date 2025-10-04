# Group Expense Tracker 💰

A comprehensive MERN stack web application for tracking and managing group expenses with intelligent splitting, invitations, and multi-group membership.

![Group Expense Tracker](https://img.shields.io/badge/MERN-Stack-blue)

## 📁 Project Structure
- 👥 **Group Member Management** - Invite, add, and manage members per group
- ⚖️ **Smart Expense Splitting** - Even split or custom ratios among group members
- 📊 **Balance Calculations** - Real-time calculations showing who owes what across the group
- 📨 **Invitations & Join Codes** - Invite by email or join via group code/ID
- 🔐 **Authentication** - JWT-based login & registration
- 🚀 **Quick Setup** - One-command database initialization with sample data
│   ├── models/               # Mongoose schemas
│   │   ├── Expense.js
│   │   ├── Category.js
│   │   └── User.js
│   ├── routes/               # API routes
- **Sample Users**: Alice, Bob, Charlie, Dana
│   │   ├── categoryRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/              # Utility scripts
│   │   └── initializeDB.js
│   ├── .env                  # Environment variables
│   ├── server.js            # Entry point
│   └── package.json
2. Navigate to the **Members** tab (in Dashboard) to manage your group
├── frontend/                  # React application
│   ├── public/               # Static files
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── ExpenseList.js
│   │   │   ├── CategoryManager.js
│   │   │   ├── GroupMembersManager.js
│   │   │   ├── ExpenseSplitting.js
│   │   │   ├── Navbar.js
- **Even Split**: Automatically divides equally among all members
│   │   │   └── Modal.js
- **Custom Split**: Set specific ratios (must sum to 100%)
│   │   ├── pages/           # Page components
│   │   │   ├── Dashboard.js
│   │   │   ├── AddExpense.js
- **Manage Members**: Invite, add, or remove group members; view pending invites
│   │   └── index.js         # Entry point
│   ├── tailwind.config.js   # Tailwind configuration
│   └── package.json
├── .gitignore               # Git ignore rules
├── README.md               # Project documentation
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
### Family Members

- `GET /api/users` - Retrieve all family members

### Categories

### Expenses

- `GET /api/expenses` - Retrieve all expenses
- `POST /api/expenses` - Add new expense
- `GET /api/expenses/:id` - Get specific expense
- **Can't add expenses**: Ensure group members and categories exist

## 🔧 Development

cd backend
npm run dev  # Uses nodemon for auto-restart on file changes
```
```bash
npm start    # React development server with hot reload
**Made with ❤️ for groups who want to track expenses together!**

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

**Made with ❤️ for groups who want to track expenses together!**

⭐ If you find this project helpful, please consider giving it a star on GitHub!
