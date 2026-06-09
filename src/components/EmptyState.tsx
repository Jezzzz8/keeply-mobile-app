// src/components/EmptyState.tsx
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const messages = {
  notes: { emoji: '📝', title: 'No notes yet', desc: 'Tap the + button to create your first note' },
  search: { emoji: '🔍', title: 'No results found', desc: 'Try a different keyword' },
  vault: { emoji: '🔒', title: 'Vault is empty', desc: 'Move notes to vault to secure them' },
};

export const EmptyState = ({ type, onAction }: { type: keyof typeof messages; onAction?: () => void }) => {
  const { emoji, title, desc } = messages[type];
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.desc}>{desc}</Text>
      {onAction && (
        <TouchableOpacity style={styles.button} onPress={onAction}>
          <Text style={styles.buttonText}>Get Started</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: 40, marginTop: 60 },
  emoji: { fontSize: 64, marginBottom: 20 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 8, color: '#1a1a1a' },
  desc: { fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 24 },
  button: { backgroundColor: '#007aff', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 25 },
  buttonText: { color: '#fff', fontWeight: '500' },
});