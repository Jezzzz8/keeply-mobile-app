// App.tsx
import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatabaseService } from './src/database/DatabaseService';
import { OnboardingProvider } from './src/hooks/useOnboarding';
import { ThemeProvider } from './src/hooks/useTheme';
import AppNavigator from './src/navigation';

export default function App() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    const initDB = async () => {
      await DatabaseService.init();
      setDbReady(true);
    };
    initDB();
  }, []);

  if (!dbReady) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <OnboardingProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </OnboardingProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}