import { Feather as Icon } from '@expo/vector-icons';
import { useState } from 'react';
import { FlatList, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { EmptyState } from '../components/EmptyState';
import { NoteCard } from '../components/NoteCard';
import { useNoteStore } from '../store/useNoteStore';
import { borderRadius, colors, spacing } from '../theme/designTokens';

export const SearchScreen = () => {
  const insets = useSafeAreaInsets();
  const [query, setQuery] = useState('');
  const { filteredNotes, searchNotes, setFilterOptions, filterOptions } = useNoteStore();

  const handleSearch = (text: string) => {
    setQuery(text);
    setFilterOptions({ searchQuery: text });
    searchNotes(text);
  };

  const filterByType = (type: string) => {
    const currentTypes = filterOptions.types || [];
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
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
    <View style={{ flex: 1, backgroundColor: colors.background, paddingTop: insets.top }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: colors.surface,
          paddingHorizontal: spacing[4],
          paddingVertical: spacing[3],
          marginHorizontal: spacing[4],
          marginTop: spacing[4],
          marginBottom: spacing[3],
          borderRadius: borderRadius.md,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 2,
          elevation: 1,
        }}
      >
        <Icon name={"search" as any} size={20} color={colors.textLight} style={{ marginRight: spacing[2] }} />
        <TextInput
          style={{ flex: 1, fontSize: 16, color: colors.text }}
          placeholder="Search titles, content, or tags..."
          placeholderTextColor="#666"
          value={query}
          onChangeText={handleSearch}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.primary }}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: spacing[4], marginBottom: spacing[3] }}>
        {typeFilters.map((type) => {
          const active = filterOptions.types?.includes(type);
          return (
            <TouchableOpacity
              key={type}
              style={{
                paddingHorizontal: spacing[4],
                paddingVertical: spacing[2],
                borderRadius: borderRadius.full,
                marginRight: spacing[2],
                borderWidth: 1,
                borderColor: active ? colors.primary : colors.border,
                backgroundColor: active ? colors.primary : colors.surface,
              }}
              onPress={() => filterByType(type)}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: active ? colors.surface : colors.textLight,
                }}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
        {(filterOptions.types?.length > 0 || query.length > 0) && (
          <TouchableOpacity style={{ paddingHorizontal: spacing[3], justifyContent: 'center' }} onPress={clearFilters}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: colors.primary }}>Clear all</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <FlatList
        data={filteredNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteCard note={item} />}
        ListEmptyComponent={<EmptyState type="search" />}
        contentContainerStyle={{ paddingVertical: spacing[2], paddingBottom: insets.bottom + 80 }}
      />
    </View>
  );
};