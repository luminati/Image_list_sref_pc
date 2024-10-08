import React from 'react';
import { Grid, Image, Layers, Code, FolderPlus } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CategoryMenuProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ selectedCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', name: 'All', icon: Grid },
    { id: 'general', name: 'General', icon: Image },
    { id: 'specialSet', name: 'Special Set', icon: Layers },
    { id: 'personalizationCode', name: 'Personalization Code', icon: Code },
  ];

  return (
    <div className="w-16 bg-white shadow-md flex flex-col items-center py-4 space-y-4">
      {categories.map((category) => {
        const Icon = category.icon;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`p-2 rounded-full transition-colors ${
              selectedCategory === category.id
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
            title={category.name}
          >
            <Icon size={24} />
          </button>
        );
      })}
      <Link
        to="/manage"
        className="p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-colors"
        title="File Management"
      >
        <FolderPlus size={24} />
      </Link>
    </div>
  );
};

export default CategoryMenu;