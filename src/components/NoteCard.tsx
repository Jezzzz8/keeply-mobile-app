// src/components/NoteCard.tsx
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Note } from '../types';

interface NoteCardProps {
  note: Note;
  onPress?: () => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPress }) => {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('NoteDetail', { noteId: note.id });
    onPress?.();
  };

  const getTypeIcon = () => {
    const icons: Record<string, string> = {
      link: '🔗',
      idea: '💡',
      clipboard: '📋',
      quick: '⚡',
      note: '📝'
    };
    return icons[note.type] || '📄';
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = diff / (1000 * 60 * 60);
    
    if (hours < 24) {
      return `${Math.floor(hours)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <View style={styles.header}>
        <Text style={styles.typeIcon}>{getTypeIcon()}</Text>
        <Text style={styles.title} numberOfLines={2}>{note.title}</Text>
      </View>
      
      <Text style={styles.preview} numberOfLines={2}>
        {note.content.substring(0, 100)}
      </Text>
      
      <View style={styles.footer}>
        <View style={styles.tagContainer}>
          {note.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>
        <Text style={styles.timestamp}>{formatDate(note.updatedAt)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    flex: 1,
  },
  preview: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 20,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  tag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#666666',
  },
  timestamp: {
    fontSize: 11,
    color: '#999999',
  },
});