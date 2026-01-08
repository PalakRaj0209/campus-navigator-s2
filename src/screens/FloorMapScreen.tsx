import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Svg, { SvgXml, Circle, Polyline } from 'react-native-svg';
import { useAppStore } from '../stores/appStore';

const { width, height } = Dimensions.get('window');

export default function FloorMapScreen() {
  const { position } = useAppStore();
  
  // Campus floor SVG background
  const campusSvg = `
    <svg viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="360" height="260" rx="10" fill="#f8f9fa" stroke="#e9ecef" stroke-width="2"/>
      
      <!-- Rooms -->
      <rect x="80" y="100" width="60" height="40" rx="5" fill="#e3f2fd" stroke="#2196f3"/>
      <text x="110" y="125" font-size="14" text-anchor="middle" fill="#1976d2">Room 101</text>
      
      <rect x="280" y="100" width="80" height="50" rx="5" fill="#ffebee" stroke="#f44336"/>
      <text x="320" y="125" font-size="14" text-anchor="middle" fill="#d32f2f">Dean Office</text>
      
      <!-- Nodes -->
      <circle cx="40" cy="40" r="6" fill="#666"/>
      <circle cx="200" cy="250" r="5" fill="#666"/>
      <text x="25" y="45" font-size="12" fill="#666">n1</text>
    </svg>
  `;

  // Graph route: n1 → corridor → Dean office
  const routePath = "40,40 200,250 320,125";

  return (
    <View style={styles.container}>
      
      {/* 🔥 HEADER (outside SVG) */}
      <View style={styles.header}>
        <Text style={styles.title}>Academic Block - Floor 1</Text>
        <Text style={styles.subtitle}>Live Navigation</Text>
        <View style={styles.stats}>
          <Text style={styles.pos}>📍 Pos: {position.x.toFixed(1)}, {position.y.toFixed(1)}</Text>
          <Text style={styles.distance}>📏 120m to Dean Office</Text>
        </View>
      </View>

      {/* 🔥 FULL SCREEN MAP */}
      <Svg height="100%" width="100%" style={styles.map}>
        <SvgXml xml={campusSvg} />
        
        {/* Red Route Line */}
        <Polyline 
          points={routePath}
          stroke="#ff4444" 
          strokeWidth="8" 
          strokeLinecap="round"
          strokeDasharray="10,5"
          fill="none"
        />
        
        {/* Blue User Dot */}
        <Circle 
          cx={Math.min(position.x * 25, 380)}  // Scale + bounds
          cy={Math.min(position.y * 25, 280)}
          r="16"
          fill="#007AFF"
          stroke="white"
          strokeWidth="4"
        />
        
        {/* Pulse animation */}
        <Circle 
          cx={Math.min(position.x * 25, 380)}
          cy={Math.min(position.y * 25, 280)}
          r="22"
          fill="none"
          stroke="#007AFF"
          strokeWidth="3"
          opacity="0.4"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#f0f4f8' 
  },
  header: { 
    padding: 20, 
    backgroundColor: 'white',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1e293b',
    marginBottom: 4
  },
  subtitle: { 
    fontSize: 16, 
    color: '#64748b',
    marginBottom: 12
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  pos: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#007AFF' 
  },
  distance: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#10b981' 
  },
  map: { 
    flex: 1, 
    margin: 10 
  }
});
