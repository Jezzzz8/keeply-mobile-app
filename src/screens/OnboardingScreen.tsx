import React, { useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const slides = [
  { id: '1', title: 'Save anything quickly', emoji: '⚡', desc: 'Paste links, write notes, or save ideas in one tap' },
  { id: '2', title: 'Offline-first', emoji: '📴', desc: 'Works entirely offline – your data stays on your device' },
  { id: '3', title: 'AI-powered organization', emoji: '🤖', desc: 'Smart tags and categories, no internet required' },
  { id: '4', title: 'Secure vault', emoji: '🔒', desc: 'Protect sensitive notes with Face ID / Touch ID' },
  { id: '5', title: 'Smart recall', emoji: '💭', desc: 'Rediscover forgotten content automatically' },
];

export const OnboardingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const next = () => {
    if (index < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      onFinish();
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={e => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <View style={styles.footer}>
        <TouchableOpacity onPress={onFinish}><Text style={styles.skip}>Skip</Text></TouchableOpacity>
        <View style={styles.dots}>
          {slides.map((_, i) => <View key={i} style={[styles.dot, i === index && styles.activeDot]} />)}
        </View>
        <TouchableOpacity onPress={next}><Text style={styles.next}>{index === slides.length - 1 ? 'Get Started' : 'Next'}</Text></TouchableOpacity>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  slide: { width, padding: 40, justifyContent: 'center', alignItems: 'center', flex: 1 },
  emoji: { fontSize: 80, marginBottom: 40 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', marginBottom: 16 },
  desc: { fontSize: 16, color: '#666', textAlign: 'center', paddingHorizontal: 20 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 30, paddingBottom: 40, alignItems: 'center' },
  skip: { fontSize: 16, color: '#999' },
  next: { fontSize: 16, color: '#007aff', fontWeight: '600' },
  dots: { flexDirection: 'row' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#ccc', marginHorizontal: 4 },
  activeDot: { backgroundColor: '#007aff', width: 20 },
});