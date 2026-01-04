import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppStore } from '../stores/appStore';

const mockRoute = [
  'Walk 15m straight ahead',
  'Turn Left at corridor junction',
  'Take stairs to Floor 2',
  'Dean office - Room O304 (50m)',
];

export default function RouteViewScreen() {
  const navigation = useNavigation();
  const { building, position } = useAppStore(); // Fixed: removed 'floor'

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Route to Dean Office</Text>
          <Text style={styles.distance}>2 min - 120m</Text>
          <Text style={styles.currentPos}>
            Current: {building} | Floor 1 | Pos: {position.x.toFixed(1)}, {position.y.toFixed(1)} {/* Fixed */}
          </Text>
        </View>

        {mockRoute.map((step, index) => (
          <View key={index} style={styles.stepContainer}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNum}>{index + 1}</Text>
            </View>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity
        style={styles.endButton}
        onPress={() => navigation.goBack()}>
        <Text style={styles.endButtonText}>End Navigation</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// styles remain the same...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    backgroundColor: '#007AFF',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  distance: {
    fontSize: 18,
    color: 'white',
    marginBottom: 5,
  },
  currentPos: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
  },
  stepContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNum: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  stepText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  endButton: {
    backgroundColor: '#FF3B30',
    padding: 18,
    margin: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  endButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});
