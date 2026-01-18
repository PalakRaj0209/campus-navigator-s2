import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Platform
} from 'react-native';
import Svg, { SvgXml, Polyline, G, Path, Circle } from 'react-native-svg';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';

import { getFloorSVG } from '../data/floorPlans';
import { campusGraph } from '../data/graph';
import { initPedometer, stopPedometer } from '../services/stepSensor';
import { useMagnetometer } from '../services/position';
import { useAppStore } from '../stores/appStore';
import { useIndoorPosition } from '../hooks/useIndoorPosition';

const { width, height } = Dimensions.get('window');
const ZoomableView = ReactNativeZoomableView as any;

const CORRIDOR_X = 250;
const ENTRANCE_Y = 780;
const STEP_DISTANCE = 15;

export default function FloorMapScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { setPosition, position } = useAppStore();
  
  const { updateObservations } = useIndoorPosition();
  const { destination, floor, nodeId } = route.params || {};

  const heading = useMagnetometer();
  const zoomRef = useRef<any>(null);

  const coordX = useRef(CORRIDOR_X);
  const coordY = useRef(ENTRANCE_Y);
  const lastStepTime = useRef(0);

  const [steps, setSteps] = useState(0);
  const [routeString, setRouteString] = useState('');

  const resolveTarget = () => {
    if (nodeId) {
      return campusGraph.nodes.find(n => n.id === nodeId);
    }
    if (destination) {
      return campusGraph.nodes.find(
        n =>
          n.floor === floor &&
          destination.toLowerCase().includes(
            n.id.replace(/_/g, ' ').toLowerCase()
          )
      );
    }
    return undefined;
  };

  useEffect(() => {
    const target = resolveTarget();
    if (!target) {
      console.warn('⚠️ No target resolved for:', destination, nodeId);
      return;
    }

    coordX.current = CORRIDOR_X;
    coordY.current = ENTRANCE_Y;

    setPosition({
      x: CORRIDOR_X,
      y: ENTRANCE_Y,
      floor
    });

    const path = [
      `${CORRIDOR_X},${ENTRANCE_Y}`,
      `${CORRIDOR_X},${target.y}`,
      `${target.x},${target.y}`
    ].join(' ');

    setRouteString(path);

    setTimeout(() => {
      zoomRef.current?.moveTo(CORRIDOR_X, ENTRANCE_Y);
      zoomRef.current?.zoomTo(1.05);
    }, 300);

    initPedometer(() => {
      const now = Date.now();
      if (now - lastStepTime.current < 500) return;
      setSteps(s => s + 1);
      const angleRad = (heading - 90) * (Math.PI / 180);
      coordX.current += STEP_DISTANCE * Math.cos(angleRad);
      coordY.current += STEP_DISTANCE * Math.sin(angleRad);
      setPosition({
        x: coordX.current,
        y: coordY.current,
        floor
      });
      lastStepTime.current = now;
    });

    return () => stopPedometer();
  }, [destination, nodeId, floor]);

  // =========================
  // BLE SIMULATION (Step 6 of Plan)
  // =========================
  useEffect(() => {
    // Simulates beacon signal updates every 2 seconds
    const simulateBeacons = setInterval(() => {
      const mockObservations = [
        { 
          key: "uuid1:major1:minor1", // Matches Main Entrance in beacons.json
          rssi: -65 + Math.random() * 15, 
          timestamp: Date.now() 
        }
      ];
      
      // Updates the global position via the hook created in Step 4
      updateObservations(mockObservations);
    }, 2000);

    return () => clearInterval(simulateBeacons);
  }, [updateObservations]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.navTarget}>To: {destination}</Text>
      </View>

      <View style={styles.debugOverlay}>
        <Text style={styles.debugText}>Floor: {position.floor}</Text>
        <Text style={styles.debugText}>X: {Math.round(position.x)} | Y: {Math.round(position.y)}</Text>
        <Text style={styles.debugText}>Mode: BLE + Pedometer</Text>
      </View>

      <View style={styles.mapContainer}>
        <ZoomableView ref={zoomRef} maxZoom={2} minZoom={0.8} initialZoom={1}>
          <Svg width={width} height={height * 0.75} viewBox="0 0 500 1000">
            <SvgXml xml={getFloorSVG(floor)} />
            {routeString !== '' && (
              <Polyline
                points={routeString}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="6"
                strokeDasharray="12,8"
              />
            )}
            <Circle
              cx={position.x}
              cy={position.y}
              r={25}
              fill="rgba(59, 130, 246, 0.2)"
            />
            <G transform={`rotate(${heading}, ${position.x}, ${position.y})`}>
              <Path
                d={`M${position.x},${position.y - 20}
                    L${position.x + 12},${position.y + 10}
                    L${position.x},${position.y + 5}
                    L${position.x - 12},${position.y + 10} Z`}
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
              />
            </G>
          </Svg>
        </ZoomableView>
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.stepText}>👣 {steps} Steps</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.endText}>End</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topHeader: { padding: 20, paddingTop: 60 },
  navTarget: { fontSize: 18, fontWeight: 'bold' },
  mapContainer: { flex: 1 },
  bottomBar: {
    padding: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  stepText: { fontSize: 16, fontWeight: 'bold' },
  endText: { color: '#ef4444', fontWeight: 'bold' },
  debugOverlay: {
    position: 'absolute',
    top: 100,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
  },
  debugText: {
    color: '#00ff00',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});