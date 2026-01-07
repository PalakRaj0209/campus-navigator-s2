import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

// ✅ Keep your current DB functions exactly as they are
import { initDB, seedDB } from './src/db/database'; 

export default function App() {

  useEffect(() => {
    // We execute your existing functions here
    try {
      initDB();
      seedDB();
      console.log("🚀 Database is ready using existing logic!");
    } catch (e) {
      console.error("❌ DB Setup Error:", e);
    }
  }, []);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {/* statusBar matches your current #0a0a23 theme */}
        <StatusBar barStyle="light-content" backgroundColor="#0a0a23" />
        <AppNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a23',
  },
});