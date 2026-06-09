import React, { useCallback, useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView, Platform,
  ScrollView,
  StyleSheet,
  Text, TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { useNoteStore } from '../store/useNoteStore';
import { NoteImage } from '../types';
import { pasteImageFromClipboard, pickImageFromGallery } from '../utils/imageUtils';

export const AddScreen = ({ navigation, route }: any) => {
  const { addNote, updateNote } = useNoteStore();
  const editingNote = route.params?.note;
  const [title, setTitle] = useState(editingNote?.title || '');
  const [content, setContent] = useState(editingNote?.content || '');
  const [images, setImages] = useState<NoteImage[]>(editingNote?.images || []);
  const [isSaving, setIsSaving] = useState(false);

  const autoSave = useCallback(async () => {
    if ((!title.trim() && !content.trim() && images.length === 0) || isSaving) return;
    setIsSaving(true);
    const noteData = {
      title: title.trim() || 'Untitled',
      content: content.trim(),
      type: editingNote?.type || 'note',
      url: editingNote?.url || '',
      tags: editingNote?.tags || [],
      category: editingNote?.category || '',
      priority: editingNote?.priority || 'medium',
      isVault: editingNote?.isVault || false,
      images: images.map((img, idx) => ({ ...img, order: idx }))
    };
    if (editingNote) {
      await updateNote(editingNote.id, noteData);
    } else {
      await addNote(noteData);
    }
    setIsSaving(false);
    navigation.goBack();
  }, [title, content, images, editingNote]);

  useEffect(() => {
    const timer = setTimeout(() => { if (title || content || images.length) autoSave(); }, 2000);
    return () => clearTimeout(timer);
  }, [title, content, images, autoSave]);

  const handleAddImage = async () => {
    Alert.alert('Add Image', 'Choose source', [
      { text: 'Gallery', onPress: async () => {
        const base64 = await pickImageFromGallery();
        if (base64) addImageItem(base64);
      }},
      { text: 'Paste from Clipboard', onPress: async () => {
        const base64 = await pasteImageFromClipboard();
        if (base64) addImageItem(base64);
      }},
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  const addImageItem = (dataUri: string) => {
    const newImage: NoteImage = {
      id: Date.now().toString(),
      noteId: editingNote?.id || 'temp',
      data: dataUri,
      mime: dataUri.split(';')[0].split(':')[1],
      order: images.length,
      createdAt: Date.now()
    };
    setImages(prev => [...prev, newImage]);
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id).map((img, idx) => ({ ...img, order: idx })));
  };

  const renderImageItem = ({ item, drag, isActive }: any) => (
    <TouchableOpacity
      style={[styles.imageItem, isActive && styles.dragging]}
      onLongPress={drag}
      delayLongPress={200}
    >
      <Image source={{ uri: item.data }} style={styles.imageThumb} />
      <TouchableOpacity style={styles.removeImageBtn} onPress={() => removeImage(item.id)}>
        <Text style={styles.removeText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}><Text style={styles.cancel}>Cancel</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>{editingNote ? 'Edit' : 'New'} Note</Text>
        <TouchableOpacity onPress={autoSave}><Text style={styles.save}>Save</Text></TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll}>
        <TextInput style={styles.titleInput} placeholder="Title" value={title} onChangeText={setTitle} />
        <TextInput style={styles.bodyInput} placeholder="Write your note..." multiline value={content} onChangeText={setContent} />
        {images.length > 0 && (
          <View style={styles.imagesSection}>
            <Text style={styles.sectionLabel}>Images (drag to reorder)</Text>
            <DraggableFlatList
              data={images}
              keyExtractor={(item) => item.id}
              renderItem={renderImageItem}
              onDragEnd={({ data }) => setImages(data.map((img, idx) => ({ ...img, order: idx })))}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.imageList}
            />
          </View>
        )}
        <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
          <Text style={styles.addImageText}>+ Add Image</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#eee' },
  cancel: { fontSize: 16, color: '#999' },
  save: { fontSize: 16, color: '#007aff', fontWeight: '600' },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  scroll: { flex: 1, padding: 20 },
  titleInput: { fontSize: 24, fontWeight: '600', marginBottom: 16 },
  bodyInput: { fontSize: 16, lineHeight: 24, minHeight: 200, textAlignVertical: 'top' },
  imagesSection: { marginTop: 16 },
  sectionLabel: { fontSize: 14, fontWeight: '500', marginBottom: 8, color: '#666' },
  imageList: { paddingVertical: 8 },
  imageItem: { marginRight: 12, position: 'relative' },
  imageThumb: { width: 100, height: 100, borderRadius: 8 },
  removeImageBtn: { position: 'absolute', top: -8, right: -8, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, width: 24, height: 24, alignItems: 'center', justifyContent: 'center' },
  removeText: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  dragging: { opacity: 0.7 },
  addImageButton: { marginTop: 16, paddingVertical: 12, alignItems: 'center', backgroundColor: '#f0f0f0', borderRadius: 8 },
  addImageText: { fontSize: 16, color: '#007aff', fontWeight: '500' }
});