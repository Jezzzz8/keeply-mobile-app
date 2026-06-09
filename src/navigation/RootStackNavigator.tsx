// src/navigation/RootStackNavigator.tsx
import { createStackNavigator } from '@react-navigation/stack';
import { AddScreen } from '../screens/AddScreen';
import { NoteDetailScreen } from '../screens/NoteDetailScreen';
import { SearchScreen } from '../screens/SearchScreen';
import AppNavigator from './index'; // Your existing bottom tab navigator

const Stack = createStackNavigator();

export default function RootStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* The main tab navigator */}
      <Stack.Screen name="MainTabs" component={AppNavigator} />

      {/* Screens that can be opened from the tabs */}
      <Stack.Screen name="Add" component={AddScreen} />
      <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
      <Stack.Screen name="SearchMain" component={SearchScreen} />
    </Stack.Navigator>
  );
}