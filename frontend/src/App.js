import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Reports from './pages/Reports';
import ExpenseList from './components/ExpenseList';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="max-w-3xl mx-auto py-8">
          <Routes>
            <Route path="/" element={<><Dashboard /><ExpenseList /></>} />
            <Route path="/add" element={<AddExpense />} />
            <Route path="/reports" element={<Reports />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
