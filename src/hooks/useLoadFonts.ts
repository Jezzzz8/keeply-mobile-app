import { useState } from 'react';

export const useLoadFonts = () => {
  const [fontsLoaded, setFontsLoaded] = useState(true); // Assume loaded
  const [fontsError, setFontsError] = useState<Error | null>(null);

  // No actual font loading – use system fonts
  return { fontsLoaded, fontsError };
};