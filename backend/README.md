# Group Expense Tracker - Backend API

This is the backend API server for the Group Expense Tracker application (multi-group, JWT-secured), built with Node.js, Express.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation)
- npm package manager

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start MongoDB**

   ```bash
   # Windows: Start MongoDB service or run mongod
   # macOS: brew services start mongodb-community
   # Linux: sudo systemctl start mongod
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
backend/
├── controllers/           # Business logic
│   ├── authController.js
│   ├── groupController.js
│   ├── expenseController.js
│   ├── categoryController.js
│   └── userController.js
├── middleware/
│   └── auth.js
├── models/               # Mongoose schemas
│   ├── Group.js
│   ├── Expense.js
│   ├── Category.js
│   └── User.js
├── routes/               # API routes
│   ├── authRoutes.js
│   ├── groupRoutes.js
│   ├── expenseRoutes.js
│   ├── categoryRoutes.js
│   └── userRoutes.js
├── .env                  # Environment variables
├── server.js            # Entry point
└── package.json
```

## 🔌 API Endpoints

### Auth

- `POST /api/auth/register` - Register new account
- `POST /api/auth/login` - Login and get JWT token
- `GET /api/auth/me` - Get current user details and groups

### Groups

- `POST /api/groups` - Create group (auth)
- `GET /api/groups/mine` - List my groups (auth)
- `POST /api/groups/:groupId/members` - Add member by email (admin)
- `DELETE /api/groups/:groupId/members` - Remove member by userId (admin)

### Categories (group-scoped)

- `GET /api/categories` - Get all categories
- `POST /api/categories` - Add new category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

### Expenses (group-scoped)

- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Add new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/balances` - Get balance calculations

## 🛠️ Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables
- **jsonwebtoken** - JWT auth
- **bcrypt** - Password hashing

## 🔧 Development

### Available Scripts

```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
npm run init   # Initialize database with default data
npm run setup  # Install dependencies and initialize database
```

### Environment Variables

Create a `.env` file with:

```bash
MONGO_URI=mongodb://localhost:27017/group-expense-tracker
PORT=5000
NODE_ENV=development
JWT_SECRET=replace-with-a-strong-secret
```

## 🐛 Troubleshooting

### Common Issues

1. **Server won't start**

   - Check if MongoDB is running
   - Verify MONGO_URI in .env file
   - Ensure port 5000 is available

2. **Database connection failed**

   - Verify MongoDB service status
   - Check MongoDB connection string
   - Ensure database permissions

3. **Empty data**
   - Run `npm run init` to create default data
   - Check MongoDB connection

---

**Backend API ready to serve your group expense data! 🚀**

3. **Initialize database**

   ```bash
   npm run init
   ```

4. **Start the server**

   ```bash
   # Development mode (with auto-restart)
   npm run dev

   # Production mode
   npm start
   ```

## 📁 Project Structure

```
backend/
├── controllers/           # Business logic
│   ├── expenseController.js
│   ├── categoryController.js
│   └── userController.js
├── models/               # Mongoose schemas
│   ├── Expense.js
│   ├── Category.js
│   └── User.js
├── routes/               # API routes
│   ├── expenseRoutes.js
│   ├── categoryRoutes.js
│   └── userRoutes.js
├── scripts/              # Utility scripts
│   └── initializeDB.js
├── .env                  # Environment variables
├── server.js            # Entry point
└── package.json
```

## 🔌 API Endpoints

### Base URL

Local: http://localhost:5000/api

### Auth

| Method | Endpoint         | Description           |
| ------ | ---------------- | --------------------- |
| POST   | `/auth/register` | Register              |
| POST   | `/auth/login`    | Login and get token   |
| GET    | `/auth/me`       | Current user + groups |

#### User Schema (simplified)

name, email (unique), password (hashed), memberships: [{ group, role }]

### Categories

| Method | Endpoint          | Description           |
| ------ | ----------------- | --------------------- |
| GET    | `/categories`     | Get all categories    |
| POST   | `/categories`     | Create new category   |
| GET    | `/categories/:id` | Get specific category |
| PUT    | `/categories/:id` | Update category       |
| DELETE | `/categories/:id` | Delete category       |

#### Category Schema

name, group

### Expenses

| Method | Endpoint             | Description              |
| ------ | -------------------- | ------------------------ |
| GET    | `/expenses`          | Get all expenses         |
| POST   | `/expenses`          | Create new expense       |
| GET    | `/expenses/:id`      | Get specific expense     |
| PUT    | `/expenses/:id`      | Update expense           |
| DELETE | `/expenses/:id`      | Delete expense           |
| GET    | `/expenses/balances` | Get balance calculations |

#### Expense Schema

group, amount, category, date, paidBy, notes, split: [{ user, ratio }]

## 📝 API Usage Examples

### Register

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane",
    "email": "jane@example.com",
    "password": "password123"
  }'
```

