// src/screens/HomeScreen.tsx
import { useEffect, useState } from 'react';
import {
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { FilterChips } from '../components/FilterChips';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { NoteCard } from '../components/NoteCard';
import { useNoteStore } from '../store/useNoteStore';

export const HomeScreen = ({ navigation }: any) => {
  const { notes, filteredNotes, loadNotes, isLoading, filterOptions, setFilterOptions } = useNoteStore();
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const getSmartRecallNotes = () => {
    // Return notes not accessed recently (older than 7 days)
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return notes.filter(note => note.accessedAt < oneWeekAgo).slice(0, 5);
  };

  const smartRecallNotes = getSmartRecallNotes();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.logo}>Keeply</Text>
        <Text style={styles.tagline}>Save it. Find it. Never lose it.</Text>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {smartRecallNotes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>💭 Smart Recall</Text>
            <Text style={styles.sectionSubtitle}>Rediscover forgotten gems</Text>
            {smartRecallNotes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All Notes</Text>
          <FilterChips
            selectedTags={filterOptions.tags}
            onTagSelect={(tag) => {
              const newTags = filterOptions.tags.includes(tag)
                ? filterOptions.tags.filter(t => t !== tag)
                : [...filterOptions.tags, tag];
              setFilterOptions({ tags: newTags });
            }}
          />
        </View>

        {filteredNotes.length === 0 && !isLoading ? (
          <EmptyState
            type="notes"
            onAction={() => navigation.navigate('Add')}
          />
        ) : (
          filteredNotes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))
        )}
      </ScrollView>

      <FloatingActionButton onPress={() => navigation.navigate('Add')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 20,
    paddingTop: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  logo: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  tagline: {
    fontSize: 14,
    color: '#666666',
    marginTop: 4,
  },
  section: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1a',
    marginHorizontal: 16,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#888888',
    marginHorizontal: 16,
    marginBottom: 12,
  },
});