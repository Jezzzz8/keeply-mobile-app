// src/components/ui/Button.tsx
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { borderRadius, colors, spacing, typography } from '../../theme/designTokens';

type ButtonProps = {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
};

export const Button = ({ onPress, title, variant = 'primary', loading, disabled }: ButtonProps) => {
  const bgColor = variant === 'primary' ? colors.primary : variant === 'secondary' ? colors.surface : 'transparent';
  const textColor = variant === 'primary' ? colors.surface : colors.primary;
  const border = variant === 'secondary' ? { borderWidth: 1, borderColor: colors.border } : {};

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        { backgroundColor: bgColor, borderRadius: borderRadius.md, paddingVertical: spacing[3], paddingHorizontal: spacing[5], alignItems: 'center', justifyContent: 'center', flexDirection: 'row' },
        border,
        disabled && { opacity: 0.6 },
      ]}
    >
      {loading ? <ActivityIndicator color={textColor} /> : <Text style={[typography.body, { color: textColor, fontWeight: '600' }]}>{title}</Text>}
    </TouchableOpacity>
  );
};