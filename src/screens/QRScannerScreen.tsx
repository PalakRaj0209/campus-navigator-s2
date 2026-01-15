import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function QRScannerScreen() {
  const navigation = useNavigation<any>();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Camera access needed for location codes</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.btn}>
          <Text style={styles.btnText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);

    try {
      let nodeId = data;
      let floor = 0;

      // Handle JSON format: {"id": "f0_entry", "floor": 0}
      if (data.startsWith("{")) {
        const parsed = JSON.parse(data);
        nodeId = parsed.id || parsed.nodeId;
        floor = parsed.floor || 0;
      }

      console.log("📍 QR Scanned:", nodeId, "Floor:", floor);

      Alert.alert("Location Found!", `Starting from: ${nodeId}`, [
        {
          text: "Start Navigation",
          onPress: () => {
            navigation.navigate("FloorMap", {
              startNodeId: nodeId,
              floor: floor
            });
          }
        },
        { text: "Cancel", style: 'cancel', onPress: () => setScanned(false) }
      ]);

    } catch (e) {
      Alert.alert("Error", "Invalid QR Code. Try again.");
      setScanned(false);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
      />
      
      <View style={styles.overlay}>
        <View style={styles.scanFrame} />
        <Text style={styles.instruction}>Scan Campus Location Code</Text>
      </View>

      <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="close" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  text: { color: 'white', fontSize: 16, textAlign: 'center', marginTop: 100 },
  btn: { backgroundColor: '#6366f1', padding: 15, borderRadius: 10, marginHorizontal: 40 },
  btnText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
  
  overlay: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scanFrame: { 
    width: 250, height: 250, 
    borderWidth: 3, borderColor: '#6366f1', 
    borderRadius: 20 
  },
  instruction: { 
    marginTop: 20, color: 'white', fontSize: 18, fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.7)', padding: 12, borderRadius: 10 
  },
  closeBtn: { 
    position: 'absolute', top: 60, right: 20, 
    padding: 12, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 25 
  },
});
