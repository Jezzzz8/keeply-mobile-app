import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { OnboardingScreen } from '../screens/OnboardingScreen';

const OnboardingContext = createContext({ completed: true, setCompleted: (v: boolean) => {} });

export const OnboardingProvider = ({ children }: any) => {
  const [completed, setCompleted] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem('onboardingCompleted').then(val => {
      if (val !== 'true') setCompleted(false);
    });
  }, []);

  const setAndStore = (val: boolean) => {
    setCompleted(val);
    AsyncStorage.setItem('onboardingCompleted', String(val));
  };

  if (!completed) return <OnboardingScreen onFinish={() => setAndStore(true)} />;
  return <OnboardingContext.Provider value={{ completed, setCompleted: setAndStore }}>{children}</OnboardingContext.Provider>;
};

export const useOnboarding = () => useContext(OnboardingContext);