import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import Reports from './pages/Reports';
import Categories from './pages/Categories';
import FamilyMembers from './pages/FamilyMembers';
import { GradientBackground } from './components/UI/Components';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/family" element={
            <GradientBackground className="min-h-screen py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <FamilyMembers />
              </div>
            </GradientBackground>
          } />
          <Route path="/add" element={
            <GradientBackground className="min-h-screen py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <AddExpense />
              </div>
            </GradientBackground>
          } />
          <Route path="/reports" element={<Reports />} />
          <Route path="/categories" element={
            <GradientBackground className="min-h-screen py-8">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <Categories />
              </div>
            </GradientBackground>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
