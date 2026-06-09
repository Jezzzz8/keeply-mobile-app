// src/components/LinkPreview.tsx
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../theme/designTokens';

export const LinkPreview = ({ url, title, description, thumbnail, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ backgroundColor: colors.surface, borderRadius: borderRadius.md, marginVertical: spacing[2], overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
    {thumbnail && <Image source={{ uri: thumbnail }} style={{ width: '100%', height: 140 }} />}
    <View style={{ padding: spacing[3] }}>
      <Text style={[typography.body, { fontWeight: '600', marginBottom: spacing[1] }]} numberOfLines={1}>{title || new URL(url).hostname}</Text>
      <Text style={[typography.bodySmall, { color: colors.textLight }]} numberOfLines={2}>{description}</Text>
      <Text style={[typography.caption, { color: colors.primary, marginTop: spacing[2] }]}>{new URL(url).hostname}</Text>
    </View>
  </TouchableOpacity>
);