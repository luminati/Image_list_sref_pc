import React, { useState, useEffect } from 'react';
import { Image, PersonalizationCodeImage } from '../types';
import ImageCard from './ImageCard';
import SearchBar from './SearchBar';
import CategoryMenu from './CategoryMenu';
import { X } from 'lucide-react';
import { loadImages } from '../utils/imageUtils';

const Gallery: React.FC = () => {
  const [images, setImages] = useState<(Image | PersonalizationCodeImage)[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<Image | PersonalizationCodeImage | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    setImages(loadImages());
  }, []);

  const filteredImages = images.filter(image =>
    (selectedCategory === 'all' || image.category === selectedCategory) &&
    (image.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
    image.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleImageClick = (image: Image | PersonalizationCodeImage) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const renderModalContent = () => {
    if (!selectedImage) return null;

    if ('url' in selectedImage) {
      return (
        <img
          src={selectedImage.url}
          alt={selectedImage.description}
          className="w-full h-auto mb-4 rounded"
        />
      );
    } else {
      return (
        <div className="grid grid-cols-3 gap-4 mb-4">
          <img src={selectedImage.character} alt="Character" className="w-full h-auto rounded" />
          <img src={selectedImage.object} alt="Object" className="w-full h-auto rounded" />
          <img src={selectedImage.landscape} alt="Landscape" className="w-full h-auto rounded" />
        </div>
      );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <CategoryMenu selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-4 bg-white shadow-md">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map(image => (
              <ImageCard key={image.id} image={image} onImageClick={handleImageClick} />
            ))}
          </div>
        </div>
      </div>
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
            {renderModalContent()}
            <h2 className="text-xl font-semibold mb-2">{selectedImage.description}</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedImage.tags.map(tag => (
                <span key={tag} className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-sm">
                  {tag}
                </span>
              ))}
            </div>
            <p className="text-gray-600">Category: {selectedImage.category}</p>
            {selectedImage.relatedImages && selectedImage.relatedImages.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold mb-2">Related Images</h3>
                <div className="grid grid-cols-3 gap-2">
                  {selectedImage.relatedImages.map(relatedId => {
                    const relatedImage = images.find(img => img.id === relatedId);
                    return relatedImage ? (
                      <img
                        key={relatedId}
                        src={'url' in relatedImage ? relatedImage.url : relatedImage.character}
                        alt={relatedImage.description}
                        className="w-full h-24 object-cover rounded cursor-pointer"
                        onClick={() => handleImageClick(relatedImage)}
                      />
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;