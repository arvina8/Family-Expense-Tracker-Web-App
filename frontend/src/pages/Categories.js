import React from 'react';
import CategoryManager from '../components/CategoryManager';

const Categories = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <CategoryManager />
      </div>
    </div>
  );
};

export default Categories;
