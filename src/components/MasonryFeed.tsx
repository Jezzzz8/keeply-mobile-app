// src/components/MasonryFeed.tsx
import { FlatList, View } from 'react-native';
import { spacing } from '../theme/designTokens';
import { Card } from './ui/Card';

export const MasonryFeed = ({ data, onPressItem, ListHeaderComponent, refreshControl }) => {
  return (
    <FlatList
      data={data}
      numColumns={2}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ flex: 1, margin: spacing[2] }}>
          <Card {...item} onPress={() => onPressItem(item)} />
        </View>
      )}
      columnWrapperStyle={{ justifyContent: 'space-between' }}
      contentContainerStyle={{ paddingHorizontal: spacing[4], paddingBottom: 80 }}
      ListHeaderComponent={ListHeaderComponent}
      refreshControl={refreshControl}
    />
  );
};