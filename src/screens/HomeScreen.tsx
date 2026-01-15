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

import ChatbotScreen from './ChatbotScreen';
import { getAllPersonnel, Person } from '../db/database';
import { useAppStore } from '../stores/appStore';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const { building } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [chatVisible, setChatVisible] = useState(false);
  const [suggestions, setSuggestions] = useState<Person[]>([]);

  useEffect(() => {
    const data = getAllPersonnel();

    if (!building || building === 'Whole Campus') {
      setSuggestions(data.slice(0, 4));
    } else {
      const filtered = data.filter(p => p.building === building);
      setSuggestions(filtered.length ? filtered.slice(0, 4) : data.slice(0, 4));
    }
  }, [building]);

  const filteredData = suggestions.filter(item => {
    const q = searchQuery.toLowerCase();
    return (
      item.name.toLowerCase().includes(q) ||
      item.office.toLowerCase().includes(q) ||
      item.role?.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: 120
        }}
      >
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="business" size={32} color="#6366f1" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.headerTitle}>Campus Navigator</Text>
            {building && building !== 'Whole Campus' && (
              <View style={styles.locationRow}>
                <Ionicons name="location" size={12} color="#6366f1" />
                <Text style={styles.locationText}>{building}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchSection}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#8e8e93" />
            <TextInput
              placeholder="Search room, department, or person"
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={20} color="#8e8e93" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Cards */}
        <View style={styles.grid}>
          {filteredData.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.card}
              onPress={() =>
                navigation.navigate('FloorMap', {
                  destination: item.name,
                  floor: item.floor
                })
              }
            >
              <View style={styles.iconCircle}>
                <Ionicons
                  name={
                    item.role?.toLowerCase().includes('office')
                      ? 'location'
                      : 'person'
                  }
                  size={20}
                  color="#6366f1"
                />
              </View>
              <Text style={styles.roleLabel}>
                {item.role?.toUpperCase() || 'MEMBER'}
              </Text>
              <Text style={styles.cardName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.cardLoc}>{item.office}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Chat FAB */}
      <TouchableOpacity
        style={[styles.fab, { bottom: insets.bottom + 20 }]}
        onPress={() => setChatVisible(true)}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="white" />
      </TouchableOpacity>

      {/* Chat Modal */}
      <Modal visible={chatVisible} animationType="slide" transparent>
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

/* ===== STYLES (UNCHANGED FROM YOUR ORIGINAL) ===== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: 25 },
  headerTitle: { fontSize: 26, fontWeight: 'bold' },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
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
    borderColor: '#E5E7EB'
  },
  searchInput: { flex: 1, marginLeft: 10 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  card: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#F3F4F6'
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center'
  },
  roleLabel: { fontSize: 9, color: '#9CA3AF', fontWeight: 'bold' },
  cardName: { fontSize: 15, fontWeight: 'bold' },
  cardLoc: { fontSize: 12, color: '#6366f1' },

  fab: {
    position: 'absolute',
    right: 20,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: '#6366f1',
    justifyContent: 'center',
    alignItems: 'center'
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
    borderTopRightRadius: 25
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    alignSelf: 'center',
    marginVertical: 10
  }
});
