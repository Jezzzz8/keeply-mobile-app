// src/components/ui/Card.tsx
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, shadows, spacing, typography } from '../../theme/designTokens';
import { Note } from '../../types';

type CardProps = {
  type: Note['type'];
  title: string;
  subtitle?: string;
  thumbnail?: string;
  tags?: string[];
  timestamp: number;
  onPress: () => void;
};

export const Card = ({ type, title, subtitle, thumbnail, tags, timestamp, onPress }: CardProps) => {
  const formatDate = (ts: number) => {
    const diff = Date.now() - ts;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return new Date(ts).toLocaleDateString();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[shadows.sm, { backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginBottom: spacing[4], overflow: 'hidden' }]}
    >
      {thumbnail && <Image source={{ uri: thumbnail }} style={{ width: '100%', height: 180, resizeMode: 'cover' }} />}
      <View style={{ padding: spacing[4] }}>
        <Text style={[typography.heading3, { marginBottom: spacing[2] }]} numberOfLines={2}>{title}</Text>
        {subtitle && <Text style={[typography.bodySmall, { color: colors.textLight, marginBottom: spacing[3] }]} numberOfLines={2}>{subtitle}</Text>}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: spacing[3] }}>
          {tags?.slice(0, 3).map((tag, i) => (
            <View key={i} style={{ backgroundColor: colors.border, borderRadius: borderRadius.sm, paddingHorizontal: spacing[2], paddingVertical: spacing[1], marginRight: spacing[2], marginBottom: spacing[1] }}>
              <Text style={[typography.caption, { color: colors.textLight }]}>#{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={[typography.caption, { color: colors.textLight }]}>{formatDate(timestamp)}</Text>
      </View>
    </TouchableOpacity>
  );
};