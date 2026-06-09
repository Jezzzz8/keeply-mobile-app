// src/navigation/index.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { AddScreen } from '../screens/AddScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { LinksScreen } from '../screens/LinksScreen';
import { NoteDetailScreen } from '../screens/NoteDetailScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { VaultScreen } from '../screens/VaultScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="HomeMain" component={HomeScreen} />
    <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
  </Stack.Navigator>
);

const SearchStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SearchMain" component={SearchScreen} />
    <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
  </Stack.Navigator>
);

const VaultStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="VaultMain" component={VaultScreen} />
    <Stack.Screen name="NoteDetail" component={NoteDetailScreen} />
  </Stack.Navigator>
);

const getTabBarIcon = (routeName: string, focused: boolean) => {
  const icons: Record<string, string> = {
    Home: '🏠',
    Search: '🔍',
    Add: '✏️',
    Vault: '🔒',
    Settings: '⚙️',
  };
  return icons[routeName] || '📄';
};

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => getTabBarIcon(route.name, focused),
        tabBarActiveTintColor: '#007aff',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          height: 60,
          paddingBottom: 8,
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Search" component={SearchStack} />
      <Tab.Screen name="Add" component={AddScreen} />
      <Tab.Screen name="Vault" component={VaultStack} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Links" component={LinksScreen} />
    </Tab.Navigator>
  );
}