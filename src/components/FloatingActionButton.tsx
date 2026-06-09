import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export const FloatingActionButton = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={styles.fab} onPress={onPress}>
    <Text style={styles.fabText}>+</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: { fontSize: 28, color: '#fff', fontWeight: '600' },
});