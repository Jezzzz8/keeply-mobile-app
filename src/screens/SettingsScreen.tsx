// src/screens/SettingsScreen.tsx
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { DatabaseService } from '../database/DatabaseService';
import { useTheme } from '../hooks/useTheme';

export const SettingsScreen = () => {
  const { theme, toggleTheme } = useTheme();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [autoTagging, setAutoTagging] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [storageSize, setStorageSize] = useState('0 MB');

  useEffect(() => {
    loadSettings();
    calculateStorage();
  }, []);

  const loadSettings = async () => {
    const savedBiometric = await AsyncStorage.getItem('biometricEnabled');
    const savedAutoTagging = await AsyncStorage.getItem('autoTagging');
    const savedHaptics = await AsyncStorage.getItem('hapticsEnabled');
    
    if (savedBiometric !== null) setBiometricEnabled(savedBiometric === 'true');
    if (savedAutoTagging !== null) setAutoTagging(savedAutoTagging === 'true');
    if (savedHaptics !== null) setHapticsEnabled(savedHaptics === 'true');
  };

  const calculateStorage = async () => {
    const notes = await DatabaseService.getAllNotes();
    const size = JSON.stringify(notes).length;
    const mb = (size / (1024 * 1024)).toFixed(2);
    setStorageSize(`${mb} MB`);
  };

  const exportData = async () => {
    const notes = await DatabaseService.getAllNotes();
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0.0',
      notes: notes
    };
    const dataStr = JSON.stringify(exportData, null, 2);
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(`data:application/json;base64,${btoa(dataStr)}`, {
        mimeType: 'application/json',
        dialogTitle: 'Export Keeply Data',
      });
    } else {
      Alert.alert('Export not available', 'Sharing is not available on this device');
    }
  };

  const replayOnboarding = async () => {
    await AsyncStorage.setItem('onboardingCompleted', 'false');
    Alert.alert('Success', 'Onboarding will show on next app launch');
  };

  const clearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your notes and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const notes = await DatabaseService.getAllNotes();
            for (const note of notes) {
              await DatabaseService.deleteNote(note.id);
            }
            await AsyncStorage.clear();
            Alert.alert('Data cleared', 'All data has been deleted');
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        <TouchableOpacity style={styles.settingItem} onPress={toggleTheme}>
          <Text style={styles.settingLabel}>Dark Mode</Text>
          <Text style={styles.settingValue}>{theme === 'dark' ? 'On' : 'Off'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy & Security</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Biometric Lock</Text>
          <Switch
            value={biometricEnabled}
            onValueChange={async (value) => {
              setBiometricEnabled(value);
              await AsyncStorage.setItem('biometricEnabled', String(value));
            }}
            trackColor={{ false: '#e0e0e0', true: '#007aff' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>AI & Organization</Text>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Auto-Tagging</Text>
          <Switch
            value={autoTagging}
            onValueChange={async (value) => {
              setAutoTagging(value);
              await AsyncStorage.setItem('autoTagging', String(value));
            }}
            trackColor={{ false: '#e0e0e0', true: '#007aff' }}
          />
        </View>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Haptics</Text>
          <Switch
            value={hapticsEnabled}
            onValueChange={async (value) => {
              setHapticsEnabled(value);
              await AsyncStorage.setItem('hapticsEnabled', String(value));
            }}
            trackColor={{ false: '#e0e0e0', true: '#007aff' }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Data Management</Text>
        <TouchableOpacity style={styles.settingItem} onPress={exportData}>
          <Text style={styles.settingLabel}>Export Data</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={replayOnboarding}>
          <Text style={styles.settingLabel}>Replay Onboarding</Text>
          <Text style={styles.settingValue}>→</Text>
        </TouchableOpacity>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Storage Used</Text>
          <Text style={styles.settingValue}>{storageSize}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <TouchableOpacity style={styles.settingItem} onPress={clearAllData}>
          <Text style={[styles.settingLabel, styles.dangerText]}>Clear All Data</Text>
          <Text style={styles.dangerValue}>⚠️</Text>
        </TouchableOpacity>
        <View style={styles.settingItem}>
          <Text style={styles.settingLabel}>Version</Text>
          <Text style={styles.settingValue}>1.0.0</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  section: {
    backgroundColor: '#ffffff',
    marginTop: 20,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888888',
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#1a1a1a',
  },
  settingValue: {
    fontSize: 16,
    color: '#888888',
  },
  dangerText: {
    color: '#ff3b30',
  },
  dangerValue: {
    fontSize: 16,
    color: '#ff3b30',
  },
});