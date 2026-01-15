import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { getAllPersonnel, Person } from '../db/database';

export default function PeopleScreen() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [staffData, setStaffData] = useState<Person[]>([]);

  useEffect(() => {
    setStaffData(getAllPersonnel());
  }, []);

  const filteredData = staffData.filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.office.toLowerCase().includes(search.toLowerCase())
  );

  const renderPerson = ({ item }: { item: Person }) => (
    <TouchableOpacity
      style={styles.personCard}
      onPress={() =>
        navigation.navigate('FloorMap', {
          destination: item.name,
          floor: item.floor
        })
      }
    >
      <View style={styles.avatar}>
        <Ionicons name="person" size={24} color="#6366f1" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.location}>
          {item.office} • Floor {item.floor}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#8e8e93" />
        <TextInput
          style={styles.input}
          placeholder="Search staff or admin..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={item => item.id.toString()}
        renderItem={renderPerson}
        contentContainerStyle={{ padding: 20 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 20,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  input: { flex: 1, marginLeft: 10 },

  personCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 12
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
  name: { fontSize: 16, fontWeight: '700' },
  location: { fontSize: 13, color: '#6366f1' }
});
