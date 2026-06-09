export interface NoteImage {
  id: string;
  noteId: string;
  data: string;        // base64
  mime: string;        // e.g. 'image/jpeg'
  filename?: string;
  order: number;       // display order within the note
  createdAt: number;
}

export interface Note {
  id: string;
  title: string;
  content: string;          // plain text (no images in here)
  type: 'note' | 'link' | 'idea' | 'clipboard' | 'quick';
  url?: string;             // for links
  domain?: string;
  description?: string;     // extracted from page or user supplied
  previewImageId?: string;  // ID of the cached preview image (if any)
  tags: string[];
  category: string;
  priority: 'low' | 'medium' | 'high';
  isVault: boolean;
  createdAt: number;
  updatedAt: number;
  accessedAt: number;
  images?: NoteImage[];     // filled at query time
}

export interface FilterOptions {
  tags: string[];
  categories: string[];
  types: string[];
  searchQuery?: string;
}