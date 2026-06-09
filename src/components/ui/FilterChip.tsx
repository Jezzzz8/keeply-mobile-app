// src/components/ui/FilterChip.tsx
import { Text, TouchableOpacity } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../theme/designTokens';

export const FilterChip = ({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      backgroundColor: active ? colors.primary : colors.surface,
      borderRadius: borderRadius.full,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      marginRight: spacing[3],
      borderWidth: active ? 0 : 1,
      borderColor: colors.border,
    }}
  >
    <Text style={[typography.bodySmall, { color: active ? colors.surface : colors.text, fontWeight: active ? '600' : '500' }]}>{label}</Text>
  </TouchableOpacity>
);