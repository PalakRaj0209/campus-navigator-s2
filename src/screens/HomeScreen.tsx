import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, Modal, Platform, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { CameraView, useCameraPermissions } from 'expo-camera'; 
import { campusGraph } from '../data/graph';

// Your core suggested cards
const homeCards = [
  { id: 'f0_principal', title: 'Principal', role: 'ADMINISTRATION', room: 'Principal Room' },
  { id: 'f0_hod_1', title: 'HOD 1', role: 'DEPT HEAD', room: 'HOD-1' },
  { id: 'f0_hod_2', title: 'HOD 2', role: 'DEPT HEAD', room: 'HOD-2' },
  { id: 'f0_hod_3', title: 'HOD 3', role: 'DEPT HEAD', room: 'HOD-3' },
  { id: 'f0_main_office', title: 'Office', role: 'ADMINISTRATION', room: 'Main Office' },
  { id: 'f0_animal_house', title: 'Animal House', role: 'LABORATORY', room: 'Animal House' },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [permission, requestPermission] = useCameraPermissions(); 
  const [scannerVisible, setScannerVisible] = useState(false);

  // ✅ DYNAMIC SEARCH FILTER
  const filteredCards = homeCards.filter(card => 
    card.title.toLowerCase().includes(search.toLowerCase()) || 
    card.role.toLowerCase().includes(search.toLowerCase()) ||
    card.room.toLowerCase().includes(search.toLowerCase())
  );

  const handleNavigate = (nodeId: string, name: string) => {
    const node = campusGraph.nodes.find(n => n.id === nodeId);
    if (node) {
      navigation.navigate('FloorMap', { nodeId, floor: node.floor, destination: name });
    }
  };

  const onBarcodeScanned = ({ data }: { data: string }) => {
    // 1. Immediate UI Feedback
    setScannerVisible(false);

    // 2. Safety Clean: Handle JSON or Plain Text
    let cleanedData = data.toString().trim();
    
    // ✅ FEATURE: Smart JSON Parsing for {"id": "..."}
    if (cleanedData.startsWith('{')) {
      try {
        const parsed = JSON.parse(cleanedData);
        if (parsed.id) cleanedData = parsed.id;
      } catch (e) {
        console.warn("Invalid JSON, using raw string");
      }
    }
    
    cleanedData = cleanedData.toLowerCase();

    // 3. Robust Search: Ignore case when matching against graph IDs
    const node = campusGraph.nodes.find(n => n.id.toLowerCase() === cleanedData);
    
    if (node) {
      // ✅ SUCCESS: Generate a friendly name from the ID
      const formattedName = node.id
        .split('_')
        .slice(1)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      handleNavigate(node.id, formattedName);
    } else {
      // ✅ DEBUGGING ALERT: Shows exactly what the camera "sees"
      Alert.alert(
        "Location Not Found",
        `Scanned: "${cleanedData}"\n\nEnsure your QR code matches an ID in graph.ts (e.g., f0_principal)`,
        [{ text: "Try Again", onPress: () => setScannerVisible(true) }]
      );
    }
  };

  const openScanner = async () => {
    const { granted } = await requestPermission();
    if (granted) setScannerVisible(true);
    else alert("Camera permission is required to scan QR codes.");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="office-building" size={32} color="#5e5ce6" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.title}>Campus Navigator</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Ionicons name="location" size={14} color="#5e5ce6" />
              <Text style={styles.subtitle}> Academic Block</Text>
            </View>
          </View>
        </View>

        {/* ✅ DYNAMIC GOOGLE-STYLE SEARCH BAR */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search room, department, or person" 
            value={search}
            onChangeText={setSearch} 
            placeholderTextColor="#999"
          />
          {search.length > 0 ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={22} color="#ccc" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={openScanner}>
              <Ionicons name="qr-code-outline" size={24} color="#5e5ce6" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {search.length > 0 ? 'Search Results' : 'Suggested people & places'}
          </Text>
          {search.length === 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('People')}>
              <Text style={{ color: '#5e5ce6' }}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        <FlatList
          data={filteredCards}
          numColumns={2}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color="#ddd" />
              <Text style={styles.emptyText}>No results for "{search}"</Text>
              <TouchableOpacity 
                style={styles.directoryBtn}
                onPress={() => navigation.navigate('People')}
              >
                <Text style={styles.directoryBtnText}>Check Full Directory</Text>
              </TouchableOpacity>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleNavigate(item.id, item.title)}>
              <View style={styles.avatarCircle}>
                <Ionicons name="person" size={24} color="#5e5ce6" />
              </View>
              <Text style={styles.cardRole}>{item.role}</Text>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardRoom}>{item.room}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <Modal visible={scannerVisible} animationType="slide">
        <View style={styles.scannerContainer}>
          <CameraView 
            style={StyleSheet.absoluteFillObject} 
            onBarcodeScanned={onBarcodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          />
          
          {/* ✅ FEATURE: Scanner Visual Overlay */}
          <View style={styles.overlay}>
             <View style={styles.scannerFrame} />
             <Text style={styles.scanText}>Point at a Room QR Code</Text>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={() => setScannerVisible(false)}>
            <Text style={styles.closeBtnText}>Close Scanner</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <TouchableOpacity style={styles.fab}>
        <MaterialCommunityIcons name="chat-processing" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  title: { fontSize: 24, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#666' },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f7', borderRadius: 20, padding: 15, marginBottom: 25 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16, color: '#000' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#444' },
  card: { flex: 1, backgroundColor: '#fff', borderRadius: 20, padding: 15, margin: 8, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  avatarCircle: { width: 45, height: 45, borderRadius: 25, backgroundColor: '#f0f0ff', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  cardRole: { fontSize: 10, color: '#999', fontWeight: 'bold' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', marginVertical: 2 },
  cardRoom: { fontSize: 12, color: '#5e5ce6' },
  fab: { position: 'absolute', bottom: 30, right: 30, width: 60, height: 60, borderRadius: 30, backgroundColor: '#5e5ce6', justifyContent: 'center', alignItems: 'center', elevation: 5 },
  scannerContainer: { flex: 1, backgroundColor: '#000' },
  closeBtn: { position: 'absolute', bottom: 50, alignSelf: 'center', backgroundColor: '#5e5ce6', padding: 15, borderRadius: 10 },
  closeBtnText: { color: 'white', fontWeight: 'bold' },
  emptyContainer: { flex: 1, alignItems: 'center', marginTop: 40 },
  emptyText: { color: '#999', marginTop: 10, fontSize: 16 },
  directoryBtn: { marginTop: 20, backgroundColor: '#f0f0ff', padding: 12, borderRadius: 12 },
  directoryBtnText: { color: '#5e5ce6', fontWeight: 'bold' },
  
  overlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  scannerFrame: { width: 260, height: 260, borderWidth: 3, borderColor: '#5e5ce6', borderRadius: 30, backgroundColor: 'transparent' },
  scanText: { color: '#fff', marginTop: 20, fontWeight: 'bold', backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 }
});