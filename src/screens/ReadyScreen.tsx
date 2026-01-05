import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { startStepCounter } from '../services/stepCounter';
import { useAppStore } from '../stores/appStore';
import { useNavigation } from '@react-navigation/native';
import { getPersonByName } from '../db/database';


const { width, height } = Dimensions.get('window');

export default function ReadyScreen() {
  const [sensorData, setSensorData] = useState({ x: 0, y: 0, z: 0 });
  const { setPosition } = useAppStore();
  const [steps, setSteps] = useState(0);
  const navigation = useNavigation() as any;

 useEffect(() => {
  const cleanup = startStepCounter(setSteps);
  return cleanup;  // Proper cleanup
}, []);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎉 CAMPUS NAVIGATOR</Text>
      <Text style={styles.subtitle}>READY!</Text>
      <Text style={styles.instruction}>Shake - Check console</Text>
      <Text style={styles.status}>Sensors: Working ✅</Text>
      <Text style={styles.steps}>Steps: {steps}</Text>

      <TouchableOpacity style={styles.mapButton} onPress={() => (navigation as any).navigate('FloorMap')}>
      <Text style={styles.mapText}>🗺️ View Map</Text>
    </TouchableOpacity>
    
    <TouchableOpacity style={styles.mapButton} onPress={() => (navigation as any).navigate('RouteView')}>
      <Text style={styles.mapText}>🚀 View Route</Text>
    </TouchableOpacity>

    <TouchableOpacity 
        style={[styles.mapButton, { backgroundColor: '#FF9500', marginTop: 10 }]} 
        onPress={async () => {
          console.log('🔍 Searching Dean...');
          const dean = await getPersonByName('Dr. Aris'); // Search name from seedDB
          console.log('✅ FOUND:', dean);
          if (dean) alert(`Found: ${dean.name}\nOffice: ${dean.office}`);
          else alert('Dean not found!');
        }}>
        <Text style={styles.mapText}>🧑‍💼 Test DB Search</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a23',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#60a5fa',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 28,
    color: '#fff',
    marginBottom: 40,
  },
  instruction: {
    fontSize: 18,
    color: '#a0a0a0',
    marginBottom: 20,
  },
  status: {
    fontSize: 20,
    color: '#10b981',
    fontWeight: 'bold',
  },
  steps: {
  fontSize: 24,
  color: '#10b981',
  fontWeight: 'bold',
  marginTop: 20,
},
mapButton: {
  backgroundColor: '#10b981',
  padding: 15,
  borderRadius: 10,
  marginTop: 20,
},
mapText: {
  color: 'white',
  fontSize: 18,
  fontWeight: 'bold',
},


});
