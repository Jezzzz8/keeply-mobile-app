// src/components/RichTextEditor.tsx
import { useRef, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import { RichEditor, RichToolbar } from 'react-native-pell-rich-editor';
import { borderRadius, colors, spacing } from '../theme/designTokens';

export const RichTextEditor = ({ initialHTML, onChange, onImageInsert }) => {
  const editorRef = useRef(null);
  const [showToolbar, setShowToolbar] = useState(false);

  const handleSelectionChange = () => {
    setShowToolbar(true);
    setTimeout(() => setShowToolbar(false), 2000);
  };

  const handleImagePress = () => {
    // Call the parent-provided image picker function
    if (onImageInsert) {
      onImageInsert((imageUri) => {
        editorRef.current?.insertImage(imageUri);
      });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <RichEditor
        ref={editorRef}
        initialContentHTML={initialHTML}
        onChange={onChange}
        editorStyle={{ backgroundColor: colors.surface, color: colors.text, placeholderColor: colors.textLight }}
      />
      {showToolbar && (
        <View style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          backgroundColor: colors.surface,
          borderRadius: borderRadius.md,
          padding: spacing[2],
          ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
            android: { elevation: 4 }
          })
        }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <RichToolbar
              editor={editorRef}
              actions={['bold', 'italic', 'underline', 'heading1', 'unorderedList', 'orderedList', 'checklist', 'alignLeft', 'insertImage']}
              onPressInsertImage={handleImagePress}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};