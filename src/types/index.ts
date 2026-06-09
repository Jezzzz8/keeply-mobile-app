export interface NoteImage {
  id: string;
  noteId: string;
  uri: string;          // file URI (not Base64)
  mime: string;
  filename?: string;
  order: number;
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'note' | 'link' | 'idea' | 'clipboard' | 'quick';
  url?: string;
  domain?: string;
  description?: string;
  previewImageUri?: string;
  tags: string[];
  category: string;
  priority: 'low' | 'medium' | 'high';
  isVault: boolean;
  createdAt: number;
  updatedAt: number;
  accessedAt: number;
  images?: NoteImage[];
  favorite?: boolean;
  thumbnail?: string;
}

export interface FilterOptions {
  tags: string[];
  categories: string[];
  types: string[];
  searchQuery?: string;
}