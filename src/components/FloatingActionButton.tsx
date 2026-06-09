import { Feather as Icon } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
import { colors, shadows } from '../theme/designTokens';

export const FloatingActionButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity
    style={[
      shadows.lg,
      {
        position: 'absolute',
        bottom: 20,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
      },
    ]}
    onPress={onPress}
  >
    <Icon name={"plus" as any} size={28} color={colors.surface} />
  </TouchableOpacity>
);