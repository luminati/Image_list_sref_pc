import React, { useState, useEffect } from 'react';
import { loadImages, saveImage, deleteImage, getStorageUsage, getMaxStorageSize } from '../utils/imageUtils';
import { Image, PersonalizationCodeImage } from '../types';
import { Plus, Trash2, ArrowLeft, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

const FileManagement: React.FC = () => {
  const [images, setImages] = useState<(Image | PersonalizationCodeImage)[]>([]);
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');
  const [urlInput, setUrlInput] = useState('');
  const [personalizationImages, setPersonalizationImages] = useState<Partial<PersonalizationCodeImage>>({});
  const [error, setError] = useState<string | null>(null);
  const [storageUsage, setStorageUsage] = useState<number>(0);

  useEffect(() => {
    const loadedImages = loadImages();
    setImages(loadedImages);
    updateStorageUsage();
  }, []);

  const updateStorageUsage = () => {
    const usage = getStorageUsage();
    const maxSize = getMaxStorageSize();
    setStorageUsage(Math.round((usage / maxSize) * 100));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    let newImage: Image | PersonalizationCodeImage;

    if (category === 'personalizationCode') {
      if (!personalizationImages.character || !personalizationImages.object || !personalizationImages.landscape) {
        setError('Please upload all three images for personalization code.');
        return;
      }
      newImage = {
        id: Date.now(),
        character: personalizationImages.character,
        object: personalizationImages.object,
        landscape: personalizationImages.landscape,
        tags: tags.split(',').map(tag => tag.trim()),
        description,
        category: 'personalizationCode',
        relatedImages: []
      };
    } else {
      if (!urlInput) {
        setError('Please provide an image URL.');
        return;
      }
      newImage = {
        id: Date.now(),
        url: urlInput,
        tags: tags.split(',').map(tag => tag.trim()),
        description,
        category,
        relatedImages: []
      };
    }

    saveAndUpdateImages(newImage);
  };

  const saveAndUpdateImages = (newImage: Image | PersonalizationCodeImage) => {
    const success = saveImage(newImage);
    if (success) {
      setImages(prevImages => [...prevImages, newImage]);
      resetForm();
      updateStorageUsage();
    } else {
      setError('Failed to save the image. Storage quota exceeded. Please delete some images and try again.');
    }
  };

  const resetForm = () => {
    setTags('');
    setDescription('');
    setCategory('general');
    setUrlInput('');
    setPersonalizationImages({});
  };

  const handleDelete = (id: number) => {
    deleteImage(id);
    setImages(prevImages => prevImages.filter(img => img.id !== id));
    updateStorageUsage();
  };

  const handlePersonalizationImageUpload = (type: 'character' | 'object' | 'landscape', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPersonalizationImages(prev => ({
        ...prev,
        [type]: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link to="/" className="mr-4">
          <ArrowLeft size={24} className="text-gray-600 hover:text-gray-800" />
        </Link>
        <h1 className="text-3xl font-bold">File Management</h1>
      </div>
      <div className="mb-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Storage Usage: </strong>
        <span className="block sm:inline">{storageUsage}% of available storage used.</span>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          >
            <option value="general">General</option>
            <option value="specialSet">Special Set</option>
            <option value="personalizationCode">Personalization Code</option>
          </select>
        </div>
        {category !== 'personalizationCode' ? (
          <div className="mb-4">
            <label htmlFor="url" className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              id="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
        ) : (
          <div className="mb-4 space-y-2">
            <div>
              <label htmlFor="character" className="block text-sm font-medium text-gray-700">Character Image</label>
              <input
                type="file"
                id="character"
                accept="image/*"
                onChange={(e) => e.target.files && handlePersonalizationImageUpload('character', e.target.files[0])}
                className="mt-1 block w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="object" className="block text-sm font-medium text-gray-700">Object Image</label>
              <input
                type="file"
                id="object"
                accept="image/*"
                onChange={(e) => e.target.files && handlePersonalizationImageUpload('object', e.target.files[0])}
                className="mt-1 block w-full"
                required
              />
            </div>
            <div>
              <label htmlFor="landscape" className="block text-sm font-medium text-gray-700">Landscape Image</label>
              <input
                type="file"
                id="landscape"
                accept="image/*"
                onChange={(e) => e.target.files && handlePersonalizationImageUpload('landscape', e.target.files[0])}
                className="mt-1 block w-full"
                required
              />
            </div>
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors flex items-center justify-center">
          <Plus size={20} className="mr-2" />
          Add Image
        </button>
      </form>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Image List</h2>
        <ul className="space-y-4">
          {images.map((image) => (
            <li key={image.id} className="flex items-center justify-between bg-gray-50 p-4 rounded-md">
              <div className="flex items-center">
                {'url' in image ? (
                  <img src={image.url} alt={image.description} className="w-16 h-16 object-cover rounded-md mr-4" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 rounded-md mr-4 flex items-center justify-center">
                    <span className="text-gray-500">PC</span>
                  </div>
                )}
                <div>
                  <p className="font-semibold">{image.description}</p>
                  <p className="text-sm text-gray-600">{image.tags.join(', ')}</p>
                  <p className="text-sm text-gray-600">Category: {image.category}</p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(image.id)}
                className="text-red-500 hover:text-red-700 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileManagement;