import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { campusGraph } from '../data/graph';

const { width } = Dimensions.get('window');

export default function QRScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const navigation = useNavigation<any>();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-outline" size={64} color="#3b82f6" />
        <Text style={styles.permissionText}>Camera access is required to scan room codes.</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.grantBtn}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    // 1. Find the node in your campusGraph
    const targetNode = campusGraph.nodes.find(n => n.id === data);

    if (targetNode) {
      // ✅ Option A: Format the ID into a readable name
      // Example: 'f1_classroom_3' -> 'Classroom 3'
      const readableName = targetNode.id
        .split('_')
        .slice(1)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      // 2. Navigate to Map with the standard parameters
      navigation.navigate('FloorMap', {
        nodeId: targetNode.id,
        destination: readableName,
        floor: targetNode.floor
      });
    } else {
      Alert.alert("Invalid QR", "This room code was not found in the SBU database.", [
        { text: "Try Again", onPress: () => setScanned(false) }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      
      {/* Scanner UI Overlay */}
      <View style={styles.overlayContainer}>
        <View style={styles.scannerFrame} />
        <Text style={styles.instructionText}>Center the Room QR Code inside the square</Text>
      </View>

      <TouchableOpacity 
        style={styles.backBtn} 
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center' },
  permissionText: { color: '#333', textAlign: 'center', marginHorizontal: 40, marginTop: 20, fontSize: 16 },
  grantBtn: { marginTop: 20, backgroundColor: '#3b82f6', paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
  overlayContainer: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  scannerFrame: { width: 250, height: 250, borderWidth: 2, borderColor: '#3b82f6', backgroundColor: 'transparent', borderRadius: 20 },
  instructionText: { color: '#fff', marginTop: 20, fontSize: 14, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.6)', padding: 10, borderRadius: 8 },
  backBtn: { position: 'absolute', top: 50, left: 20, backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 25 },
  btnText: { color: '#fff', fontWeight: 'bold' }
});