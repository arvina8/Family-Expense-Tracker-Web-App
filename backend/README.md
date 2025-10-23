# Family Expense Tracker - Backend API

This is the backend API server for the Family Expense Tracker application, built with Node.js, Express.js, and MongoDB. It provides a complete REST API for managing groups, expenses, categories, and user authentication with JWT security.

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** package manager

### Installation

1. **Navigate to backend directory**

   ```bash
   cd backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create environment file**

   ```bash
   # Create .env file with the following variables:
   MONGO_URI=mongodb://localhost:27017/family-expense-tracker
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your-secret-key-here
   ```

4. **Initialize database with sample data**

   ```bash
   npm run init
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

The API server will be running at `http://localhost:5000`

## 📁 Project Structure

```
backend/
├── controllers/           # Business logic
│   ├── authController.js     # Authentication logic
│   ├── groupController.js    # Group management
│   ├── expenseController.js  # Expense operations
│   ├── categoryController.js # Category management
│   └── userController.js     # User operations
├── middleware/
│   └── auth.js              # JWT authentication middleware
├── models/                  # Mongoose schemas
│   ├── User.js             # User model with group memberships
│   ├── Group.js            # Group model with members
│   ├── Expense.js          # Expense model with splitting
│   ├── Category.js         # Category model (group-scoped)
│   └── Invite.js           # Invitation model
├── routes/                  # API routes
│   ├── authRoutes.js       # Authentication endpoints
│   ├── groupRoutes.js      # Group management endpoints
│   ├── expenseRoutes.js    # Expense CRUD endpoints
│   ├── categoryRoutes.js   # Category endpoints
│   └── userRoutes.js       # User endpoints
├── scripts/                # Utility scripts
│   ├── initializeDB.js     # Database initialization
│   └── cleanup.js          # Database cleanup
├── .env                    # Environment variables
├── server.js              # Application entry point
└── package.json           # Dependencies and scripts
```

## 🔌 API Endpoints

### Base URL

Local: `http://localhost:5000/api`

### Authentication

| Method | Endpoint         | Description               | Auth Required |
| ------ | ---------------- | ------------------------- | ------------- |
| POST   | `/auth/register` | Register new user         | No            |
| POST   | `/auth/login`    | Login user                | No            |
| GET    | `/auth/me`       | Get current user + groups | Yes           |

### Groups

| Method | Endpoint                        | Description              | Auth Required |
| ------ | ------------------------------- | ------------------------ | ------------- |
| POST   | `/groups`                       | Create new group         | Yes           |
| GET    | `/groups/mine`                  | List user's groups       | Yes           |
| GET    | `/groups/:groupId`              | Get group details        | Yes (Member)  |
| POST   | `/groups/join`                  | Join group by ID/code    | Yes           |
| POST   | `/groups/:groupId/members`      | Add member to group      | Yes (Admin)   |
| DELETE | `/groups/:groupId/members`      | Remove member from group | Yes (Admin)   |
| POST   | `/groups/:groupId/invite`       | Invite member by email   | Yes (Admin)   |
| GET    | `/groups/:groupId/invites`      | Get pending invites      | Yes (Admin)   |
| POST   | `/groups/invites/:token/accept` | Accept invitation        | Yes           |

### Categories

| Method | Endpoint                   | Description          | Auth Required |
| ------ | -------------------------- | -------------------- | ------------- |
| GET    | `/categories?groupId=<id>` | Get group categories | Yes (Member)  |
| POST   | `/categories`              | Create new category  | Yes (Member)  |
| PUT    | `/categories/:id`          | Update category      | Yes (Member)  |
| DELETE | `/categories/:id`          | Delete category      | Yes (Member)  |

### Expenses

| Method | Endpoint                          | Description              | Auth Required |
| ------ | --------------------------------- | ------------------------ | ------------- |
| GET    | `/expenses?groupId=<id>`          | Get group expenses       | Yes (Member)  |
| POST   | `/expenses`                       | Create new expense       | Yes (Member)  |
| GET    | `/expenses/:id`                   | Get specific expense     | Yes (Member)  |
| PUT    | `/expenses/:id`                   | Update expense           | Yes (Member)  |
| DELETE | `/expenses/:id`                   | Delete expense           | Yes (Member)  |
| GET    | `/expenses/balances?groupId=<id>` | Get balance calculations | Yes (Member)  |

