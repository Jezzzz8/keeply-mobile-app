import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNoteStore } from '../store/useNoteStore';
import { colors, spacing, typography } from '../theme/designTokens';

export const NoteDetailScreen = ({ route, navigation }: any) => {
  const insets = useSafeAreaInsets();
  const { noteId } = route.params;
  const { notes, updateNote, deleteNote } = useNoteStore();
  const note = notes.find(n => n.id === noteId);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const richTextRef = useRef<RichEditor>(null);

  useEffect(() => {
    if (!note) navigation.goBack();
  }, [note]);

  const handleSave = async () => {
    if (note) await updateNote(noteId, { title, content });
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteNote(noteId); navigation.goBack(); } }
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: spacing[4],
          paddingTop: insets.top + spacing[4],
          paddingBottom: spacing[4],
          borderBottomWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.surface,
        }}
      >
        <TouchableOpacity onPress={handleSave}>
          <Text style={{ color: colors.primary, fontSize: 16, fontWeight: '600' }}>Done</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text }}>Edit Note</Text>
        <TouchableOpacity onPress={handleDelete}>
          <Text style={{ color: colors.error, fontSize: 16, fontWeight: '600' }}>Delete</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, padding: spacing[4] }}>
        <TextInput
          style={[typography.heading2, { color: colors.text, marginBottom: spacing[4] }]}
          placeholder="Title"
          placeholderTextColor={colors.textLight}
          value={title}
          onChangeText={setTitle}
        />
        <RichToolbar
          editor={richTextRef}
          actions={['bold', 'italic', 'underline', 'unorderedList', 'orderedList']}
          style={{ backgroundColor: colors.surface, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border, marginVertical: spacing[2] }}
        />
        <RichEditor
          ref={richTextRef}
          initialContentHTML={content}
          onChange={setContent}
          editorStyle={{ backgroundColor: colors.surface, color: colors.text }}
          placeholder="Write your note..."
        />
      </ScrollView>
    </View>
  );
};