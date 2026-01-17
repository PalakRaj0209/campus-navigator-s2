import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Dimensions, Animated, Platform } from 'react-native';
import Svg, { SvgXml, Polyline, G, Path } from 'react-native-svg';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ReactNativeZoomableView } from '@openspacelabs/react-native-zoomable-view';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
 
import { getFloorSVG } from '../data/floorPlans';
import { campusGraph, CORRIDOR_X, ENTRANCE_Y_F0 } from '../data/graph';
import { getRoutePoints, getPositionAtDistance } from '../services/routing';
import { initPedometer, stopPedometer } from '../services/stepSensor';
import { useMagnetometer } from '../services/position';
import { useAppStore } from '../stores/appStore';
 
const { width, height } = Dimensions.get('window');
const ZoomableView = ReactNativeZoomableView as any;
 
export default function FloorMapScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { setPosition, position } = useAppStore();
  const { nodeId, destination, type } = route.params || {};
  const lastTurnSpokenTime = useRef(0);
 
  const isEmergency = type === 'emergency';
 
  const [currentFloor, setCurrentFloor] = useState(0);
  const [startConfirmed, setStartConfirmed] = useState(false);
  const [travelMode, setTravelMode] = useState<'pending' | 'stairs' | 'lift'>('pending');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isArrived, setIsArrived] = useState(false);
  const [steps, setSteps] = useState(0);
  const [routeString, setRouteString] = useState('');
  const [instructions, setInstructions] = useState('Select Start Floor');
  const [isMuted, setIsMuted] = useState(false);
 
  const zoomRef = useRef<any>(null);
  const heading = useMagnetometer();
  const distanceRef = useRef(0);
  const lastStepTime = useRef(0);
  const isSpeaking = useRef(false);
  const anchorRef = useRef<{ x: number; y: number } | null>(null);
  const slideAnim = useRef(new Animated.Value(-300)).current;
 
  const stepDistRef = useRef(3);
  const [displaySpeed, setDisplaySpeed] = useState(3);
 
  const targetNode = campusGraph.nodes.find(n => n.id === nodeId);
 
  // Safety speech for emergency activation
  useEffect(() => {
    if (isEmergency) {
      safeSpeak("Emergency protocol activated. Follow the red path to the nearest exit immediately.");
    }
  }, [isEmergency]);
 
  useEffect(() => {
    Animated.spring(slideAnim, { toValue: 20, useNativeDriver: true, tension: 40, friction: 8 }).start();
  }, [startConfirmed, travelMode, isTransitioning, isArrived]);
 
  const handleReCenter = () => {
    if (zoomRef.current) zoomRef.current.moveTo(position.x, position.y, true);
  };
 
  const safeSpeak = (text: string) => {
    setInstructions(text);
    if (isMuted) return;
    if (isSpeaking.current) return;
    isSpeaking.current = true;
    Speech.speak(text, {
      onDone: () => { isSpeaking.current = false; },
      onStopped: () => { isSpeaking.current = false; },
      onError: () => { isSpeaking.current = false; }
    });
  };
 
  const checkFloorTransition = (y: number) => {
    // During emergency, transition points are the same as regular routing points (stairs/lifts)
    if (targetNode && currentFloor !== targetNode.floor) {
      const isAtLift = travelMode === 'lift' && Math.abs(y - 445) < 35;
      const isAtStairs = travelMode === 'stairs' && (Math.abs(y - 825) < 35 || Math.abs(y - 70) < 35);
      if (isAtLift || isAtStairs) {
        stopPedometer();
        setIsTransitioning(true);
        safeSpeak("Reached transition point. Confirm arrival.");
      }
    }
  };
 
  useEffect(() => {
    // Emergency doesn't strictly need targetNode to exist in graph, but we check to prevent crashes
    if (!startConfirmed || (!targetNode && !isEmergency) || isTransitioning || isArrived) return;
 
    if (currentFloor === (targetNode?.floor ?? 0) && travelMode === 'pending') {
      setTravelMode('lift');
    }
 
    const startPoint = anchorRef.current ?? {
      x: steps === 0 ? CORRIDOR_X : position.x,
      y: (steps === 0 && currentFloor === 0) ? ENTRANCE_Y_F0 : position.y
    };
 
// --- UPDATED EMERGENCY LOGIC (STAIRS & LIFTS) ---
    let activeTargetId = targetNode?.id || '';

    if (isEmergency) {
      if (currentFloor === 0) {
        // Ground Floor: Route to the nearest exit door or staircase that leads out
        if (startPoint.y > 600) activeTargetId = "f0_exit_main";
        else if (startPoint.y < 300) activeTargetId = "f0_stairs_top";
        else activeTargetId = "f0_lifts"; // Mid-building exit
      } else {
        // Floor 1: Find the absolute nearest way down
        const distToStairsTop = Math.abs(startPoint.y - 70);
        const distToStairsBottom = Math.abs(startPoint.y - 825);
        const distToLift = Math.abs(startPoint.y - 445);

        // Find the minimum distance of the three
        const minDist = Math.min(distToStairsTop, distToStairsBottom, distToLift);

        if (minDist === distToStairsTop) activeTargetId = "f1_stairs_top";
        else if (minDist === distToStairsBottom) activeTargetId = "f1_stairs_bottom";
        else activeTargetId = "f1_lifts";
      }
    } else {
      // Standard Logic (Stays the same, respects travelMode)
      if (targetNode && currentFloor !== targetNode.floor) {
        activeTargetId = travelMode === 'lift' ? `f${currentFloor}_lifts` : 
          (startPoint.y > 500 ? `f${currentFloor}_stairs_bottom` : `f${currentFloor}_stairs_top`);
      }
    }
    // ------------------------------------------------    // --------------------------------
   
    const path = getRoutePoints(startPoint.x, startPoint.y, activeTargetId);
    setRouteString(path);
 
    if (distanceRef.current === 0 && steps === 0) {
      setPosition({ ...startPoint, floor: currentFloor });
      const pathArray = path.split(' ');
      if (pathArray.length > 1) {
        const firstTargetY = parseFloat(pathArray[1].split(',')[1]);
        const directionMsg = firstTargetY < startPoint.y ? "Go straight." : "Follow the path.";
        if (!isEmergency) safeSpeak(directionMsg);
      }
    }
 
    initPedometer(() => {
      if (!path || path === '' || isTransitioning || isArrived) return;
      const now = Date.now();
      if (now - lastStepTime.current < 450) return;
      if (anchorRef.current) anchorRef.current = null;
 
      const potentialDist = distanceRef.current + stepDistRef.current;
      const nextPos = getPositionAtDistance(path, potentialDist);
 
      if (nextPos.isTurningPoint) {
        const turnNow = Date.now();
        if (turnNow - lastTurnSpokenTime.current > 3000) {
          safeSpeak("Turn ahead.");
          lastTurnSpokenTime.current = turnNow;
        }
      }
 
      // ARRIVAL LOGIC
      // If emergency, arrival is only true when reaching a ground floor exit
      const isAtFinalExit = isEmergency ? (currentFloor === 0 && nextPos.isFinished) : (nextPos.isFinished && currentFloor === targetNode?.floor);
 
      if (isAtFinalExit) {
        stopPedometer();
        if (isEmergency) {
          safeSpeak("You have reached the emergency exit. Please exit the building.");
        } else {
          const side = targetNode && targetNode.x < CORRIDOR_X ? "left" : "right";
          safeSpeak(`Turn ${side}. You have arrived.`);
        }
        setIsArrived(true);
      }
 
      distanceRef.current = potentialDist;
      setSteps(s => s + 1);
      setPosition({ x: nextPos.x, y: nextPos.y, floor: currentFloor });
      checkFloorTransition(nextPos.y);
      lastStepTime.current = now;
    });
    return () => stopPedometer();
  }, [currentFloor, startConfirmed, travelMode, isTransitioning, isArrived, nodeId, isEmergency]);
 
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.headerTitle, isEmergency && { color: '#ff3b30' }]}>
            {isEmergency ? "EMERGENCY EXIT" : destination}
          </Text>
          <Text style={[styles.guidanceText, isEmergency && { color: '#ff3b30' }]}>{instructions}</Text>
        </View>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => setIsMuted(!isMuted)} style={styles.iconBtn}>
            <Ionicons name={isMuted ? "volume-mute" : "volume-high"} size={20} color={isEmergency ? "#ff3b30" : "#5e5ce6"} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleReCenter} style={styles.iconBtn}>
            <Ionicons name="locate-outline" size={20} color={isEmergency ? "#ff3b30" : "#5e5ce6"} />
          </TouchableOpacity>
        </View>
      </View>
 
      <View style={styles.mapArea}>
        <ZoomableView ref={zoomRef} maxZoom={3} minZoom={0.5} initialZoom={1.0} bindToBorders={true} style={{ backgroundColor: '#fff' }}>
          <Svg width={width} height={height * 0.65} viewBox="0 0 500 1000">
            <SvgXml xml={getFloorSVG(currentFloor)} />
            {routeString !== '' && (
              <Polyline
                points={routeString}
                fill="none"
                stroke={isEmergency ? "#ff3b30" : "#3b82f6"}
                strokeWidth="8"
                strokeDasharray={isEmergency ? "0" : "10,6"}
              />
            )}
            <G transform={`rotate(${heading}, ${position.x}, ${position.y})`}>
              <Path
                d={`M${position.x},${position.y - 12} L${position.x + 8},${position.y + 8} L${position.x},${position.y + 4} L${position.x - 8},${position.y + 8} Z`}
                fill={isEmergency ? "#ff3b30" : "#3b82f6"}
                stroke="white"
                strokeWidth="2"
              />
            </G>
          </Svg>
        </ZoomableView>
 
        {/* Start Choice */}
        {!startConfirmed && (
          <Animated.View style={[styles.miniPopup, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.miniPopupTitle}>Confirm Current Floor</Text>
            <View style={styles.popupRow}>
              <TouchableOpacity style={styles.miniBtn} onPress={() => { setCurrentFloor(0); setStartConfirmed(true); }}><Text style={styles.btnText}>Ground</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.miniBtn, {backgroundColor:'#10b981'}]} onPress={() => { setCurrentFloor(1); setStartConfirmed(true); }}><Text style={styles.btnText}>Floor 1</Text></TouchableOpacity>
            </View>
          </Animated.View>
        )}
 
        {/* Mode Choice */}
        {startConfirmed && travelMode === 'pending' && (isEmergency || (targetNode && currentFloor !== targetNode.floor)) && (
          <Animated.View style={[styles.miniPopup, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.miniPopupTitle}>Exit via?</Text>
            <View style={styles.popupRow}>
              <TouchableOpacity style={styles.miniBtn} onPress={() => setTravelMode('lift')}><Text style={styles.btnText}>Lift</Text></TouchableOpacity>
              <TouchableOpacity style={[styles.miniBtn, {backgroundColor:'#10b981'}]} onPress={() => setTravelMode('stairs')}><Text style={styles.btnText}>Stairs</Text></TouchableOpacity>
            </View>
          </Animated.View>
        )}
 
        {/* Transition Confirm */}
        {isTransitioning && (
          <Animated.View style={[styles.miniPopup, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.miniPopupTitle}>Changed Floors?</Text>
            <TouchableOpacity style={styles.miniConfirmBtn} onPress={() => {
                const nextFloor = currentFloor === 0 ? 1 : 0;
                anchorRef.current = { x: CORRIDOR_X, y: travelMode === 'lift' ? (nextFloor === 1 ? 465 : 445) : (position.y < 300 ? 70 : 835) };
                setCurrentFloor(nextFloor); setIsTransitioning(false); distanceRef.current = 0; safeSpeak("Follow the path.");
              }}>
              <Text style={styles.btnText}>I am on Floor {currentFloor === 0 ? '1' : '0'} now</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
 
        {/* ARRIVED POPUP */}
        {isArrived && (
          <Animated.View style={[styles.miniPopup, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.miniPopupTitle}>{isEmergency ? "🏃 Safe at Exit!" : "🎉 Destination Reached!"}</Text>
            <TouchableOpacity style={styles.miniConfirmBtn} onPress={() => navigation.goBack()}>
              <Text style={styles.btnText}>Close Navigation</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
 
        <View style={styles.speedControl}>
          <TouchableOpacity onPress={() => { stepDistRef.current = Math.max(1, stepDistRef.current - 1); setDisplaySpeed(stepDistRef.current); }}>
            <Ionicons name="remove-circle" size={24} color={isEmergency ? "#ff3b30" : "#5e5ce6"} />
          </TouchableOpacity>
          <View style={styles.speedIndicator}>
            <Text style={styles.speedText}>{displaySpeed}</Text>
            <Text style={styles.speedSub}>SPEED</Text>
          </View>
          <TouchableOpacity onPress={() => { stepDistRef.current = Math.min(15, stepDistRef.current + 1); setDisplaySpeed(stepDistRef.current); }}>
            <Ionicons name="add-circle" size={24} color={isEmergency ? "#ff3b30" : "#5e5ce6"} />
          </TouchableOpacity>
        </View>
      </View>
 
      <View style={styles.footer}>
        <View style={styles.stepsRow}>
          <MaterialCommunityIcons name="foot-print" size={24} color={isEmergency ? "#ff3b30" : "#5e5ce6"} />
          <Text style={styles.stepsCountText}>{steps} Steps</Text>
        </View>
        <TouchableOpacity style={styles.endNavBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.endNavText}>End</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
 
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 10 : 35, paddingBottom: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  headerTextContainer: { flex: 1 },
  headerTitle: { fontSize: 28, fontWeight: 'bold', color: '#000' },
  guidanceText: { fontSize: 14, color: '#5e5ce6', fontWeight: 'bold' },
  headerIcons: { flexDirection: 'row', marginTop: 10 },
  iconBtn: { backgroundColor: '#f5f5f7', padding: 8, borderRadius: 20, marginLeft: 10 },
  mapArea: { flex: 1, overflow: 'hidden' },
  speedControl: { position: 'absolute', bottom: 20, right: 15, backgroundColor: '#fff', borderRadius: 30, padding: 8, flexDirection: 'row', alignItems: 'center', elevation: 5, zIndex: 50 },
  speedIndicator: { alignItems: 'center', marginHorizontal: 8 },
  speedText: { fontSize: 14, fontWeight: 'bold', color: '#5e5ce6' },
  speedSub: { fontSize: 7, fontWeight: 'bold', color: '#999' },
  footer: { paddingHorizontal: 20, paddingVertical: 15, borderTopWidth: 1, borderTopColor: '#f0f0f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  stepsRow: { flexDirection: 'row', alignItems: 'center' },
  stepsCountText: { fontSize: 20, fontWeight: 'bold', marginLeft: 8, color: '#000' },
  endNavBtn: { backgroundColor: '#ff5c5c', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 12 },
  endNavText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  miniPopup: { position: 'absolute', bottom: 20, alignSelf: 'center', backgroundColor: '#fff', width: '85%', padding: 15, borderRadius: 20, elevation: 10, zIndex: 100 },
  miniPopupTitle: { textAlign: 'center', fontWeight: 'bold', fontSize: 16, marginBottom: 10 },
  popupRow: { flexDirection: 'row', justifyContent: 'space-around' },
  miniBtn: { backgroundColor: '#5e5ce6', padding: 12, borderRadius: 12, width: '45%', alignItems: 'center' },
  miniConfirmBtn: { backgroundColor: '#3b82f6', padding: 12, borderRadius: 12, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 14 }
});