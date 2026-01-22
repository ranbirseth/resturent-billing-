import React from 'react';
import { Tag } from 'lucide-react';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="flex flex-row md:flex-col gap-2 w-full md:w-48 shrink-0 bg-white p-4 border-b md:border-b-0 md:border-r border-gray-100 overflow-x-auto md:overflow-y-auto">
      <h3 className="hidden md:flex text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 items-center gap-2">
        <Tag size={14} />
        Categories
      </h3>
      <button
        onClick={() => onCategoryChange(null)}
        className={`whitespace-nowrap md:whitespace-normal px-4 py-2 md:py-3 rounded-xl font-bold transition-all text-sm md:text-base ${
          activeCategory === null 
          ? 'bg-primary text-white shadow-lg shadow-orange-100' 
          : 'text-gray-600 hover:bg-gray-50'
        }`}
      >
        All Items
      </button>
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`whitespace-nowrap md:whitespace-normal px-4 py-2 md:py-3 rounded-xl font-bold transition-all truncate text-sm md:text-base ${
            activeCategory === cat 
            ? 'bg-primary text-white shadow-lg shadow-orange-100' 
            : 'text-gray-600 hover:bg-gray-50'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
