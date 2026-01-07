import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
// ✅ ADD THIS IMPORT
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import Screens
import BuildingSelectorScreen from '../screens/BuildingSelectorScreen';
import HomeScreen from '../screens/HomeScreen';
import FloorMapScreen from '../screens/FloorMapScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import SafetyScreen from '../screens/SafetyScreen';
import RouteViewScreen from '../screens/RouteViewScreen';
import PeopleScreen from '../screens/PeopleScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// --- THE BOTTOM TAB BAR ---
function MainTabs() {
  // ✅ ADD THIS LINE to define 'insets'
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#6366f1',
        tabBarInactiveTintColor: '#9ca3af',
        headerShown: false,
        
        // ✅ REMOVED 'HapticTab' to fix "Cannot find name" error
        // React Navigation will use the default system button instead.
        
        tabBarStyle: {
          // ✅ 'insets.bottom' now works because of the hook above
          height: 65 + insets.bottom, 
          paddingBottom: insets.bottom > 0 ? insets.bottom : 10,
          paddingTop: 10,
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
          elevation: 0,
        },

        tabBarShowLabel: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 5,
        },
        
        tabBarIconStyle: {
          marginBottom: 2,
        }
      }}
    >
      <Tab.Screen 
        name="Navigate" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "map" : "map-outline"} size={24} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="People" 
        component={PeopleScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "people" : "people-outline"} size={24} color={color} />
          )
        }} 
      />
      <Tab.Screen 
        name="Safety" 
        component={SafetyScreen} 
        options={{
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? "shield-checkmark" : "shield-checkmark-outline"} size={24} color={color} />
          )
        }} 
      />
    </Tab.Navigator>
  );
}

// --- THE MAIN NAVIGATOR ---
export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="BuildingSelector" component={BuildingSelectorScreen} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="FloorMap" component={FloorMapScreen} />
        <Stack.Screen name="RouteView" component={RouteViewScreen} />
        <Stack.Screen name="Chatbot" component={ChatbotScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}