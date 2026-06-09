// src/store/useNoteStore.ts (excerpt – add these methods)
import { create } from 'zustand';
import { DatabaseService } from '../database/DatabaseService';
import { AIService } from '../services/AIService';
import { FilterOptions, Note, NoteImage } from '../types';

type NoteImageCreateData = Omit<NoteImage, 'id' | 'createdAt' | 'noteId'>;

type NoteData = Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'accessedAt' | 'images'> & {
  images?: NoteImageCreateData[];
};

interface NoteStore {
  notes: Note[];
  filteredNotes: Note[];
  isLoading: boolean;
  filterOptions: FilterOptions;
  links: Note[];
  vaultNotes: Note[];
  loadLinks: () => Promise<void>;
  loadVaultNotes: () => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  loadNotes: () => Promise<void>;
  addNote: (noteData: NoteData) => Promise<string>;
  updateNote: (id: string, updates: Partial<NoteData>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  searchNotes: (query: string) => Promise<void>;
  applyFilters: () => void;
  setFilterOptions: (options: Partial<FilterOptions>) => void;
}

export const useNoteStore = create<NoteStore>((set, get) => ({
  notes: [],
  filteredNotes: [],
  isLoading: false,
  filterOptions: { tags: [], categories: [], types: [] },
  links: [],
  vaultNotes: [],

  loadLinks: async () => {
    const allNotes = await DatabaseService.getAllNotes();
    const links = allNotes.filter(n => n.type === 'link' && n.url);
    set({ links });
  },

  loadVaultNotes: async () => {
    const vault = await DatabaseService.getVaultNotes(); // already exists
    set({ vaultNotes: vault });
  },

  toggleFavorite: async (id) => {
    const { notes } = get();
    const note = notes.find(n => n.id === id);
    if (note) {
      const updated = { ...note, favorite: !note.favorite };
      await DatabaseService.updateNote(updated);
      await get().loadNotes(); // refresh all notes
      await get().loadLinks();  // refresh links if needed
    }
  },

  loadNotes: async () => {
    set({ isLoading: true });
    const notes = await DatabaseService.getAllNotes();
    set({ notes, isLoading: false });
    get().applyFilters();
  },

  addNote: async (noteData) => {
    const id = Date.now().toString();
    const now = Date.now();
    const { tags, category, priority } = await AIService.analyzeContent(
      (noteData.content || '') + ' ' + (noteData.title || ''),
      noteData.type
    );
    const newNote: Note = {
      id,
      title: noteData.title || 'Untitled',
      content: noteData.content || '',
      type: noteData.type,
      url: noteData.url,
      domain: noteData.domain,
      description: noteData.description,
      previewImageUri: noteData.previewImageUri,
      tags: noteData.tags || tags,
      category: noteData.category || category || '',
      priority: noteData.priority || priority || 'medium',
      isVault: noteData.isVault ?? false,
      favorite: noteData.favorite ?? false,
      thumbnail: noteData.thumbnail,
      createdAt: now,
      updatedAt: now,
      accessedAt: now,
      images: []
    };
    const imagesToInsert = noteData.images?.map((img, idx) => ({
      noteId: id,
      uri: img.uri,
      mime: img.mime,
      filename: img.filename,
      order: idx
    })) || [];
    await DatabaseService.insertNote(newNote, imagesToInsert);
    await get().loadNotes();
    return id;
  },

  updateNote: async (id, updates) => {
    const { notes } = get();
    const oldNote = notes.find(n => n.id === id);
    if (!oldNote) return;
    const { images, ...noteUpdates } = updates;
    const updatedNote: Note = {
      ...oldNote,
      ...noteUpdates,
      updatedAt: Date.now(),
      accessedAt: Date.now(),
    };
    await DatabaseService.updateNote(updatedNote);
    // TODO: handle image updates (add/remove) – for brevity, we reload all
    await get().loadNotes();
  },

  deleteNote: async (id) => {
    await DatabaseService.deleteNote(id);
    await get().loadNotes();
  },

  searchNotes: async (query) => {
    if (!query.trim()) {
      get().loadNotes();
      return;
    }
    set({ isLoading: true });
    const results = await DatabaseService.searchNotes(query);
    set({ filteredNotes: results, isLoading: false });
  },

  applyFilters: () => {
    const { notes, filterOptions } = get();
    let filtered = [...notes];
    if (filterOptions.tags.length) {
      filtered = filtered.filter(n => filterOptions.tags.some(tag => n.tags.includes(tag)));
    }
    if (filterOptions.categories.length) {
      filtered = filtered.filter(n => filterOptions.categories.includes(n.category));
    }
    if (filterOptions.types.length) {
      filtered = filtered.filter(n => filterOptions.types.includes(n.type));
    }
    if (filterOptions.searchQuery) {
      const q = filterOptions.searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    set({ filteredNotes: filtered });
  },

  setFilterOptions: (options) => {
    set(state => ({
      filterOptions: { ...state.filterOptions, ...options }
    }));
    get().applyFilters();
  }
}));