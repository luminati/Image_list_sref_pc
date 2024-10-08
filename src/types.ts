export interface Image {
  id: number;
  url: string;
  tags: string[];
  description: string;
  relatedImages: number[];
  category: 'general' | 'specialSet' | 'personalizationCode';
}

export interface PersonalizationCodeImage {
  id: number;
  character: string;
  object: string;
  landscape: string;
  tags: string[];
  description: string;
  relatedImages: number[];
  category: 'personalizationCode';
}

export interface Database {
  images: (Image | PersonalizationCodeImage)[];
}