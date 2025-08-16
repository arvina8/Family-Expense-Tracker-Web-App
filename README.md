# Family Expense Tracker Web App

A full-stack MERN (MongoDB, Express, React, Node.js) application for tracking family expenses.

## Project Structure

```
.
├── backend/   # Express/Mongoose API server
├── frontend/  # React + Tailwind CSS client
├── README.md
└── .gitignore
```

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- npm
- MongoDB (local or remote)

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/vikranth2711/Family-Expense-Tracker-Web-App.git
cd Family-Expense-Tracker-Web-App
```

#### 2. Install dependencies

```sh
cd backend
npm install
cd ../frontend
npm install
```

#### 3. Configure environment variables

Create a `.env` file in the `backend` directory:

```
MONGO_URI=mongodb://localhost:27017/family-expense-tracker
PORT=5000
```

#### 4. Start the backend server

```sh
cd backend
npm start
```

#### 5. Start the frontend development server

```sh
cd ../frontend
npm start
```

The React app will run on [http://localhost:3000](http://localhost:3000) and proxy API requests to the backend.

## Features

- User, category, and expense management
- Expense splitting and reporting
- Responsive UI with Tailwind CSS

## Folder Details

- `backend/` - Express API, Mongoose models, controllers, and routes
- `frontend/` - React app, components, pages, and Tailwind CSS config