### Create Expense with Split

```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -d '{
    "amount": 100,
    "category": "60f1b2e4a1b2c3d4e5f6g7h8",
    "date": "2025-08-17",
    "paidBy": "60f1b2e4a1b2c3d4e5f6g7h9",
    "description": "Grocery shopping",
    "split": [
      {"user": "60f1b2e4a1b2c3d4e5f6g7h9", "ratio": 0.5},
      {"user": "60f1b2e4a1b2c3d4e5f6g7ha", "ratio": 0.5}
    ]
  }'
```

### Get Balance Calculations

```bash
curl -H "Authorization: Bearer <token>" "http://localhost:5000/api/expenses/balances?groupId=<id>"
```

## ⚙️ Configuration

### Environment Variables

| Variable    | Description               | Default                                           |
| ----------- | ------------------------- | ------------------------------------------------- |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/group-expense-tracker` |
| `PORT`      | Server port               | `5000`                                            |
| `NODE_ENV`  | Environment mode          | `development`                                     |

### MongoDB Setup

#### Local MongoDB

```bash
# Install MongoDB (Ubuntu/Debian)
sudo apt update
sudo apt install mongodb

# Start MongoDB service
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create cluster and get connection string
3. Update `MONGO_URI` in `.env` file

## 🔧 Development Scripts

```bash
# Start development server with auto-restart
npm run dev

# Start production server
npm start

# Initialize database with default data
npm run init

# Complete setup (install + initialize)
npm run setup

# Run tests
npm test
```

## 🧪 Testing

### Run Tests

```bash
npm test
```

### Test Structure

```
backend/
├── tests/
│   ├── controllers/
│   ├── models/
│   └── routes/
```

### Writing Tests

```javascript
// Example test file
const request = require("supertest");
const app = require("../server");

describe("GET /api/users", () => {
  it("should return all users", async () => {
    const res = await request(app).get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
  });
});
```

## 🐛 Error Handling

### Error Response Format

```javascript
{
  "error": "Error message",
  "status": 400,
  "timestamp": "2025-08-17T10:30:00.000Z"
}
```

### Common Error Codes

| Code | Description                             |
| ---- | --------------------------------------- |
| 400  | Bad Request - Invalid input data        |
| 404  | Not Found - Resource doesn't exist      |
| 409  | Conflict - Duplicate data (e.g., email) |
| 500  | Internal Server Error                   |

## 🔒 Security Considerations

### Current Implementation

- Input validation using Mongoose schemas
- CORS enabled for frontend communication
- Environment variables for sensitive data

### Recommended Enhancements

- [ ] JWT authentication
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] Password hashing
- [ ] API key authentication

## 📊 Database Schema

### Relationships

```
User
├── Expense.paidBy (One-to-Many)
└── Expense.split.user (Many-to-Many)

Category
└── Expense.category (One-to-Many)

Expense
├── paidBy → User
├── category → Category
└── split.user → User
```

### Indexes

```javascript
// Recommended indexes for performance
User: { email: 1 }
Category: { group: 1, name: 1 }
Expense: { group: 1, date: -1, paidBy: 1, category: 1 }
```

## 🚀 Deployment

### Local Deployment

```bash
# Build and start
npm install
npm run init
npm start
```

### Environment Variables for Production

```bash
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/group-expense-tracker
PORT=5000
```

## 📈 Performance Optimization

### Current Optimizations

- Database population for related data
- Efficient queries with Mongoose
- Proper error handling

### Recommendations

- [ ] Add Redis caching
- [ ] Implement database indexing
- [ ] Add request logging
- [ ] Monitor performance metrics

## 🔄 Database Migration

### Adding New Fields

```bash
# Create migration script
node scripts/migrate.js
```

### Backup and Restore

```bash
# Backup
mongodump --uri="mongodb://localhost:27017/group-expense-tracker"

# Restore
mongorestore --uri="mongodb://localhost:27017/group-expense-tracker" dump/
```

## 📞 Support

For backend-specific issues:

1. Check the logs in console
2. Verify MongoDB connection
3. Check environment variables
4. Review API documentation

---

**Backend API ready for group expense tracking! 🚀**
