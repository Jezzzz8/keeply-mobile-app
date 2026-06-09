// src/screens/LinksScreen.tsx
import { useEffect, useState } from 'react';
import { FlatList, Linking, Text, View } from 'react-native'; // ← added Linking
import { LinkPreview } from '../components/LinkPreview';
import { SearchBar } from '../components/ui/SearchBar'; // we'll create this next
import { useNoteStore } from '../store/useNoteStore';
import { colors, spacing, typography } from '../theme/designTokens';

export const LinksScreen = () => {
  const { links, loadLinks } = useNoteStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadLinks();
  }, []);

  const filteredLinks = links.filter(link =>
    link.title?.toLowerCase().includes(search.toLowerCase()) ||
    link.url?.includes(search)
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing[5] }}>
        <Text style={[typography.heading1]}>Links</Text>
        <SearchBar value={search} onChangeText={setSearch} placeholder="Search saved links..." />
      </View>
      <FlatList
        data={filteredLinks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <LinkPreview
            url={item.url}
            title={item.title}
            description={item.description}
            thumbnail={item.thumbnail}
            onPress={() => Linking.openURL(item.url)}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: spacing[5], paddingBottom: 80 }}
      />
    </View>
  );
};