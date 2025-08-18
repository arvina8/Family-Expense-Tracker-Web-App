import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav className="bg-blue-600 p-4 text-white flex justify-between items-center">
    <div className="font-bold text-xl">Family Expense Tracker</div>
    <div className="space-x-4">
      <Link to="/" className="hover:underline">Dashboard</Link>
      <Link to="/family" className="hover:underline">Family</Link>
      <Link to="/add" className="hover:underline">Add Expense</Link>
      <Link to="/categories" className="hover:underline">Categories</Link>
      <Link to="/reports" className="hover:underline">Reports</Link>
    </div>
  </nav>
);

export default Navbar;
