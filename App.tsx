import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import ReadyScreen from './src/screens/ReadyScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { useAppStore } from './src/stores/appStore';

export default function App() {
  const { building } = useAppStore();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0a0a23' }}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0a23" />
      <AppNavigator />
    </SafeAreaView>
  );
}
