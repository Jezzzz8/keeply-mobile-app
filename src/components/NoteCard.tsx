import { Feather as Icon } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, TouchableOpacity, View } from 'react-native';
import { RootStackParamList } from '../navigation/types';
import { borderRadius, colors, shadows, spacing, typography } from '../theme/designTokens';
import { Note } from '../types';

type NavigationProp = StackNavigationProp<RootStackParamList, 'NoteDetail'>;

export const NoteCard = ({ note, onPress }: { note: Note; onPress?: () => void }) => {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = () => {
    navigation.navigate('NoteDetail', { noteId: note.id });
    onPress?.();
  };

  const getTypeIcon = (type: Note['type']) => {
    switch (type) {
      case 'link': return 'link';
      case 'idea': return 'bulb';
      case 'clipboard': return 'clipboard';
      case 'quick': return 'zap';
      default: return 'file-text';
    }
  };

  const stripHtml = (html: string) => html.replace(/<[^>]*>/g, '').substring(0, 100);
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const hours = (Date.now() - date.getTime()) / (1000 * 60 * 60);
    return hours < 24 ? `${Math.floor(hours)}h ago` : date.toLocaleDateString();
  };

  return (
    <TouchableOpacity
      style={[shadows.md, { backgroundColor: colors.surface, borderRadius: borderRadius.md, padding: spacing[4], marginHorizontal: spacing[4], marginVertical: spacing[2] }]}
      onPress={handlePress}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing[2] }}>
        <Icon name={getTypeIcon(note.type) as any} size={20} color={colors.primary} style={{ marginRight: spacing[2] }} />
        <Text style={[typography.body, { fontWeight: '600', color: colors.text, flex: 1 }]} numberOfLines={2}>
          {note.title}
        </Text>
      </View>
      <Text style={[typography.bodySmall, { color: colors.textLight, marginBottom: spacing[3] }]} numberOfLines={2}>
        {stripHtml(note.content)}
      </Text>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing[1] }}>
          {note.tags.slice(0, 3).map((tag, idx) => (
            <View key={idx} style={{ backgroundColor: colors.border, paddingHorizontal: spacing[2], paddingVertical: 2, borderRadius: borderRadius.sm }}>
              <Text style={{ fontSize: 10, color: colors.textLight }}>#{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={{ fontSize: 10, color: colors.textLight }}>{formatDate(note.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};