import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity, SafeAreaView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { campusGraph } from '../data/graph';

// ✅ EXHAUSTIVE LIST: Every node from your campusGraph.ts
const allCampusRooms = [
  // --- FLOOR 0 (Ground Floor) ---
  { id: 'f0_principal', name: 'Principal Office', dept: 'Admin', sub: 'Main Admin • Floor 0' },
  { id: 'f0_hod_1', name: 'HOD 1', dept: 'Academic', sub: 'Dept Head • Floor 0' },
  { id: 'f0_hod_2', name: 'HOD 2', dept: 'Academic', sub: 'Dept Head • Floor 0' },
  { id: 'f0_hod_3', name: 'HOD 3', dept: 'Academic', sub: 'Dept Head • Floor 0' },
  { id: 'f0_hod_4', name: 'HOD 4', dept: 'Academic', sub: 'Dept Head • Floor 0' },
  { id: 'f0_main_office', name: 'Main Office', dept: 'Admin', sub: 'General Office • Floor 0' },
  { id: 'f0_model_pharmacy', name: 'Model Pharmacy', dept: 'Academic', sub: 'Lab Area • Floor 0' },
  { id: 'f0_machine_room', name: 'Machine Room', dept: 'Academic', sub: 'Technical Lab • Floor 0' },
  { id: 'f0_instrument_room', name: 'Central Instrumental Room', dept: 'Academic', sub: 'Research Lab • Floor 0' },
  { id: 'f0_animal_house', name: 'Animal House', dept: 'Academic', sub: 'Facility • Floor 0' },
  { id: 'f0_store_big', name: 'Store (Big)', dept: 'Admin', sub: 'Storage • Floor 0' },
  { id: 'f0_store_1', name: 'Store 1', dept: 'Admin', sub: 'Storage • Floor 0' },
  { id: 'f0_store_2', name: 'Store 2', dept: 'Admin', sub: 'Storage • Floor 0' },
  { id: 'f0_gents_toilet', name: 'Gents Toilet', dept: 'Admin', sub: 'Restroom • Floor 0' },
  { id: 'f0_ladies_toilet', name: 'Ladies Toilet', dept: 'Admin', sub: 'Restroom • Floor 0' },
  { id: 'f0_lifts', name: 'Lifts', dept: 'Admin', sub: 'Elevator Area • Floor 0' },
  { id: 'f0_stairs_bottom', name: 'Stairs (Entrance)', dept: 'Admin', sub: 'Transition • Floor 0' },
  { id: 'f0_stairs_top', name: 'Stairs (Far End)', dept: 'Admin', sub: 'Transition • Floor 0' },

  // --- FLOOR 1 (First Floor) ---
  { id: 'f1_classroom_1', name: 'Classroom 1', dept: 'Academic', sub: 'Lecture Hall • Floor 1' },
  { id: 'f1_classroom_2', name: 'Classroom 2', dept: 'Academic', sub: 'Lecture Hall • Floor 1' },
  { id: 'f1_classroom_3', name: 'Classroom 3', dept: 'Academic', sub: 'Lecture Hall • Floor 1' },
  { id: 'f1_classroom_4', name: 'Classroom 4', dept: 'Academic', sub: 'Lecture Hall • Floor 1' },
  { id: 'f1_classroom_5', name: 'Classroom 5', dept: 'Academic', sub: 'Lecture Hall • Floor 1' },
  { id: 'f1_classroom_6', name: 'Classroom 6', dept: 'Academic', sub: 'Lecture Hall • Floor 1' },
  { id: 'f1_classroom_7', name: 'Classroom 7', dept: 'Academic', sub: 'Lecture Hall • Floor 1' },
  { id: 'f1_girls_common', name: 'Girls Common Room', dept: 'Academic', sub: 'Student Facility • Floor 1' },
  { id: 'f1_store', name: 'First Floor Store', dept: 'Admin', sub: 'Storage • Floor 1' },
  { id: 'f1_gents_toilet', name: 'Gents Toilet F1', dept: 'Admin', sub: 'Restroom • Floor 1' },
  { id: 'f1_ladies_toilet', name: 'Ladies Toilet F1', dept: 'Admin', sub: 'Restroom • Floor 1' },
  { id: 'f1_lifts', name: 'Lifts F1', dept: 'Admin', sub: 'Elevator • Floor 1' },
  { id: 'f1_stairs_bottom', name: 'Stairs (Entrance Side)', dept: 'Admin', sub: 'Transition • Floor 1' },
  { id: 'f1_stairs_top', name: 'Stairs (Far Side)', dept: 'Admin', sub: 'Transition • Floor 1' },
];

export default function PeopleScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');

  // ✅ DYNAMIC GOOGLE-STYLE SEARCH FILTER
  const filteredData = allCampusRooms.filter(item => {
    const matchesTab = activeTab === 'All' || item.dept === activeTab;
    const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase()) || 
                          item.sub.toLowerCase().includes(search.toLowerCase()) ||
                          item.id.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleNavigate = (nodeId: string, name: string) => {
    const node = campusGraph.nodes.find(n => n.id === nodeId);
    navigation.navigate('FloorMap', { 
      nodeId, 
      floor: node?.floor || 0, 
      destination: name 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.headerTitle}>Campus Directory</Text>
        
        {/* Dynamic Search Bar */}
        <View style={styles.searchBox}>
          <Ionicons name="search" size={20} color="#999" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="Search by room, floor, or ID..." 
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Ionicons name="close-circle" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        </View>

        {/* Tab Filters */}
        <View style={styles.chipRow}>
          {['All', 'Academic', 'Admin'].map((tab) => (
            <TouchableOpacity 
              key={tab} 
              onPress={() => setActiveTab(tab)} 
              style={[styles.chip, activeTab === tab && styles.activeChip]}
            >
              <Text style={[styles.chipText, activeTab === tab && styles.activeText]}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={{ marginTop: 50, alignItems: 'center' }}>
              <Text style={{ color: '#999' }}>No locations found for "{search}"</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.listItem} 
              onPress={() => handleNavigate(item.id, item.name)}
            >
              <View style={styles.listAvatar}>
                <Ionicons 
                    name={item.dept === 'Admin' ? 'business' : 'school'} 
                    size={24} 
                    color="#5e5ce6" 
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.listTitle}>{item.name}</Text>
                <Text style={styles.listBlock}>{item.dept.toUpperCase()} BLOCK • {item.id}</Text>
                <Text style={styles.listSub}>{item.sub}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 20, flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, marginTop: Platform.OS === 'android' ? 30 : 0 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f5f5f7', borderRadius: 15, padding: 12, marginBottom: 20 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  chipRow: { flexDirection: 'row', marginBottom: 20 },
  chip: { paddingHorizontal: 22, paddingVertical: 10, borderRadius: 25, borderWidth: 1, borderColor: '#eee', marginRight: 10 },
  activeChip: { backgroundColor: '#5e5ce6', borderColor: '#5e5ce6' },
  activeText: { color: 'white', fontWeight: 'bold' },
  chipText: { color: '#666', fontSize: 14 },
  listItem: { flexDirection: 'row', alignItems: 'center', padding: 15, backgroundColor: '#fff', borderRadius: 15, marginBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  listAvatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#f0f4ff', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  listTitle: { fontSize: 17, fontWeight: 'bold', color: '#1a1a1a' },
  listBlock: { fontSize: 10, color: '#999', fontWeight: 'bold', marginTop: 2 },
  listSub: { fontSize: 13, color: '#5e5ce6', marginTop: 3 },
});