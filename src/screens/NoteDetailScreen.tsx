import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNoteStore } from '../store/useNoteStore';

export const NoteDetailScreen = ({ route, navigation }: any) => {
  const { noteId } = route.params;
  const { notes, updateNote, deleteNote } = useNoteStore();
  const note = notes.find(n => n.id === noteId);
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  useEffect(() => {
    if (!note) navigation.goBack();
  }, [note]);

  const handleSave = () => {
    if (note) updateNote(noteId, { title, content });
    navigation.goBack();
  };

  const handleDelete = () => {
    Alert.alert('Delete Note', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await deleteNote(noteId); navigation.goBack(); } }
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSave}><Text style={styles.done}>Done</Text></TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Note</Text>
        <TouchableOpacity onPress={handleDelete}><Text style={styles.delete}>Delete</Text></TouchableOpacity>
      </View>
      <ScrollView style={styles.content}>
        <TextInput style={styles.titleInput} placeholder="Title" value={title} onChangeText={setTitle} />
        <TextInput style={styles.bodyInput} placeholder="Content" value={content} onChangeText={setContent} multiline />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, borderBottomWidth: 1, borderBottomColor: '#eee', paddingTop: 60 },
  done: { color: '#007aff', fontSize: 17 },
  delete: { color: '#ff3b30', fontSize: 17 },
  headerTitle: { fontSize: 17, fontWeight: '600' },
  content: { padding: 20 },
  titleInput: { fontSize: 24, fontWeight: '600', marginBottom: 20 },
  bodyInput: { fontSize: 16, lineHeight: 24, minHeight: 300, textAlignVertical: 'top' },
});