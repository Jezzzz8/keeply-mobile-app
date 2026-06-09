export const colors = {
  background: '#f8f9fa',
  card: '#ffffff',
  primary: '#bd44ff',
  secondary: '#0bcdb6',
  accent: '#67d4fc',
  text: '#1a1a1a',
  textLight: '#666666',
  border: '#f0f0f0',
  error: '#ff3b30',
};

export const typography = {
  heading1: { fontSize: 32, fontWeight: '700' as const, lineHeight: 40 },
  heading2: { fontSize: 24, fontWeight: '600' as const, lineHeight: 32 },
  heading3: { fontSize: 20, fontWeight: '600' as const, lineHeight: 28 },
  body: { fontSize: 16, fontWeight: '400' as const, lineHeight: 24 },
  bodySmall: { fontSize: 14, fontWeight: '400' as const, lineHeight: 20 },
  caption: { fontSize: 12, fontWeight: '500' as const, lineHeight: 16 },
  fontFamily: {
    regular: 'System',
    medium: 'System',
    semibold: 'System',
    bold: 'System',
  },
  size: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 28,
  },
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
};

export const borderRadius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};