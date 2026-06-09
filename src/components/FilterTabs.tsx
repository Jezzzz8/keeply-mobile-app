import { ScrollView, Text, TouchableOpacity } from 'react-native';
import { borderRadius, colors, spacing } from '../theme/designTokens';

const tabs = [
  { key: 'all', label: 'All Notes' },
  { key: 'links', label: 'Links' },
  { key: 'images', label: 'Images' },
  { key: 'vault', label: 'Vault' },
];

export const FilterTabs = ({ active, onSelect }: { active: string; onSelect: (key: string) => void }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: spacing[4], marginVertical: spacing[3] }}>
    {tabs.map((tab) => {
      const isActive = active === tab.key;
      return (
        <TouchableOpacity
          key={tab.key}
          style={{
            paddingHorizontal: spacing[5],
            paddingVertical: spacing[2],
            borderRadius: borderRadius.full,
            marginRight: spacing[2],
            borderWidth: 1,
            borderColor: isActive ? colors.primary : colors.border,
            backgroundColor: isActive ? colors.primary : colors.surface,
          }}
          onPress={() => onSelect(tab.key)}
        >
          <Text style={{ fontSize: 14, fontWeight: '500', color: isActive ? colors.surface : colors.textLight }}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);