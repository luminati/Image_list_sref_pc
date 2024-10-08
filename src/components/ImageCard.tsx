import React, { useState } from 'react';
import { Image, PersonalizationCodeImage } from '../types';
import { User, Box, Mountain, Plus } from 'lucide-react';

interface ImageCardProps {
  image: Image | PersonalizationCodeImage;
  onImageClick: (image: Image | PersonalizationCodeImage) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onImageClick }) => {
  const [currentView, setCurrentView] = useState<'character' | 'object' | 'landscape'>('character');

  const copyTag = (e: React.MouseEvent, tag: string) => {
    e.stopPropagation();
    navigator.clipboard.writeText(tag);
    alert(`Tag "${tag}" copied to clipboard!`);
  };

  const renderImage = () => {
    if ('url' in image) {
      return (
        <img
          src={image.url}
          alt={image.description}
          className="w-full h-48 object-cover transition-transform transform group-hover:scale-105"
        />
      );
    } else {
      return (
        <div className="relative w-full h-48">
          <img
            src={image[currentView] || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={`${currentView} view`}
            className="w-full h-full object-cover transition-transform transform group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 flex space-x-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView('character');
              }}
              className={`p-1 rounded-full ${currentView === 'character' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            >
              <User size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView('object');
              }}
              className={`p-1 rounded-full ${currentView === 'object' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            >
              <Box size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setCurrentView('landscape');
              }}
              className={`p-1 rounded-full ${currentView === 'landscape' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600'}`}
            >
              <Mountain size={16} />
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div
      className="relative group cursor-pointer bg-white rounded-lg shadow-md overflow-hidden"
      onClick={() => onImageClick(image)}
    >
      {renderImage()}
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
        <div className="flex flex-wrap gap-1">
          {image.tags.slice(0, 3).map(tag => (
            <span
              key={tag}
              className="text-xs bg-white text-black px-1 rounded cursor-pointer hover:bg-gray-200"
              onClick={(e) => copyTag(e, tag)}
            >
              {tag}
            </span>
          ))}
          {image.tags.length > 3 && (
            <span className="text-xs bg-white text-black px-1 rounded cursor-pointer hover:bg-gray-200">
              <Plus size={12} className="inline" />
              {image.tags.length - 3}
            </span>
          )}
        </div>
        <h3 className="text-sm font-semibold text-white truncate">{image.description}</h3>
      </div>
    </div>
  );
};

export default ImageCard;