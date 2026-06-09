import { View } from 'react-native';
import { useTheme } from '../hooks/useTheme';
import { colors } from '../theme/designTokens';

export const ThemedRoot = ({ children }: { children: React.ReactNode }) => {
  const { theme } = useTheme();
  // Force light theme for now to debug
  const backgroundColor = theme === 'dark' ? '#1a1a1a' : colors.background;
  return <View style={{ flex: 1, backgroundColor }}>{children}</View>;
};