import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import Svg, { SvgXml, Polyline, G, Path, Circle } from 'react-native-svg';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

import { getFloorSVG } from '../data/floorPlans';
import { useAppStore } from '../stores/appStore'; 
import { initPedometer, stopPedometer } from '../services/stepSensor';
import { useMagnetometer } from '../services/position'; 
import { getRoutePoints, getClosestPointOnPath } from '../services/routing';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
const ZoomableView = ReactNativeZoomableView as any;

export default function FloorMapScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { position, setPosition } = useAppStore(); 
  
  const [steps, setSteps] = useState(0);
  const heading = useMagnetometer(); 
  const zoomableViewRef = useRef<any>(null);

  // STARTING POINT: Entrance is at (250, 850)
  const coordX = useRef(250);
  const coordY = useRef(850);
  const lastStepTime = useRef(0);

  const { destination, nodeId, floor } = route.params || { destination: "HOD 1", nodeId: "f0_hod1", floor: 0 };
  
  // Get the blue dotted line coordinates
  const pathPointsString = getRoutePoints(nodeId); 

  useEffect(() => {
    // Reset to Entrance on load
    coordX.current = 250;
    coordY.current = 850;
    setPosition({ x: 250, y: 850, floor: floor });

    initPedometer((newSteps) => {
      const now = Date.now();
      if (now - lastStepTime.current > 500) {
        setSteps(prev => prev + newSteps);

        // 1. Calculate raw movement
        const angleRad = (heading - 90) * (Math.PI / 180);
        const stepDist = 15; 
        const rawX = coordX.current + (stepDist * Math.cos(angleRad));
        const rawY = coordY.current + (stepDist * Math.sin(angleRad));

        // 2. PATH SNAPPING: Force the arrow to stay on the dotted line
        const snappedPoint = getClosestPointOnPath(rawX, rawY, nodeId);
        
        coordX.current = snappedPoint.x;
        coordY.current = snappedPoint.y;

        setPosition({ x: coordX.current, y: coordY.current, floor: floor });
        lastStepTime.current = now;
      }
    });

    return () => stopPedometer();
  }, [nodeId]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.navTarget}>To: {destination}</Text>
        <TouchableOpacity style={styles.reCenterBtn} onPress={() => zoomableViewRef.current?.zoomTo(1.2)}>
          <Text style={styles.reCenterText}>RE-CENTER</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <ZoomableView ref={zoomableViewRef} maxZoom={3} minZoom={0.5} initialZoom={1.2} style={styles.zoomWrapper}>
          <Svg width={SCREEN_WIDTH} height={SCREEN_HEIGHT * 0.7} viewBox="50 0 400 900">
            <SvgXml xml={getFloorSVG(floor)} />
            
            {/* THE BLUE DOTTED LINE */}
            <Polyline points={pathPointsString} fill="none" stroke="#3b82f6" strokeWidth="6" strokeDasharray="12, 8" />

            {/* THE ARROW (Following the line) */}
            <G transform={`rotate(${heading}, ${position.x}, ${position.y})`}>
               <Path 
                 d={`M${position.x},${position.y-25} L${position.x+15},${position.y+12} L${position.x},${position.y+2} L${position.x-15},${position.y+12} Z`} 
                 fill="#3b82f6" stroke="white" strokeWidth="2" 
               />
            </G>
          </Svg>
        </ZoomableView>
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.stepText}>👣 {steps} Steps</Text>
        <TouchableOpacity style={styles.endBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.endBtnText}>End</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topHeader: { padding: 20, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#eee' },
  navTarget: { fontSize: 20, fontWeight: 'bold' },
  reCenterBtn: { backgroundColor: '#f1f5f9', padding: 8, borderRadius: 8 },
  reCenterText: { color: '#6366f1', fontWeight: 'bold', fontSize: 12 },
  mapContainer: { flex: 1 },
  zoomWrapper: { flex: 1 },
  bottomBar: { padding: 20, flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 1, borderColor: '#eee', paddingBottom: 40 },
  stepText: { fontSize: 18, fontWeight: 'bold' },
  endBtn: { backgroundColor: '#ef4444', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  endBtnText: { color: 'white', fontWeight: 'bold' }
});