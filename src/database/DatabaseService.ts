// src/database/DatabaseService.ts
import * as SQLite from 'expo-sqlite';
import { Note, NoteImage } from '../types';

type NoteRow = Omit<Note, 'tags' | 'isVault' | 'images'> & {
  tags: string;
  isVault: number;
};

const db = SQLite.openDatabaseSync('keeply.db');

export class DatabaseService {
  static async init(): Promise<void> {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS notes (
        id TEXT PRIMARY KEY,
        title TEXT,
        content TEXT,
        type TEXT,
        url TEXT,
        domain TEXT,
        description TEXT,
        previewImageId TEXT,
        tags TEXT,
        category TEXT,
        priority TEXT,
        isVault INTEGER,
        createdAt INTEGER,
        updatedAt INTEGER,
        accessedAt INTEGER
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS note_images (
        id TEXT PRIMARY KEY,
        noteId TEXT,
        data TEXT,
        mime TEXT,
        filename TEXT,
        "order" INTEGER,
        createdAt INTEGER,
        FOREIGN KEY (noteId) REFERENCES notes(id) ON DELETE CASCADE
      );
    `);

    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_notes_type ON notes(type);`);
    await db.execAsync(`CREATE INDEX IF NOT EXISTS idx_images_note ON note_images(noteId);`);
  }

  static async insertNote(note: Note, images?: Omit<NoteImage, 'id' | 'createdAt'>[]): Promise<void> {
    await db.runAsync(
      `INSERT INTO notes (id, title, content, type, url, domain, description, previewImageId, tags, category, priority, isVault, createdAt, updatedAt, accessedAt)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        note.id,
        note.title,
        note.content,
        note.type,
        note.url || null,
        note.domain || null,
        note.description || null,
        note.previewImageId || null,
        JSON.stringify(note.tags),
        note.category,
        note.priority,
        note.isVault ? 1 : 0,
        note.createdAt,
        note.updatedAt,
        note.accessedAt,
      ]
    );

    if (images && images.length) {
      for (const img of images) {
        const imageId = `${img.noteId}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        await db.runAsync(
          `INSERT INTO note_images (id, noteId, data, mime, filename, "order", createdAt)
           VALUES (?,?,?,?,?,?,?)`,
          [imageId, img.noteId, img.data, img.mime, img.filename || null, img.order, Date.now()]
        );
      }
    }
  }

  static async updateNote(note: Note): Promise<void> {
    await db.runAsync(
      `UPDATE notes SET title=?, content=?, tags=?, category=?, priority=?, updatedAt=?, accessedAt=?, description=?, previewImageId=?
       WHERE id=?`,
      [
        note.title,
        note.content,
        JSON.stringify(note.tags),
        note.category,
        note.priority,
        note.updatedAt,
        note.accessedAt,
        note.description || null,
        note.previewImageId || null,
        note.id,
      ]
    );
  }

  static async deleteNote(id: string): Promise<void> {
    await db.runAsync(`DELETE FROM notes WHERE id=?`, [id]);
  }

  static async getAllNotes(): Promise<Note[]> {
    const rows = await db.getAllAsync<NoteRow>(`SELECT * FROM notes ORDER BY updatedAt DESC`);
    const notes: Note[] = rows.map((row: NoteRow) => ({
      ...row,
      tags: JSON.parse(row.tags),
      isVault: row.isVault === 1,
      images: []
    }));
    for (const note of notes) {
      note.images = await this.getImagesForNote(note.id);
    }
    return notes;
  }

  static async searchNotes(query: string): Promise<Note[]> {
    const rows = await db.getAllAsync<NoteRow>(
      `SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? OR tags LIKE ? ORDER BY updatedAt DESC`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    const notes: Note[] = rows.map((row: NoteRow) => ({
      ...row,
      tags: JSON.parse(row.tags),
      isVault: row.isVault === 1,
      images: []
    }));
    for (const note of notes) {
      note.images = await this.getImagesForNote(note.id);
    }
    return notes;
  }

  static getImagesForNote(noteId: string): Promise<NoteImage[]> {
    return db.getAllAsync<NoteImage>(
      `SELECT * FROM note_images WHERE noteId = ? ORDER BY "order" ASC`,
      [noteId]
    );
  }

  static async addImageToNote(image: Omit<NoteImage, 'createdAt'>): Promise<void> {
    await db.runAsync(
      `INSERT INTO note_images (id, noteId, data, mime, filename, "order", createdAt)
       VALUES (?,?,?,?,?,?,?)`,
      [image.id, image.noteId, image.data, image.mime, image.filename || null, image.order, Date.now()]
    );
  }

  static async deleteImage(imageId: string): Promise<void> {
    await db.runAsync(`DELETE FROM note_images WHERE id=?`, [imageId]);
  }

  static async getVaultNotes(): Promise<Note[]> {
    const rows = await db.getAllAsync<NoteRow>(`SELECT * FROM notes WHERE isVault = 1 ORDER BY updatedAt DESC`);
    return rows.map((row: NoteRow) => ({
      ...row,
      tags: JSON.parse(row.tags),
      isVault: true,
      images: [],
    }));
  }

  static async getNotesByTag(tag: string): Promise<Note[]> {
    const rows = await db.getAllAsync<NoteRow>(
      `SELECT * FROM notes WHERE tags LIKE ? ORDER BY updatedAt DESC`,
      [`%"${tag}"%`]
    );
    return rows.map((row: NoteRow) => ({
      ...row,
      tags: JSON.parse(row.tags),
      isVault: row.isVault === 1,
      images: [],
    }));
  }

  static async updateAccessTime(id: string): Promise<void> {
    await db.runAsync(`UPDATE notes SET accessedAt = ? WHERE id = ?`, [Date.now(), id]);
  }
}