import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BuildingSelectorScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Building Selector (Coming Soon)</Text>
      <Text>Campus dropdown → Building dropdown → Next</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
});
