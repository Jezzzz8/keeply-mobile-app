import { Feather as Icon } from '@expo/vector-icons';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { FlatList, Text, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { RootStackParamList } from '../navigation/types';
import { BiometricService } from '../services/BiometricService';
import { useNoteStore } from '../store/useNoteStore';
import { colors, spacing, typography } from '../theme/designTokens';

export const VaultScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [unlocked, setUnlocked] = useState(false);
  const { vaultNotes, loadVaultNotes } = useNoteStore();

  useEffect(() => {
    if (unlocked) loadVaultNotes();
  }, [unlocked]);

  const authenticate = async () => {
    const success = await BiometricService.authenticate();
    if (success) {
      setUnlocked(true);
      await loadVaultNotes();
    }
  };

  if (!unlocked) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: spacing[6] }}>
        <Icon name={"lock" as any} size={48} color={colors.text} style={{ marginBottom: spacing[4] }} />
        <Text style={[typography.heading2, { marginBottom: spacing[4] }]}>Vault Locked</Text>
        <Text style={[typography.body, { color: colors.textLight, textAlign: 'center', marginBottom: spacing[8] }]}>
          Your private notes are secured with biometric authentication.
        </Text>
        <Button title="Unlock Vault" onPress={authenticate} variant="primary" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: spacing[5] }}>
        <Text style={[typography.heading1]}>Vault</Text>
      </View>
      <FlatList
        data={vaultNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Card
            type={item.type}
            title={item.title}
            subtitle={item.content?.slice(0, 80)}
            thumbnail={item.thumbnail}
            tags={item.tags}
            timestamp={item.updatedAt}
            onPress={() => navigation.navigate('NoteDetail', { noteId: item.id })}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: spacing[4], paddingBottom: 80 }}
      />
    </View>
  );
};