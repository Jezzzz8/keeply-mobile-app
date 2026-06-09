import { Feather as Icon } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as SecureStore from 'expo-secure-store';
import * as Sharing from 'expo-sharing';
import { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { DatabaseService } from '../database/DatabaseService';
import { useTheme } from '../hooks/useTheme';
import { borderRadius, colors, spacing, typography } from '../theme/designTokens';

// Helper to get document directory safely (bypass TypeScript issue)
const getDocumentDir = (): string => {
  // @ts-ignore - documentDirectory exists at runtime
  return FileSystem.documentDirectory as string;
};

export const SettingsScreen = () => {
  const insets = useSafeAreaInsets();
  const { theme, toggleTheme } = useTheme();
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [autoTagging, setAutoTagging] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [storageSize, setStorageSize] = useState('0 MB');
  const [pinSet, setPinSet] = useState(false);
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinValue, setPinValue] = useState('');
  const [confirmPinValue, setConfirmPinValue] = useState('');
  const [pinMessage, setPinMessage] = useState('');

  useEffect(() => {
    loadSettings();
    calculateStorage();
  }, []);

  const loadSettings = async () => {
    const savedBiometric = await AsyncStorage.getItem('biometricEnabled');
    const savedAutoTagging = await AsyncStorage.getItem('autoTagging');
    const savedHaptics = await AsyncStorage.getItem('hapticsEnabled');
    const storedPin = await SecureStore.getItemAsync('vaultPin');
    if (savedBiometric !== null) setBiometricEnabled(savedBiometric === 'true');
    if (savedAutoTagging !== null) setAutoTagging(savedAutoTagging === 'true');
    if (savedHaptics !== null) setHapticsEnabled(savedHaptics === 'true');
    setPinSet(Boolean(storedPin));
  };

  const calculateStorage = async () => {
    const notes = await DatabaseService.getAllNotes();
    const size = JSON.stringify(notes).length;
    const mb = (size / (1024 * 1024)).toFixed(2);
    setStorageSize(`${mb} MB`);
  };

  const savePin = async () => {
    if (!pinValue || pinValue.length < 4) {
      setPinMessage('PIN must be at least 4 digits.');
      return;
    }
    if (pinValue !== confirmPinValue) {
      setPinMessage('PINs do not match.');
      return;
    }
    await SecureStore.setItemAsync('vaultPin', pinValue);
    setPinSet(true);
    setPinModalVisible(false);
    setPinValue('');
    setConfirmPinValue('');
    setPinMessage('PIN saved successfully.');
  };

  const removePin = async () => {
    await SecureStore.deleteItemAsync('vaultPin');
    setPinSet(false);
    setPinMessage('Vault PIN removed.');
  };

  const exportData = async () => {
    const notes = await DatabaseService.getAllNotes();
    const exportObj = { exportDate: new Date().toISOString(), version: '1.0.0', notes };
    const jsonStr = JSON.stringify(exportObj, null, 2);
    const documentDir = getDocumentDir();
    if (!documentDir) {
      Alert.alert('Error', 'Unable to access document directory');
      return;
    }
    const fileUri = `${documentDir}keeply-export-${Date.now()}.json`;
    await FileSystem.writeAsStringAsync(fileUri, jsonStr, { encoding: FileSystem.EncodingType.UTF8 });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, { mimeType: 'application/json', dialogTitle: 'Export Keeply Data' });
    } else {
      Alert.alert('Export not available', 'Sharing is not supported on this device');
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
            for (const note of notes) await DatabaseService.deleteNote(note.id);
            await AsyncStorage.clear();
            Alert.alert('Data cleared', 'All data has been deleted');
          },
        },
      ]
    );
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={{ backgroundColor: colors.surface, marginTop: spacing[4], paddingHorizontal: spacing[4], borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border }}>
      <Text style={{ fontSize: 10, fontWeight: '600', color: colors.textLight, paddingVertical: spacing[3], textTransform: 'uppercase' }}>{title}</Text>
      {children}
    </View>
  );

  const Row = ({ label, value, onPress, isSwitch, switchValue, onSwitchChange }: any) => (
    <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing[3], borderTopWidth: 1, borderColor: colors.border }} onPress={onPress} disabled={!onPress}>
      <Text style={{ fontSize: 16, color: colors.text }}>{label}</Text>
      {isSwitch ? (
        <Switch value={switchValue} onValueChange={onSwitchChange} trackColor={{ false: colors.border, true: colors.primary }} />
      ) : (
        <Text style={{ fontSize: 16, color: colors.textLight }}>{value}</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ backgroundColor: colors.background, paddingTop: insets.top + spacing[4] }}>
      <View style={{ paddingHorizontal: spacing[5] }}>
        <Text style={[typography.heading1]}>Settings</Text>
        <Row label="Dark Mode" value={theme === 'dark' ? 'On' : 'Off'} onPress={toggleTheme} />
      </View>

      <Section title="Privacy & Security">
        <Row label="Biometric Lock" isSwitch switchValue={biometricEnabled} onSwitchChange={async (value) => {
          setBiometricEnabled(value);
          await AsyncStorage.setItem('biometricEnabled', String(value));
        }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing[3], borderTopWidth: 1, borderColor: colors.border }}>
          <View>
            <Text style={{ fontSize: 16, color: colors.text }}>Vault PIN</Text>
            <Text style={{ fontSize: 14, color: colors.textLight }}>{pinSet ? 'Configured' : 'Not set'}</Text>
          </View>
          <TouchableOpacity onPress={() => setPinModalVisible(true)}>
            <Text style={{ color: colors.primary, fontWeight: '600' }}>{pinSet ? 'Change' : 'Set'}</Text>
          </TouchableOpacity>
        </View>
        {pinSet && (
          <TouchableOpacity style={{ paddingVertical: spacing[3], borderTopWidth: 1, borderColor: colors.border }} onPress={removePin}>
            <Text style={{ fontSize: 16, color: colors.error }}>Remove PIN</Text>
          </TouchableOpacity>
        )}
        {pinModalVisible && (
          <View style={{ backgroundColor: colors.background, marginTop: spacing[4], padding: spacing[4], borderRadius: borderRadius.md, borderWidth: 1, borderColor: colors.border }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: colors.text, marginBottom: spacing[2] }}>{pinSet ? 'Change Vault PIN' : 'Set Vault PIN'}</Text>
            <TextInput
              style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing[4], paddingVertical: spacing[3], color: colors.text, marginBottom: spacing[3] }}
              placeholder="Enter PIN"
              placeholderTextColor="#999"
              secureTextEntry
              keyboardType="numeric"
              value={pinValue}
              onChangeText={setPinValue}
            />
            <TextInput
              style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, borderRadius: borderRadius.md, paddingHorizontal: spacing[4], paddingVertical: spacing[3], color: colors.text, marginBottom: spacing[3] }}
              placeholder="Confirm PIN"
              placeholderTextColor="#999"
              secureTextEntry
              keyboardType="numeric"
              value={confirmPinValue}
              onChangeText={setConfirmPinValue}
            />
            {pinMessage ? <Text style={{ fontSize: 14, color: colors.error, marginBottom: spacing[3] }}>{pinMessage}</Text> : null}
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity style={{ marginRight: spacing[3] }} onPress={() => {
                setPinModalVisible(false);
                setPinValue('');
                setConfirmPinValue('');
                setPinMessage('');
              }}>
                <Text style={{ color: colors.text }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{ backgroundColor: colors.primary, paddingHorizontal: spacing[4], paddingVertical: spacing[2], borderRadius: borderRadius.md }} onPress={savePin}>
                <Text style={{ color: colors.surface, fontWeight: '600' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Section>

      <Section title="AI & Organization">
        <Row label="Auto-Tagging" isSwitch switchValue={autoTagging} onSwitchChange={async (value) => {
          setAutoTagging(value);
          await AsyncStorage.setItem('autoTagging', String(value));
        }} />
        <Row label="Haptics" isSwitch switchValue={hapticsEnabled} onSwitchChange={async (value) => {
          setHapticsEnabled(value);
          await AsyncStorage.setItem('hapticsEnabled', String(value));
        }} />
      </Section>

      <Section title="Data Management">
        <Row label="Export Data" value="→" onPress={exportData} />
        <Row label="Replay Onboarding" value="→" onPress={replayOnboarding} />
        <Row label="Storage Used" value={storageSize} />
      </Section>

      <Section title="About">
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing[3], borderTopWidth: 1, borderColor: colors.border }} onPress={clearAllData}>
          <Text style={{ fontSize: 16, color: colors.error }}>Clear All Data</Text>
          <Icon name="alert-triangle" size={20} color={colors.error} />
        </TouchableOpacity>
        // becomes:
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: spacing[3], borderTopWidth: 1, borderColor: colors.border }} onPress={clearAllData}>
          <Text style={{ fontSize: 16, color: colors.error }}>Clear All Data</Text>
          <Icon name="alert-triangle" size={20} color={colors.error} />
        </TouchableOpacity>
        <Icon name="alert-triangle" size={20} color={colors.error} />
        <Icon name={"alert-triangle" as any} size={20} color={colors.error} />
        <Row label="Version" value="1.0.0" />
      </Section>

      <View style={{ height: insets.bottom + 20 }} />
    </ScrollView>
  );
};