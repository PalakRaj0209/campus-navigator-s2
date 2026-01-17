import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
 
export default function SafetyScreen() {
  const navigation = useNavigation<any>();
 
  const handleSOS = () => {
    Alert.alert(
      "Emergency SOS",
      "Are you sure you want to trigger a campus-wide alert? This will share your location with Security.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "YES, TRIGGER", style: "destructive", onPress: () => console.log("SOS Triggered") }
      ]
    );
  };
 
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Campus Safety</Text>
        <View style={{ width: 40 }} />
      </View>
 
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Emergency Actions</Text>
       
        {/* 1. SOS Button */}
        <TouchableOpacity
          style={styles.sosButton}
          activeOpacity={0.8}
          onPress={handleSOS}
        >
          <View style={styles.sosIconCircle}>
            <Ionicons name="alert-circle" size={50} color="white" />
          </View>
          <Text style={styles.sosText}>Trigger SOS</Text>
          <Text style={styles.sosSubtext}>Notifies Campus Security immediately</Text>
        </TouchableOpacity>
 
        {/* 2. Emergency Exit - Navigation via useNavigation */}
   
<TouchableOpacity
  style={styles.exitButton}
  onPress={() => {
    // Logic: If user is on F1, they must go to stairs first.
    // For simplicity, we send them to the 'f0_exit_main'
    // and let the FloorMapScreen handle the floor transition.
    navigation.navigate("FloorMap", {
      nodeId: "f0_exit_main",
      destination: "Nearest Emergency Exit",
      type: "emergency"
    });
  }}
>
          <View style={styles.iconBox}>
            <Ionicons name="exit" size={28} color="#FF9500" />
          </View>
          <View style={styles.exitTextContainer}>
            <Text style={styles.exitTitle}>Emergency Exit</Text>
            <Text style={styles.exitSubtitle}>Find nearest safe exit route</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </TouchableOpacity>
 
        {/* 3. Security Info Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="call" size={20} color="#6366f1" />
            <Text style={styles.infoLabel}>SECURITY HELPLINE</Text>
          </View>
          <Text style={styles.infoNumber}>+91 999 888 7777</Text>
          <Text style={styles.infoSub}>Available 24/7 for campus assistance</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6'
  },
  backBtn: { padding: 5 },
  headerText: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  content: { padding: 25, flex: 1, justifyContent: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1, marginBottom: 20, textTransform: 'uppercase' },
  sosButton: {
    backgroundColor: '#FF3B30',
    padding: 40,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#FF3B30',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8
  },
  sosIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15
  },
  sosText: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  sosSubtext: { color: 'rgba(255,255,255,0.8)', fontSize: 13, marginTop: 5 },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF9F2',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFE5CC',
    marginBottom: 30
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },
  exitTextContainer: { flex: 1, marginLeft: 15 },
  exitTitle: { fontSize: 18, fontWeight: 'bold', color: '#FF9500' },
  exitSubtitle: { fontSize: 13, color: '#8E8E93' },
  infoCard: {
    backgroundColor: '#F8F9FA',
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  infoLabel: { fontSize: 12, color: '#6366f1', fontWeight: 'bold', letterSpacing: 0.5 },
  infoNumber: { fontSize: 26, fontWeight: 'bold', color: '#1F2937' },
  infoSub: { fontSize: 13, color: '#6B7280', marginTop: 5 }
});  