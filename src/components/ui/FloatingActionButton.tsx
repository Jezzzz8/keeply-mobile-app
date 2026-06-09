import { Feather as Icon } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { borderRadius, colors, shadows, spacing } from '../../theme/designTokens';

const actions = [
  { icon: 'edit-2', label: 'New Note', key: 'note' },
  { icon: 'link', label: 'Save Link', key: 'link' },
  { icon: 'image', label: 'Add Image', key: 'image' },
  { icon: 'zap', label: 'Quick Thought', key: 'quick' },
];

export const FloatingActionButton = ({ onSelect }: { onSelect: (action: string) => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TouchableOpacity
        onPress={() => setOpen(true)}
        style={[shadows.lg, { position: 'absolute', bottom: 20, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary, justifyContent: 'center', alignItems: 'center' }]}
      >
        <Icon name="plus" size={24} color={colors.surface} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setOpen(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' }}>
            <View style={{ backgroundColor: colors.surface, borderTopLeftRadius: borderRadius.xl, borderTopRightRadius: borderRadius.xl, padding: spacing[5] }}>
              {actions.map((action) => (
                <TouchableOpacity
                  key={action.key}
                  onPress={() => {
                    setOpen(false);
                    onSelect(action.key);
                  }}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing[4] }}
                >
                  <Icon name={action.icon as any} size={24} color={colors.primary} style={{ marginRight: spacing[4] }} />
                  <Text style={{ fontSize: 18, color: colors.text }}>{action.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};