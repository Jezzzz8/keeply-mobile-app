import * as FileSystem from 'expo-file-system';
import * as SQLite from 'expo-sqlite';
import { Note, NoteImage } from '../types';

const db = SQLite.openDatabaseSync('keeply.db');

export class DatabaseService {
  static async init(): Promise<void> {
    // Create tables and indexes
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT,
        content TEXT,
        type TEXT,
        url TEXT,
        domain TEXT,
        description TEXT,
        previewImageUri TEXT,
        tags TEXT,
        category TEXT,
        priority TEXT,
        isVault INTEGER,
        createdAt INTEGER,
        updatedAt INTEGER,
        accessedAt INTEGER
      );
      CREATE TABLE IF NOT EXISTS note_images (
        id TEXT PRIMARY KEY,
        noteId TEXT,
        uri TEXT,
        mime TEXT,
        filename TEXT,
        "order" INTEGER,
        createdAt INTEGER,
        FOREIGN KEY (noteId) REFERENCES notes(id) ON DELETE CASCADE
      );
      CREATE INDEX IF NOT EXISTS idx_notes_updated ON notes(updatedAt);
      CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(type);
      CREATE INDEX IF NOT EXISTS idx_notes_vault ON notes(isVault);
      CREATE INDEX IF NOT EXISTS idx_images_note ON note_images(noteId);
    `);

    // Add new columns one by one, ignoring errors if they already exist
    try {
      await db.execAsync(`ALTER TABLE notes ADD COLUMN favorite INTEGER DEFAULT 0;`);
    } catch (e) {
      // Column already exists – ignore
    }
    try {
      await db.execAsync(`ALTER TABLE notes ADD COLUMN thumbnail TEXT;`);
    } catch (e) {
      // Column already exists – ignore
    }
  }

  static async insertNote(note: Note, images?: Omit<NoteImage, 'id' | 'createdAt'>[]): Promise<void> {
    await db.runAsync(
      `INSERT INTO notes (id, title, content, type, url, domain, description, previewImageUri, tags, category, priority, isVault, createdAt, updatedAt, accessedAt)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        note.id, note.title, note.content, note.type, note.url || null,
        note.domain || null, note.description || null, note.previewImageUri || null,
        JSON.stringify(note.tags), note.category, note.priority,
        note.isVault ? 1 : 0, note.createdAt, note.updatedAt, note.accessedAt
      ]
    );
    if (images?.length) {
      for (const img of images) {
        const imageId = `${img.noteId}_${Date.now()}_${Math.random().toString(36).slice(2)}`;
        await db.runAsync(
          `INSERT INTO note_images (id, noteId, uri, mime, filename, "order", createdAt)
           VALUES (?,?,?,?,?,?,?)`,
          [imageId, img.noteId, img.uri, img.mime, img.filename || null, img.order, Date.now()]
        );
      }
    }
  }

  static async updateNote(note: Note): Promise<void> {
    await db.runAsync(
      `UPDATE notes SET title=?, content=?, tags=?, category=?, priority=?, updatedAt=?, accessedAt=?, description=?, previewImageUri=?
       WHERE id=?`,
      [note.title, note.content, JSON.stringify(note.tags), note.category, note.priority,
       note.updatedAt, note.accessedAt, note.description || null, note.previewImageUri || null, note.id]
    );
  }

  static async deleteNote(id: string): Promise<void> {
    await db.runAsync(`DELETE FROM notes WHERE id=?`, [id]);
  }

  static async getAllNotes(): Promise<Note[]> {
    const rows = await db.getAllAsync<any>(`SELECT * FROM notes ORDER BY updatedAt DESC`);
    const notes = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags),
      isVault: row.isVault === 1,
      images: []
    }));
    // batch load images
    const noteIds = notes.map(n => n.id);
    if (noteIds.length) {
      const images = await db.getAllAsync<NoteImage>(
        `SELECT * FROM note_images WHERE noteId IN (${noteIds.map(() => '?').join(',')}) ORDER BY "order" ASC`,
        noteIds
      );
      for (const note of notes) {
        note.images = images.filter(img => img.noteId === note.id);
      }
    }
    return notes;
  }

  static async searchNotes(query: string): Promise<Note[]> {
    const rows = await db.getAllAsync<any>(
      `SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? OR tags LIKE ? ORDER BY updatedAt DESC`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    const notes = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags),
      isVault: row.isVault === 1,
      images: []
    }));
    // batch load images for search results
    const noteIds = notes.map(n => n.id);
    if (noteIds.length) {
      const images = await db.getAllAsync<NoteImage>(
        `SELECT * FROM note_images WHERE noteId IN (${noteIds.map(() => '?').join(',')}) ORDER BY "order" ASC`,
        noteIds
      );
      for (const note of notes) {
        note.images = images.filter(img => img.noteId === note.id);
      }
    }
    return notes;
  }

  static async addImageToNote(image: Omit<NoteImage, 'createdAt'>): Promise<void> {
    await db.runAsync(
      `INSERT INTO note_images (id, noteId, uri, mime, filename, "order", createdAt)
       VALUES (?,?,?,?,?,?,?)`,
      [image.id, image.noteId, image.uri, image.mime, image.filename || null, image.order, Date.now()]
    );
  }

  static async deleteImage(imageId: string): Promise<void> {
    const img = await db.getFirstAsync<NoteImage>(`SELECT uri FROM note_images WHERE id=?`, [imageId]);
    if (img?.uri) {
      try {
        await FileSystem.deleteAsync(img.uri);
      } catch (e) {}
    }
    await db.runAsync(`DELETE FROM note_images WHERE id=?`, [imageId]);
  }

  static async getVaultNotes(): Promise<Note[]> {
    const rows = await db.getAllAsync<any>(`SELECT * FROM notes WHERE isVault = 1 ORDER BY updatedAt DESC`);
    const notes = rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags),
      isVault: true,
      images: []
    }));
    const noteIds = notes.map(n => n.id);
    if (noteIds.length) {
      const images = await db.getAllAsync<NoteImage>(
        `SELECT * FROM note_images WHERE noteId IN (${noteIds.map(() => '?').join(',')}) ORDER BY "order" ASC`,
        noteIds
      );
      for (const note of notes) {
        note.images = images.filter(img => img.noteId === note.id);
      }
    }
    return notes;
  }

  static async getNotesByTag(tag: string): Promise<Note[]> {
    const rows = await db.getAllAsync<any>(
      `SELECT * FROM notes WHERE tags LIKE ? ORDER BY updatedAt DESC`,
      [`%"${tag}"%`]
    );
    return rows.map(row => ({
      ...row,
      tags: JSON.parse(row.tags),
      isVault: row.isVault === 1,
      images: []
    }));
  }

  static async updateAccessTime(id: string): Promise<void> {
    await db.runAsync(`UPDATE notes SET accessedAt = ? WHERE id = ?`, [Date.now(), id]);
  }
}