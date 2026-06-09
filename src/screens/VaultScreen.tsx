// src/screens/VaultScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { EmptyState } from '../components/EmptyState';
import { NoteCard } from '../components/NoteCard';
import { BiometricService } from '../services/BiometricService';
import { useNoteStore } from '../store/useNoteStore';

export const VaultScreen = () => {
  const { notes, loadNotes } = useNoteStore();
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [biometricType, setBiometricType] = useState('Biometric');
  const vaultNotes = notes.filter(n => n.isVault);

  useEffect(() => {
    BiometricService.getBiometricType().then(setBiometricType);
    if (!isUnlocked) {
      authenticate();
    }
  }, []);

  const authenticate = async () => {
    const success = await BiometricService.authenticate();
    if (success) {
      setIsUnlocked(true);
      loadNotes();
    } else {
      Alert.alert(
        'Access Denied',
        'Unable to verify your identity. Vault access requires biometric authentication.',
        [{ text: 'OK', onPress: () => {} }]
      );
    }
  };

  if (!isUnlocked) {
    return (
      <View style={styles.lockedContainer}>
        <Text style={styles.lockIcon}>🔒</Text>
        <Text style={styles.lockedTitle}>Vault Locked</Text>
        <Text style={styles.lockedText}>Your private notes are secured with biometric authentication</Text>
        <TouchableOpacity style={styles.unlockButton} onPress={authenticate}>
          <Text style={styles.unlockButtonText}>Unlock Vault</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🔐 Vault</Text>
        <Text style={styles.subtitle}>Secured with {biometricType}</Text>
      </View>
      
      {vaultNotes.length === 0 ? (
        <EmptyState type="vault" />
      ) : (
        <FlatList
          data={vaultNotes}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NoteCard note={item} />}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  lockedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 40,
  },
  lockIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  lockedTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 12,
  },
  lockedText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 32,
  },
  unlockButton: {
    backgroundColor: '#007aff',
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 12,
  },
  unlockButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    padding: 20,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
  },
  list: {
    paddingVertical: 8,
  },
});