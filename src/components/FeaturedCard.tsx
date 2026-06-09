// src/components/FeaturedCard.tsx
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../theme/designTokens';

export const FeaturedCard = ({ item, onPress }) => (
  <TouchableOpacity onPress={onPress} style={[shadows.md, { backgroundColor: colors.primaryLight, borderRadius: borderRadius.xl, marginHorizontal: spacing[5], marginBottom: spacing[6], overflow: 'hidden' }]}>
    {item.thumbnail && <Image source={{ uri: item.thumbnail }} style={{ width: '100%', height: 200 }} />}
    <View style={{ padding: spacing[6] }}>
      <Text style={[typography.caption, { color: colors.primary, marginBottom: spacing[2] }]}>Featured • {item.type === 'note' ? 'Continue writing' : item.type === 'link' ? 'Recently saved' : 'Memory'}</Text>
      <Text style={[typography.heading2, { color: colors.text, marginBottom: spacing[3] }]}>{item.title}</Text>
      <Text style={[typography.body, { color: colors.textLight, marginBottom: spacing[4] }]} numberOfLines={2}>{item.subtitle || item.content?.slice(0, 80)}</Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={[typography.bodySmall, { color: colors.primary, fontWeight: '600' }]}>Open →</Text>
        {item.tags?.slice(0, 2).map((tag, i) => <Text key={i} style={[typography.caption, { color: colors.textLight }]}>#{tag}</Text>)}
      </View>
    </View>
  </TouchableOpacity>
);