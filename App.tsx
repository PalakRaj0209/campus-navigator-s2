import React, { useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';

// ✅ Keep your current DB functions exactly as they are
import { initDB, seedDB, getAllPersonnel } from './src/db/database';
import { seedCloudOnStart, seedMapOnStart, syncMapOnStart } from './src/config';
import { syncPersonnelFromCloud, uploadLocalPersonnelToCloud } from './src/services/personnelSync';
import { syncMapDataFromCloud, uploadLocalMapDataToCloud } from './src/services/mapSync';

export default function App() {

  useEffect(() => {
    const bootstrap = async () => {
      try {
        initDB();
        const existing = getAllPersonnel();
        if (existing.length === 0) {
          seedDB();
        }
        if (seedCloudOnStart) {
          await uploadLocalPersonnelToCloud();
        }
        await syncPersonnelFromCloud();
        if (syncMapOnStart) {
          const result = await syncMapDataFromCloud();
          if (result.status === 'empty' && seedMapOnStart) {
            await uploadLocalMapDataToCloud();
            await syncMapDataFromCloud();
          }
        }
        console.log("🚀 Database is ready using existing logic!");
      } catch (e) {
        console.error("❌ DB Setup Error:", e);
      }
    };

    bootstrap();
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
