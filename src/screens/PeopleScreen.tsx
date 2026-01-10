import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, 
  TouchableOpacity, SafeAreaView, Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// IMPORT: Connect to your SQLite database
import { getAllPersonnel, Person } from '../db/database';

export default function PeopleScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [staffData, setStaffData] = useState<Person[]>([]);

  // FETCH DATA: Load from DB on component mount
  useEffect(() => {
    const data = getAllPersonnel();
    setStaffData(data);
  }, []);

  // Filter Logic: Filters by Name, Office, and Building Category
  const filteredData = staffData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(search.toLowerCase()) || 
      item.office.toLowerCase().includes(search.toLowerCase());
    
    const matchesFilter = 
      activeFilter === 'All' || 
      (activeFilter === 'Academic' && item.building.toLowerCase().includes('academic')) ||
      (activeFilter === 'Admin' && item.building.toLowerCase().includes('admin'));
    
    return matchesSearch && matchesFilter;
  });

  const renderPerson = ({ item }: { item: Person }) => (
    <TouchableOpacity 
      style={styles.personCard}
      onPress={() => navigation.navigate('FloorMap', { 
        destination: item.name,
        room: item.office,
        floor: item.floor 
      })}
    >
      <View style={styles.avatar}>
        <Ionicons name="person" size={24} color="#6366f1" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.buildingLabel}>{item.building.toUpperCase()}</Text>
        <Text style={styles.location}>{item.office} • Floor {item.floor}</Text>
      </View>
      <View style={styles.navIcon}>
        <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Campus Directory</Text>
      </View>
      
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8e8e93" />
        <TextInput 
          style={styles.input} 
          placeholder="Search for staff or admin..."
          placeholderTextColor="#8e8e93"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Ionicons name="close-circle" size={20} color="#8e8e93" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Filters */}
      <View style={styles.chipWrapper}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['All', 'Academic', 'Admin']}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.chipList}
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => setActiveFilter(item)}
              style={[styles.chip, item === activeFilter && styles.activeChip]}
            >
              <Text style={[styles.chipText, item === activeFilter && styles.activeChipText]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Directory List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={renderPerson}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={50} color="#E5E7EB" />
            <Text style={styles.emptyStateText}>No staff found matching "{search}"</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6'
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#111827' },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    paddingHorizontal: 15, 
    height: 52, 
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
      android: { elevation: 2 }
    })
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: '#1F2937' },
  chipWrapper: { marginBottom: 15 },
  chipList: { paddingHorizontal: 20 },
  chip: { 
    paddingHorizontal: 20, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: '#fff', 
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  activeChip: { backgroundColor: '#6366f1', borderColor: '#6366f1' },
  chipText: { color: '#6B7280', fontSize: 14, fontWeight: '600' },
  activeChipText: { color: '#fff' },
  listContent: { paddingHorizontal: 20, paddingBottom: 100 },
  personCard: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    backgroundColor: '#fff', 
    borderRadius: 16, 
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    elevation: 1
  },
  avatar: { 
    width: 52, 
    height: 52, 
    borderRadius: 26, 
    backgroundColor: '#EEF2FF', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  info: { flex: 1, marginLeft: 15 },
  name: { fontSize: 16, fontWeight: '700', color: '#111827' },
  buildingLabel: { fontSize: 10, color: '#9CA3AF', fontWeight: 'bold', marginTop: 2, letterSpacing: 0.5 },
  location: { fontSize: 13, color: '#6366f1', fontWeight: '600', marginTop: 2 },
  navIcon: { padding: 5 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyStateText: { color: '#9CA3AF', fontSize: 16, marginTop: 10 }
});