## 🛠️ Technology Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🔧 Development

### Available Scripts

```bash
npm start      # Start production server
npm run dev    # Start development server with nodemon
npm run init   # Initialize database with default data
npm run cleanup # Clean database
npm run setup  # Install dependencies and initialize database
```

### Environment Variables

| Variable     | Description               | Default                                            |
| ------------ | ------------------------- | -------------------------------------------------- |
| `MONGO_URI`  | MongoDB connection string | `mongodb://localhost:27017/family-expense-tracker` |
| `PORT`       | Server port               | `5000`                                             |
| `NODE_ENV`   | Environment mode          | `development`                                      |
| `JWT_SECRET` | JWT signing secret        | Required                                           |

### Database Initialization

The `npm run init` command will:

- Clear existing data
- Create sample users (Alice, Bob, Charlie, Dana)
- Create default categories
- Set up sample groups and expenses
- Generate test data for development

## 📝 API Usage Examples

### Register User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create Expense

```bash
curl -X POST http://localhost:5000/api/expenses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{
    "group": "60f1b2e4a1b2c3d4e5f6g7h8",
    "amount": 50.00,
    "category": "60f1b2e4a1b2c3d4e5f6g7h9",
    "date": "2024-01-15",
    "paidBy": "60f1b2e4a1b2c3d4e5f6g7ha",
    "notes": "Lunch at restaurant",
    "split": [
      {"user": "60f1b2e4a1b2c3d4e5f6g7ha", "ratio": 0.5},
      {"user": "60f1b2e4a1b2c3d4e5f6g7hb", "ratio": 0.5}
    ]
  }'
```

## 🔒 Security Features

- **JWT Authentication** - Stateless authentication
- **Password Hashing** - bcrypt for secure password storage
- **Input Validation** - Mongoose schema validation
- **Authorization** - Role-based access control for groups
- **CORS** - Configured for frontend communication

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

3. **Authentication errors**

   - Verify JWT_SECRET is set
   - Check token format in requests
   - Ensure user is logged in

4. **Empty data**
   - Run `npm run init` to create default data
   - Check MongoDB connection
   - Verify database initialization completed

### Error Response Format

```json
{
  "error": "Error message description",
  "status": 400,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📊 Database Schema

### Models Overview

- **User**: Stores user credentials and group memberships
- **Group**: Contains group information and member relationships
- **Expense**: Tracks expenses with splitting logic
- **Category**: Group-scoped expense categories
- **Invite**: Manages group invitations

### Relationships

```
User ←→ Group (Many-to-Many via memberships)
Group → Category (One-to-Many)
Group → Expense (One-to-Many)
User → Expense (One-to-Many as paidBy)
Category → Expense (One-to-Many)
```

## 🚀 Deployment

### Production Setup

1. **Set production environment variables**

   ```bash
   NODE_ENV=production
   MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/family-expense-tracker
   PORT=5000
   JWT_SECRET=your-production-secret
   ```

2. **Start production server**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

---

# Family Expense Tracker - Backend API

This is the backend API server for the Family Expense Tracker application, built with Node.js, Express.js, and MongoDB. It provides a complete REST API for managing groups, expenses, categories, and user authentication with JWT security.

## 🚀 Quick Start

### Prerequisites

- **Docker** (latest version)
- **Docker Compose** (latest version)

### Running with Docker

1. **Navigate to the project root directory**

   ```bash
   cd ..
   ```

2. **Start the backend service**

   ```bash
   docker-compose up --build
   ```

3. **Access the backend API**

   - Local: `http://localhost:5000`

4. **Stop the backend service**

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

For manual setup instructions, refer to the `Quick Start` section above.

---

**Backend API ready to serve your family expense data! 🚀**
