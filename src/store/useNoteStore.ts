// src/store/useNoteStore.ts
import { create } from 'zustand';
import { DatabaseService } from '../database/DatabaseService';
import { AIService } from '../services/AIService';
import { FilterOptions, Note } from '../types';

interface NoteStore {
  notes: Note[];
  filteredNotes: Note[];
  isLoading: boolean;
  filterOptions: FilterOptions;
  
  loadNotes: () => Promise<void>;
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt' | 'accessedAt'>) => Promise<string>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
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

  loadNotes: async () => {
    set({ isLoading: true });
    const notes = await DatabaseService.getAllNotes();
    set({ notes, isLoading: false });
    get().applyFilters();
  },

  addNote: async (noteData) => {
    const id = Date.now().toString();
    const now = Date.now();
    
    // Run AI analysis in background
    const { tags, category, priority } = await AIService.analyzeContent(
      noteData.content + ' ' + noteData.title, 
      noteData.type
    );
    
    const newNote: Note = {
      id,
      ...noteData,
      tags: noteData.tags || tags,
      category: noteData.category || category,
      priority: noteData.priority || priority,
      createdAt: now,
      updatedAt: now,
      accessedAt: now
    };
    
    await DatabaseService.insertNote(newNote);
    const notes = await DatabaseService.getAllNotes();
    set({ notes });
    get().applyFilters();
    return id;
  },

  updateNote: async (id, updates) => {
    const { notes } = get();
    const note = notes.find(n => n.id === id);
    if (!note) return;
    
    const updatedNote = { ...note, ...updates, updatedAt: Date.now() };
    await DatabaseService.updateNote(updatedNote);
    const updatedNotes = await DatabaseService.getAllNotes();
    set({ notes: updatedNotes });
    get().applyFilters();
  },

  deleteNote: async (id) => {
    await DatabaseService.deleteNote(id);
    const notes = await DatabaseService.getAllNotes();
    set({ notes });
    get().applyFilters();
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
    
    if (filterOptions.tags.length > 0) {
      filtered = filtered.filter(note => 
        filterOptions.tags.some(tag => note.tags.includes(tag))
      );
    }
    
    if (filterOptions.categories.length > 0) {
      filtered = filtered.filter(note => 
        filterOptions.categories.includes(note.category)
      );
    }
    
    if (filterOptions.types.length > 0) {
      filtered = filtered.filter(note => 
        filterOptions.types.includes(note.type)
      );
    }
    
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      filtered = filtered.filter(note =>
        note.title.toLowerCase().includes(query) ||
        note.content.toLowerCase().includes(query) ||
        note.tags.some(tag => tag.toLowerCase().includes(query))
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