import { Feather as Icon } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { colors, spacing } from '../../theme/designTokens';

export const IconButton = ({ icon, onPress, size = 24, color = colors.textLight }) => (
  <TouchableOpacity onPress={onPress} style={{ padding: spacing[2] }}>
    <Icon name={icon as any} size={size} color={color} />
  </TouchableOpacity>
);