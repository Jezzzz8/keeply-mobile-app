import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

const commonTags = ['important', 'idea', 'link', 'work', 'personal'];

export const FilterChips = ({ selectedTags, onTagSelect }: any) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
    {commonTags.map(tag => (
      <TouchableOpacity
        key={tag}
        style={[styles.chip, selectedTags.includes(tag) && styles.chipActive]}
        onPress={() => onTagSelect(tag)}
      >
        <Text style={[styles.chipText, selectedTags.includes(tag) && styles.chipTextActive]}>
          #{tag}
        </Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: { paddingHorizontal: 16, marginVertical: 8 },
  chip: { backgroundColor: '#f0f0f0', paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  chipActive: { backgroundColor: '#007aff' },
  chipText: { fontSize: 14, color: '#333' },
  chipTextActive: { color: '#fff' },
});