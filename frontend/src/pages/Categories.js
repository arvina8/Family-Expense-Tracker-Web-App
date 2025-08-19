import React from 'react';
import CategoryManager from '../components/CategoryManager';

const Categories = () => {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Expense Categories</h1>
        <p className="text-gray-600">Organize your expenses with custom categories</p>
      </div>
      <div className="max-w-4xl mx-auto">
        <CategoryManager />
      </div>
    </div>
  );
};

export default Categories;
