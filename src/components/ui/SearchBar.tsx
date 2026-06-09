// src/components/ui/SearchBar.tsx
import { Feather as Icon } from '@expo/vector-icons';
import { TextInput, View } from 'react-native';
import { borderRadius, colors, spacing } from '../../theme/designTokens';

export const SearchBar = ({ value, onChangeText, placeholder }) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.surface,
      borderRadius: borderRadius.md,
      paddingHorizontal: spacing[4],
      paddingVertical: spacing[2],
      marginTop: spacing[4],
      borderWidth: 1,
      borderColor: colors.border,
    }}
  >
    <Icon name="search" size={20} color={colors.textLight} style={{ marginRight: spacing[2] }} />
    <TextInput
      style={{ flex: 1, fontSize: 16, color: colors.text }}
      placeholder={placeholder}
      placeholderTextColor={colors.textLight}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);