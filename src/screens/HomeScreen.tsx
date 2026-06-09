// src/screens/HomeScreen.tsx
import { useEffect, useState } from 'react';
import { RefreshControl, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FeaturedCard } from '../components/FeaturedCard';
import { MasonryFeed } from '../components/MasonryFeed';
import { FilterChip } from '../components/ui/FilterChip';
import { FloatingActionButton } from '../components/ui/FloatingActionButton';
import { useNoteStore } from '../store/useNoteStore';
import { colors, spacing, typography } from '../theme/designTokens';

const filters = ['All', 'Notes', 'Links', 'Images', 'Favorites', 'Vault'];

export const HomeScreen = ({ navigation }) => {
  const { notes, loadNotes } = useNoteStore();
  const [activeFilter, setActiveFilter] = useState('All');
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadNotes();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadNotes();
    setRefreshing(false);
  };

  const getFeaturedItem = () => notes.length ? notes[0] : null;

  const filteredNotes = notes.filter((note) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Notes') return note.type === 'note';
    if (activeFilter === 'Links') return note.type === 'link';
    if (activeFilter === 'Images') return note.images?.length > 0;
    if (activeFilter === 'Favorites') return note.favorite;
    if (activeFilter === 'Vault') return note.isVault;
    return true;
  });

  const Header = () => (
    <>
      {/* app header */}
      <View style={{ paddingTop: insets.top + spacing[4], paddingHorizontal: spacing[5] }}>
        <Text style={[typography.heading1]}>Keeply</Text>
        <Text style={[typography.bodySmall, { color: colors.textLight }]}>Save it. Find it. Never lose it.</Text>
      </View>

      {/* filter chips row (horizontal ScrollView remains – it's fine inside a FlatList header) */}
      <View style={{ marginBottom: spacing[4] }}>
        <View style={{ flexDirection: 'row', paddingHorizontal: spacing[5] }}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {filters.map((filter) => (
              <FilterChip
                key={filter}
                label={filter}
                active={activeFilter === filter}
                onPress={() => setActiveFilter(filter)}
              />
            ))}
          </View>
        </View>
      </View>

      {/* featured card */}
      {getFeaturedItem() && (
        <FeaturedCard
          item={getFeaturedItem()}
          onPress={() => navigation.navigate('NoteDetail', { noteId: getFeaturedItem().id })}
        />
      )}
    </>
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <MasonryFeed
        data={filteredNotes}
        onPressItem={(item) => navigation.navigate('NoteDetail', { noteId: item.id })}
        ListHeaderComponent={<Header />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
      <FloatingActionButton onSelect={(action) => {
        if (action === 'note') navigation.navigate('Add', { type: 'note' });
        else if (action === 'link') navigation.navigate('Add', { type: 'link' });
        else if (action === 'image') navigation.navigate('Add', { type: 'image' });
        else if (action === 'quick') navigation.navigate('Add', { type: 'quick' });
      }} />
    </View>
  );
};