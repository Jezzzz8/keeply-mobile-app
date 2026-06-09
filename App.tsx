import { NavigationContainer } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemedRoot } from './src/components/ThemedRoot'; // fixed path
import { DatabaseService } from './src/database/DatabaseService';
import { useLoadFonts } from './src/hooks/useLoadFonts';
import { OnboardingProvider } from './src/hooks/useOnboarding';
import { ThemeProvider } from './src/hooks/useTheme';
import RootStackNavigator from './src/navigation/RootStackNavigator';

export default function App() {
  const [dbReady, setDbReady] = useState(false);
  const { fontsLoaded } = useLoadFonts();

  useEffect(() => {
    const initDB = async () => {
      await DatabaseService.init();
      setDbReady(true);
    };
    initDB();
  }, []);

  if (!fontsLoaded || !dbReady) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1 }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <OnboardingProvider>
              <ThemedRoot>
                <NavigationContainer>
                  <RootStackNavigator />
                </NavigationContainer>
              </ThemedRoot>
            </OnboardingProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </View>
    </GestureHandlerRootView>
  );
}