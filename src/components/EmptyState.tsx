import { Feather as Icon } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../theme/designTokens';

const messages = {
  notes: { icon: 'edit-2', title: 'No notes yet', desc: 'Tap the + button to create your first note' },
  search: { icon: 'search', title: 'No results found', desc: 'Try a different keyword' },
  vault: { icon: 'lock', title: 'Vault is empty', desc: 'Move notes to vault to secure them' },
};

export const EmptyState = ({ type, onAction }: { type: keyof typeof messages; onAction?: () => void }) => {
  const { icon, title, desc } = messages[type];
  return (
    <View style={{ alignItems: 'center', paddingHorizontal: spacing[6], paddingTop: spacing[6], marginTop: spacing[6] }}>
      <Icon name={icon as any} size={48} color={colors.textLight} style={{ marginBottom: spacing[5] }} />
      <Text style={[typography.heading3, { color: colors.text, marginBottom: spacing[2] }]}>{title}</Text>
      <Text style={[typography.bodySmall, { color: colors.textLight, textAlign: 'center', marginBottom: spacing[5] }]}>{desc}</Text>
      {onAction && (
        <TouchableOpacity style={{ backgroundColor: colors.primary, paddingHorizontal: spacing[5], paddingVertical: spacing[3], borderRadius: borderRadius.full }} onPress={onAction}>
          <Text style={{ color: colors.surface, fontWeight: '500', fontSize: 14 }}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};