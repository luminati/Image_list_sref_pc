import { Image, PersonalizationCodeImage } from '../types';

const STORAGE_KEY = 'galleryImages';
const MAX_STORAGE_SIZE = 4.5 * 1024 * 1024; // 4.5MB (leaving some buffer)

export const loadImages = (): (Image | PersonalizationCodeImage)[] => {
  const storedImages = localStorage.getItem(STORAGE_KEY);
  return storedImages ? JSON.parse(storedImages) : [];
};

export const saveImage = (newImage: Image | PersonalizationCodeImage): boolean => {
  const images = loadImages();
  images.push(newImage);
  
  try {
    const serializedImages = JSON.stringify(images);
    if (serializedImages.length > MAX_STORAGE_SIZE) {
      throw new Error('Storage quota would be exceeded');
    }
    localStorage.setItem(STORAGE_KEY, serializedImages);
    return true;
  } catch (error) {
    console.error('Failed to save image:', error);
    return false;
  }
};

export const deleteImage = (id: number): void => {
  const images = loadImages();
  const updatedImages = images.filter((img: Image | PersonalizationCodeImage) => img.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedImages));
};

export const getStorageUsage = (): number => {
  const images = loadImages();
  return JSON.stringify(images).length;
};

export const getMaxStorageSize = (): number => {
  return MAX_STORAGE_SIZE;
};