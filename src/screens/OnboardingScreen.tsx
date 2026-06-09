import { useRef, useState } from 'react';
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Button } from '../components/ui/Button';
import { colors, spacing, typography } from '../theme/designTokens';

const { width } = Dimensions.get('window');

// Helper to get SVG component from require() result
const getSvgComponent = (svgModule: any) => {
  // If it's a component directly, return it
  if (typeof svgModule === 'function' || typeof svgModule === 'object' && svgModule?.render) {
    return svgModule;
  }
  // If it's a module with default export (common with some transformers)
  return svgModule?.default || svgModule;
};

const slides = [
  { id: '1', title: 'Capture Anything', desc: 'Notes, links, images, ideas – all in one place', illustration: require('../assets/illustrations/capture.svg') },
  { id: '2', title: 'Save Links & Previews', desc: 'Paste a URL, get a rich preview – offline', illustration: require('../assets/illustrations/links.svg') },
  { id: '3', title: 'Organize with Ease', desc: 'Tags, favorites, and a secure vault', illustration: require('../assets/illustrations/organize.svg') },
  { id: '4', title: 'Works Offline', desc: 'Your data stays on your device, always accessible', illustration: require('../assets/illustrations/offline.svg') },
];

export const OnboardingScreen = ({ onFinish }: { onFinish: () => void }) => {
  const [index, setIndex] = useState(0);
  const flatListRef = useRef(null);

  const next = () => {
    if (index < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: index + 1 });
      setIndex(index + 1);
    } else {
      onFinish();
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => {
          const SvgComponent = getSvgComponent(item.illustration);
          return (
            <View style={{ width, paddingHorizontal: spacing[6], justifyContent: 'center', alignItems: 'center', flex: 1 }}>
              <SvgComponent
                width={240}
                height={240}
                style={{ marginBottom: spacing[8] }}
                // Remove preserveAspectRatio if it causes issues; use viewBox scaling instead
              />
              <Text style={[typography.heading1, { textAlign: 'center', marginBottom: spacing[4] }]}>{item.title}</Text>
              <Text style={[typography.body, { color: colors.textLight, textAlign: 'center' }]}>{item.desc}</Text>
            </View>
          );
        }}
        keyExtractor={(item) => item.id}
      />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing[6], paddingBottom: spacing[10] }}>
        <TouchableOpacity onPress={onFinish}>
          <Text style={[typography.body, { color: colors.textLight }]}>Skip</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row' }}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={{
                width: i === index ? 24 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: i === index ? colors.primary : colors.border,
                marginHorizontal: 3,
              }}
            />
          ))}
        </View>
        <Button title={index === slides.length - 1 ? 'Get Started' : 'Next'} onPress={next} variant="primary" />
      </View>
    </View>
  );
};