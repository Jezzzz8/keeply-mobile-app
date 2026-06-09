import React, { useEffect } from 'react';
import { FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useNoteStore } from '../store/useNoteStore';
import { Note } from '../types';

export const LinksScreen = () => {
  const { notes, loadNotes } = useNoteStore();
  const links = notes.filter(n => n.type === 'link');

  useEffect(() => { loadNotes(); }, []);

  const openLink = (url: string) => { Linking.openURL(url); };

  const renderLinkCard = ({ item }: { item: Note }) => {
    const previewImage = item.images?.find(img => img.id === item.previewImageId);
    return (
      <TouchableOpacity style={styles.card} onPress={() => openLink(item.url!)}>
        {previewImage && <Image source={{ uri: previewImage.data }} style={styles.previewImage} />}
        <View style={styles.cardContent}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          {item.domain && <Text style={styles.domain}>{item.domain}</Text>}
          {item.description && <Text style={styles.description} numberOfLines={2}>{item.description}</Text>}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Saved Links</Text>
      {links.length === 0 ? (
        <Text style={styles.empty}>No links saved yet. Share or copy links to Keeply.</Text>
      ) : (
        <FlatList data={links} keyExtractor={item => item.id} renderItem={renderLinkCard} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa', paddingTop: 60 },
  header: { fontSize: 28, fontWeight: '700', paddingHorizontal: 20, paddingBottom: 12 },
  card: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 16, marginVertical: 8, borderRadius: 12, overflow: 'hidden', shadowColor: '#000', shadowOpacity: 0.05, elevation: 2 },
  previewImage: { width: 80, height: 80 },
  cardContent: { flex: 1, padding: 12 },
  title: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  domain: { fontSize: 12, color: '#666', marginBottom: 4 },
  description: { fontSize: 13, color: '#333' },
  empty: { textAlign: 'center', marginTop: 60, color: '#999' }
});