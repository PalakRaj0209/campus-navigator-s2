import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// IMPORT: Connect to the global store to save the building choice
import { useAppStore } from '../stores/appStore';

export default function BuildingSelectorScreen() {
  const navigation = useNavigation<any>();
  const { setBuilding } = useAppStore();

  const [campus, setCampus] = useState('NIT Rourkela');
  const [selectedBuilding, setSelectedBuilding] = useState('Academic Block');

  const onNext = () => {
    // 1. Save selection to global store
    setBuilding(selectedBuilding);
    
    // 2. ✅ UPDATE: Navigate to 'Main' (The Tab Navigator)
    // Using .replace ensures the user can't "back" into this screen
    navigation.replace('Main'); 
  };

  const onSkip = () => {
    setBuilding(''); 
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* SKIP BUTTON */}
      <TouchableOpacity style={styles.skipContainer} onPress={onSkip}>
        <Text style={styles.skipText}>Skip</Text>
        <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
      </TouchableOpacity>

      <View style={styles.header}>
        <View style={styles.iconCircle}>
          <Ionicons name="business" size={32} color="#6366f1" />
        </View>
        <Text style={styles.headerTitle}>Campus Navigator</Text>
        <Text style={styles.headerSubtitle}>Select your current location</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.label}>Choose Campus</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={campus}
            onValueChange={(itemValue: string) => setCampus(itemValue)}
            style={styles.picker}
            dropdownIconColor="#6366f1"
          >
            <Picker.Item label="NIT Rourkela" value="NIT Rourkela" />
            <Picker.Item label="IIT Kharagpur" value="IIT Kharagpur" />
          </Picker>
        </View>

        <Text style={styles.label}>Choose Building</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedBuilding}
            onValueChange={(itemValue: string) => setSelectedBuilding(itemValue)}
            style={styles.picker}
            dropdownIconColor="#6366f1"
          >
            <Picker.Item label="Academic Block" value="Academic Block" />
            <Picker.Item label="Admin Block" value="Admin Block" />
            <Picker.Item label="Main Building" value="Main Building" />
          </Picker>
        </View>

        <TouchableOpacity style={styles.nextButton} onPress={onNext} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Start Navigating</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" style={{marginLeft: 10}} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  skipContainer: { 
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 60 : 40, 
    right: 20, 
    flexDirection: 'row', 
    alignItems: 'center',
    zIndex: 10 
  },
  skipText: { 
    fontSize: 16, 
    color: '#8E8E93', 
    fontWeight: '500',
    marginRight: 2
  },
  header: { marginTop: 100, alignItems: 'center', marginBottom: 40 },
  iconCircle: {
    width: 64, height: 64, borderRadius: 32, backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#1a1a1a' },
  headerSubtitle: { fontSize: 15, color: '#8E8E93', marginTop: 5 },
  content: { paddingHorizontal: 25 },
  label: { fontSize: 12, fontWeight: '700', color: '#6B7280', marginBottom: 8, marginTop: 20, textTransform: 'uppercase', letterSpacing: 1 },
  pickerWrapper: { 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: '#E5E5EA', 
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 }
  },
  picker: { 
    height: Platform.OS === 'ios' ? 200 : 55, 
    width: '100%' 
  },
  nextButton: { 
    backgroundColor: '#6366f1', 
    flexDirection: 'row',
    paddingVertical: 18, 
    borderRadius: 16, 
    marginTop: 40, 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});