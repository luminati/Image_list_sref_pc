import React, { useState, useEffect } from 'react';
import { loadImages, saveImage, deleteImage } from '../utils/imageUtils';
import { Image } from '../types';
import { Plus, Trash2 } from 'lucide-react';

const ImageManagement: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [url, setUrl] = useState('');
  const [tags, setTags] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('general');

  useEffect(() => {
    setImages(loadImages());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newImage: Image = {
      id: Date.now(),
      url,
      tags: tags.split(',').map(tag => tag.trim()),
      description,
      category,
      relatedImages: []
    };
    saveImage(newImage);
    setImages(loadImages());
    setUrl('');
    setTags('');
    setDescription('');
    setCategory('general');
  };

  const handleDelete = (id: number) => {
    deleteImage(id);
    setImages(loadImages());
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Image Management</h1>
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>
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
                <img src={image.url} alt={image.description} className="w-16 h-16 object-cover rounded-md mr-4" />
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

export default ImageManagement;