// src/screens/SearchScreen.tsx
import { useState } from 'react';
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { NoteCard } from '../components/NoteCard';
import { useNoteStore } from '../store/useNoteStore';

export const SearchScreen = () => {
  const [query, setQuery] = useState('');
  const { notes, filteredNotes, searchNotes, setFilterOptions, filterOptions } = useNoteStore();
  
  const handleSearch = (text: string) => {
    setQuery(text);
    setFilterOptions({ searchQuery: text });
    searchNotes(text);
  };

  const filterByType = (type: string) => {
    const currentTypes = filterOptions.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter(t => t !== type)
      : [...currentTypes, type];
    setFilterOptions({ types: newTypes });
  };

  const clearFilters = () => {
    setFilterOptions({ types: [], tags: [], categories: [] });
    setQuery('');
    searchNotes('');
  };

  const typeFilters = ['note', 'link', 'idea', 'clipboard', 'quick'];

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search titles, content, or tags..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Text style={styles.clearText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {typeFilters.map(type => (
          <TouchableOpacity
            key={type}
            style={[
              styles.filterChip,
              filterOptions.types?.includes(type) && styles.filterChipActive
            ]}
            onPress={() => filterByType(type)}
          >
            <Text style={[
              styles.filterText,
              filterOptions.types?.includes(type) && styles.filterTextActive
            ]}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
        {(filterOptions.types?.length > 0 || query.length > 0) && (
          <TouchableOpacity style={styles.clearAllButton} onPress={clearFilters}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} />}
        ListEmptyComponent={
          query.length > 0 || filterOptions.types?.length > 0 ? (
            <EmptyState type="search" />
          ) : (
            <EmptyState type="search" />
          )
        }
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1a1a1a',
  },
  clearText: {
    fontSize: 14,
    color: '#007aff',
  },
  filterRow: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  filterChipActive: {
    backgroundColor: '#007aff',
    borderColor: '#007aff',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    justifyContent: 'center',
  },
  clearAllText: {
    fontSize: 14,
    color: '#007aff',
  },
  list: {
    paddingVertical: 8,
  },
});