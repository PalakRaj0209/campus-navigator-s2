import React, { useEffect } from 'react'; // ✅ Import useEffect
import { SafeAreaView, StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppStore } from './src/stores/appStore';
import { initDB, seedDB } from './src/db/database'; // ✅ Import DB functions

export default function App() {
  const { building } = useAppStore();

  // ✅ Add this block to initialize DB
  useEffect(() => {
    try {
      initDB();
      seedDB();
      console.log("🚀 Database initialized & seeded!");
    } catch (e) {
      console.error("❌ DB Error:", e);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a23' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a23" />
      <AppNavigator />
    </SafeAreaView>
  );
}
