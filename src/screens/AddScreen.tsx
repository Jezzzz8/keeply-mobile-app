import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import DraggableFlatList from 'react-native-draggable-flatlist';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNoteStore } from '../store/useNoteStore';
import { borderRadius, colors, spacing, typography } from '../theme/designTokens';
import { NoteImage } from '../types';
import {
  pasteImageFromClipboard,
  pickImageFromGallery,
  takePhotoWithCamera,
} from '../utils/imageUtils';

export const AddScreen = ({ navigation, route }: any) => {
  const insets = useSafeAreaInsets();
  const { addNote, updateNote } = useNoteStore();
  const editingNote = route.params?.note;
  const [title, setTitle] = useState(editingNote?.title || '');
  const [content, setContent] = useState(editingNote?.content || '');
  const [images, setImages] = useState<NoteImage[]>(editingNote?.images || []);
  const [isSaving, setIsSaving] = useState(false);
  const richTextRef = useRef<RichEditor>(null);
  const autoSaveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const performSave = useCallback(async () => {
    if ((!title.trim() && !content.trim() && images.length === 0) || isSaving) return;
    setIsSaving(true);
    const imagesForSave: Omit<NoteImage, 'id' | 'createdAt' | 'noteId'>[] = images.map((img, idx) => ({
      uri: img.uri,
      mime: img.mime,
      filename: img.filename,
      order: idx,
    }));
    const noteData = {
      title: title.trim() || 'Untitled',
      content: content.trim(),
      type: editingNote?.type || 'note',
      url: editingNote?.url || '',
      tags: editingNote?.tags || [],
      category: editingNote?.category || '',
      priority: editingNote?.priority || 'medium',
      isVault: editingNote?.isVault || false,
      images: imagesForSave,
    };
    if (editingNote) {
      await updateNote(editingNote.id, noteData);
    } else {
      await addNote(noteData);
    }
    setIsSaving(false);
    navigation.goBack();
  }, [title, content, images, editingNote, addNote, updateNote, navigation]);

  useEffect(() => {
    if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(() => {
      if (title || content || images.length) performSave();
    }, 1000);
    return () => {
      if (autoSaveTimeout.current) clearTimeout(autoSaveTimeout.current);
    };
  }, [title, content, images, performSave]);

  const handleAddImage = async () => {
    Alert.alert('Add Image', 'Choose source', [
      {
        text: 'Gallery',
        onPress: async () => {
          const uri = await pickImageFromGallery();
          if (uri) addImageItem(uri);
        },
      },
      {
        text: 'Camera',
        onPress: async () => {
          const uri = await takePhotoWithCamera();
          if (uri) addImageItem(uri);
        },
      },
      {
        text: 'Paste from Clipboard',
        onPress: async () => {
          const uri = await pasteImageFromClipboard();
          if (uri) addImageItem(uri);
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const addImageItem = (uri: string) => {
    const newImage: NoteImage = {
      id: Date.now().toString(),
      noteId: editingNote?.id || 'temp',
      uri,
      mime: 'image/jpeg',
      order: images.length,
      createdAt: Date.now(),
    };
    setImages((prev) => [...prev, newImage]);
  };

  const removeImage = (id: string) => {
    setImages((prev) =>
      prev.filter((img) => img.id !== id).map((img, idx) => ({ ...img, order: idx }))
    );
  };

  const renderImageItem = ({ item, drag, isActive }: any) => (
    <TouchableOpacity
      style={[
        { marginRight: spacing[3], position: 'relative' },
        isActive && { opacity: 0.7 },
      ]}
      onLongPress={drag}
      delayLongPress={200}
    >
      <Image source={{ uri: item.uri }} style={{ width: 96, height: 96, borderRadius: borderRadius.md }} />
      <TouchableOpacity
        style={{
          position: 'absolute',
          top: -8,
          right: -8,
          backgroundColor: 'rgba(0,0,0,0.6)',
          borderRadius: 24,
          width: 24,
          height: 24,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => removeImage(item.id)}
      >
        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.surface }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: spacing[5],
          paddingTop: insets.top + spacing[4],
          paddingBottom: spacing[4],
          borderBottomWidth: 1,
          borderColor: colors.border,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 16, color: colors.textLight }}>Cancel</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>
          {editingNote ? 'Edit' : 'New'} Note
        </Text>
        <TouchableOpacity onPress={performSave}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: colors.primary }}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: spacing[4] }} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        <TextInput
          style={[typography.heading2, { color: colors.text, marginBottom: spacing[4] }]}
          placeholder="Title"
          placeholderTextColor={colors.textLight}
          value={title}
          onChangeText={setTitle}
        />
        <RichToolbar
          editor={richTextRef}
          actions={['bold', 'italic', 'underline', 'unorderedList', 'orderedList', 'checklist', 'heading1', 'alignLeft', 'removeFormat']}
          iconMap={{
            heading1: ({ tintColor }: { tintColor: string }) => (
              <Text style={{ color: tintColor, fontFamily: 'System' }}>H1</Text>
            ),
          }}
          style={{ backgroundColor: colors.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, marginVertical: spacing[2] }}
          selectedIconTint={colors.primary}
          unselectedIconTint={colors.textLight}
        />
        <RichEditor
          ref={richTextRef}
          initialContentHTML={content}
          onChange={(text) => setContent(text)}
          editorStyle={{
            backgroundColor: colors.surface,
            color: colors.text,
            placeholderColor: colors.textLight,
            contentCSSText: `font-family: System; font-size: 16px;`,
          }}
          placeholder="Write your note..."
        />

        {images.length > 0 && (
          <View style={{ marginTop: spacing[4] }}>
            <Text style={{ fontSize: 12, fontWeight: '500', color: colors.textLight, marginBottom: spacing[2] }}>
              Images (drag to reorder)
            </Text>
            <DraggableFlatList
              data={images}
              keyExtractor={(item) => item.id}
              renderItem={renderImageItem}
              onDragEnd={({ data }) => setImages(data.map((img, idx) => ({ ...img, order: idx })))}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: spacing[2] }}
            />
          </View>
        )}

        <TouchableOpacity
          style={{ marginTop: spacing[4], paddingVertical: spacing[3], alignItems: 'center', backgroundColor: colors.border, borderRadius: borderRadius.md }}
          onPress={handleAddImage}
        >
          <Text style={{ fontSize: 16, color: colors.primary, fontWeight: '500' }}>+ Add Image</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};