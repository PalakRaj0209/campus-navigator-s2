import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  ScrollView, 
  TouchableOpacity, 
  Platform, 
  Modal 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// 1. IMPORT: Components, Database, and Store
import ChatbotScreen from './ChatbotScreen'; 
import { getAllPersonnel, Person } from '../db/database';
import { useAppStore } from '../stores/appStore';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  
  // Get the building state from your store
  const { building } = useAppStore(); 
  
  const [searchQuery, setSearchQuery] = useState('');
  const [chatVisible, setChatVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);

  // 2. LOGIC: Fetch suggestions based on building selection
  useEffect(() => {
    const data = getAllPersonnel();
    
    // If building is empty or 'Whole Campus' (User clicked Skip), show all data
    if (!building || building.trim() === '' || building === 'Whole Campus') {
      setSuggestions(data.slice(0, 4));
    } else {
      // Show suggestions specifically for the selected building
      const buildingSpecific = data.filter(p => p.building === building);
      setSuggestions(buildingSpecific.length > 0 ? buildingSpecific.slice(0, 4) : data.slice(0, 4));
    }
  }, [building]);

  const filteredData = suggestions.filter((item) => {
    const query = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(query) || 
      item.role?.toLowerCase().includes(query) ||
      item.office.toLowerCase().includes(query)
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={[
          styles.scrollContent, 
          { paddingTop: insets.top + 20, paddingBottom: 100 }
        ]}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <Ionicons name="business" size={32} color="#6366f1" />
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Campus Navigator</Text>
            
            {/* 3. Logic: ONLY show this row if building is NOT empty and NOT 'Whole Campus' */}
            {building && building.trim() !== '' && building !== 'Whole Campus' && (
              <View style={styles.locationRow}>
                 <Ionicons name="location" size={12} color="#6366f1" />
                 <Text style={styles.locationText}>{building}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Search Bar Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#8e8e93" style={styles.searchIcon} />
            <TextInput 
              placeholder="Search room, department, or person" 
              style={styles.searchInput}
              placeholderTextColor="#8e8e93"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCapitalize="none"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#8e8e93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
            {searchQuery ? `Results for "${searchQuery}"` : "Suggested people & places"}
            </Text>
            {!searchQuery && (
                <TouchableOpacity onPress={() => navigation.navigate('People')}>
                    <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
            )}
        </View>

        {/* Cards Grid */}
        <View style={styles.grid}>
          {filteredData.length > 0 ? (
            filteredData.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card}
                onPress={() => navigation.navigate("FloorMap", { 
                  destination: item.name, 
                  room: item.office,
                  floor: item.floor 
                })}
              >
                <View style={styles.iconCircle}>
                  <Ionicons 
                    name={item.role?.toLowerCase().includes('office') ? "location" : "person"} 
                    size={20} 
                    color="#6366f1" 
                  />
                </View>
                <Text style={styles.roleLabel}>{item.role?.toUpperCase() || 'MEMBER'}</Text>
                <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cardLoc}>{item.office}</Text>
              </TouchableOpacity>
            ))
          ) : (
            <View style={styles.noResult}>
              <Text style={styles.noResultText}>No matches found.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity 
        style={[styles.fab, { bottom: insets.bottom + 20 }]} 
        onPress={() => setChatVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </TouchableOpacity>

      {/* AI Chat Modal */}
      <Modal 
        visible={chatVisible} 
        animationType="slide" 
        transparent={true}
        onRequestClose={() => setChatVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setChatVisible(false)}
        >
          <View style={styles.chatSheet}>
            <View style={styles.dragHandle} />
            <ChatbotScreen onClose={() => setChatVisible(false)} />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 100 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  headerTextContainer: { marginLeft: 12 },
  headerTitle: { fontSize: 26, fontWeight: 'bold', color: '#1a1a1a' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  locationText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  searchSection: { marginBottom: 30 },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: '#000' },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#4B5563' },
  viewAll: { color: '#6366f1', fontWeight: '700', fontSize: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: { 
    width: '48%', 
    backgroundColor: '#fff', 
    borderRadius: 20, 
    padding: 15, 
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#EEF2FF', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  roleLabel: { fontSize: 9, color: '#9CA3AF', fontWeight: 'bold', letterSpacing: 0.5, marginBottom: 4 },
  cardName: { fontSize: 15, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 },
  cardLoc: { fontSize: 12, color: '#6366f1' },
  noResult: { width: '100%', padding: 40, alignItems: 'center' },
  noResultText: { color: '#9CA3AF', fontSize: 16 },
  fab: { 
    position: 'absolute', 
    right: 20, 
    width: 65, 
    height: 65, 
    borderRadius: 32.5, 
    backgroundColor: '#6366f1', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 }
  },
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'flex-end' 
  },
  chatSheet: {
    height: '50%', 
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
    elevation: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5
  },
});