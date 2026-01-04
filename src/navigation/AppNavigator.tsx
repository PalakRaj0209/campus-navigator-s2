import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ReadyScreen from '../screens/ReadyScreen';
import BuildingSelectorScreen from '../screens/BuildingSelectorScreen';  // Kajal's file
import FloorMapScreen from '../screens/FloorMapScreen';
import RouteViewScreen from '../screens/RouteViewScreen';
import ChatbotScreen from '../screens/ChatbotScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Ready" component={ReadyScreen} />
        <Stack.Screen name="BuildingSelector" component={BuildingSelectorScreen} />
        <Stack.Screen name="FloorMap" component={FloorMapScreen} />
        <Stack.Screen name="RouteView" component={RouteViewScreen} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
