import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Dimensions, 
  Image, Animated, Easing, Modal
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Path } from 'react-native-svg';
import ImageZoom from 'react-native-image-pan-zoom';
import * as Haptics from 'expo-haptics';

// --- SENSOR IMPORTS ---
import { Magnetometer, Accelerometer } from 'expo-sensors';
import { startStepCounter } from '../services/stepCounter'; 
import { useAppStore } from '../stores/appStore';

// --- NEW IMPORT: Chatbot ---
import ChatbotScreen from './ChatbotScreen'; 

import GroundFloorImg from '../../assets/floor_G.png';
import FirstFloorImg  from '../../assets/floor_1.png';
import SecondFloorImg from '../../assets/floor_2.png';

const { width, height } = Dimensions.get('window');
const MAP_WIDTH = width * 2.5; 
const MAP_HEIGHT = height * 2;
const ImageZoomAny = ImageZoom as any;

export default function FloorMapScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { setPosition } = useAppStore();
  const { destination, floor, type } = route.params || {};

  // --- STATE ---
  const [selectedFloor, setSelectedFloor] = useState(floor ? String(floor) : 'G');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [chatVisible, setChatVisible] = useState(false); 
  
  const [stepCount, setStepCount] = useState(0);
  const [heading, setHeading] = useState(0); 

  const pulseAnim = useRef(new Animated.Value(0)).current;

  const navigationSteps = [
    { instruction: "Walk straight 20m", subText: "Heading toward main corridor", pos: { x: MAP_WIDTH * 0.3, y: MAP_HEIGHT * 0.6 }, stepThreshold: 0 },
    { instruction: "Turn Right", subText: "Walk past the Science Lab", pos: { x: MAP_WIDTH * 0.3, y: MAP_HEIGHT * 0.45 }, stepThreshold: 10 },
    { instruction: "You have arrived", subText: `Reached destination`, pos: { x: MAP_WIDTH * 0.5, y: MAP_HEIGHT * 0.4 }, stepThreshold: 25 }
  ];

  const currentStep = navigationSteps[currentStepIndex];
  const destPos = navigationSteps[navigationSteps.length - 1].pos;
  const destName = destination || "Target Location";
  const themeColor = type === 'emergency' ? "#FF3B30" : "#6366f1";

  // --- SENSOR LOGIC ---
  useEffect(() => {
    // startStepCounter returns void, so we just call it.
    startStepCounter((newSteps) => {
      setStepCount(newSteps);

      if (currentStepIndex < navigationSteps.length - 1) {
        const nextStep = navigationSteps[currentStepIndex + 1];
        if (newSteps >= nextStep.stepThreshold) {
          setCurrentStepIndex(prev => prev + 1);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          
          setPosition({ 
            x: nextStep.pos.x, 
            y: nextStep.pos.y, 
            floor: parseInt(selectedFloor === 'G' ? '0' : selectedFloor) 
          });
        }
      }
    });

    Magnetometer.setUpdateInterval(100);
    const magSub = Magnetometer.addListener(data => {
      let angle = Math.atan2(data.y, data.x) * (180 / Math.PI);
      setHeading(angle);
    });

    Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1, duration: 2000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      })
    ).start();

    return () => {
      // ✅ Manual Cleanup: Stops the listeners inside startStepCounter
      Accelerometer.removeAllListeners(); 
      if (magSub) magSub.remove();
    };
  }, [currentStepIndex, selectedFloor]);

  useEffect(() => {
    if (currentStepIndex === navigationSteps.length - 1) {
      setShowSuccess(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    }
  }, [currentStepIndex]);

  const pulseStyle = {
    transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 2.5] }) }],
    opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 0] }),
  };

  const floorImages: { [key: string]: any } = { 'G': GroundFloorImg, '1': FirstFloorImg, '2': SecondFloorImg };

  return (
    <View style={styles.container}>
      <View style={styles.topCard}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <View style={styles.searchInfo}>
          <Text style={styles.searchingFor}>NAVIGATING TO</Text>
          <Text style={styles.targetTitle}>{destName}</Text>
          <Text style={[styles.targetDetail, { color: themeColor }]}>{stepCount} Steps taken</Text>
        </View>
      </View>

      <View style={styles.mapArea}>
        <ImageZoomAny
          cropWidth={width}
          cropHeight={height}
          imageWidth={MAP_WIDTH}
          imageHeight={MAP_HEIGHT}
          centerOn={{ x: currentStep.pos.x - width / 2, y: currentStep.pos.y - height / 2, scale: 1, duration: 800 }}
        >
          <View style={{ width: MAP_WIDTH, height: MAP_HEIGHT }}>
            <Image source={floorImages[selectedFloor]} style={styles.mapBackground} resizeMode="cover" />
            
            <Svg style={StyleSheet.absoluteFill}>
              <Path 
                d={`M ${currentStep.pos.x} ${currentStep.pos.y} L ${destPos.x} ${destPos.y}`} 
                stroke={themeColor} strokeWidth="6" fill="none" strokeDasharray="15, 10" 
              />
            </Svg>

            <View style={[styles.userLocationContainer, { top: currentStep.pos.y - 14, left: currentStep.pos.x - 14 }]}>
              <Animated.View style={[styles.userPulse, pulseStyle, { backgroundColor: themeColor }]} />
              <View style={[styles.userDot, { backgroundColor: themeColor, transform: [{ rotate: `${heading}deg` }] }]}>
                <Ionicons name="navigate" size={14} color="white" />
              </View>
            </View>

            <View style={[styles.destinationContainer, { top: destPos.y - 60, left: destPos.x - 50 }]}>
              <View style={styles.destinationLabel}><Text style={styles.destinationLabelText}>{destName}</Text></View>
              <Ionicons name="location" size={40} color={themeColor} />
            </View>
          </View>
        </ImageZoomAny>

        <View style={styles.floorSelector}>
          {['2', '1', 'G'].map((f) => (
            <TouchableOpacity 
              key={f} 
              onPress={() => {
                setSelectedFloor(f);
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              style={[styles.floorBtn, selectedFloor === f && { backgroundColor: themeColor }]}
            >
              <Text style={[styles.floorText, selectedFloor === f && { color: '#fff' }]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={[styles.chatFab, { backgroundColor: themeColor }]} 
          onPress={() => setChatVisible(true)}
        >
          <Ionicons name="chatbubble-ellipses" size={28} color="white" />
        </TouchableOpacity>

        <View style={styles.instructionOverlay}>
          <View style={styles.stepBox}>
            <View style={[styles.iconContainer, { backgroundColor: themeColor + '1A' }]}>
              <Ionicons name={currentStepIndex === navigationSteps.length - 1 ? "checkmark-circle" : "walk"} size={32} color={themeColor} />
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepText}>{currentStep.instruction}</Text>
              <Text style={styles.stepSubText}>{currentStep.subText}</Text>
            </View>
          </View>
        </View>
      </View>

{/* ✅ Half-Screen Chatbot Modal */}
<Modal 
  visible={chatVisible} 
  animationType="slide" 
  transparent={true} // Allows map to show behind the modal
  onRequestClose={() => setChatVisible(false)}
>
  <TouchableOpacity 
    style={styles.modalOverlay} 
    activeOpacity={1} 
    onPress={() => setChatVisible(false)}
  >
    {/* This View controls the actual height of the chatbot */}
    <View style={styles.chatSheet}>
      <View style={styles.dragHandle} />
      <ChatbotScreen onClose={() => setChatVisible(false)} />
    </View>
  </TouchableOpacity>
</Modal>
      <Modal visible={showSuccess} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.successCard}>
            <LinearGradient colors={['#34C759', '#28a745']} style={styles.successIcon}>
              <Ionicons name="checkmark-done" size={50} color="white" />
            </LinearGradient>
            <Text style={styles.successTitle}>Goal Reached!</Text>
            <Text style={styles.successSub}>You have successfully navigated to {destName}.</Text>
            <TouchableOpacity style={styles.doneBtn} onPress={() => navigation.navigate('Main')}>
              <Text style={styles.doneBtnText}>Finish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  topCard: {
    position: 'absolute', top: 50, left: 20, right: 20, zIndex: 10,
    backgroundColor: '#fff', borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center', elevation: 8,
  },
  backButton: { marginRight: 10 },
  searchInfo: { flex: 1, marginLeft: 10 },
  searchingFor: { fontSize: 10, color: '#8e8e93', letterSpacing: 1, fontWeight: 'bold' },
  targetTitle: { fontSize: 18, fontWeight: 'bold', color: '#1a1a1a' },
  targetDetail: { fontSize: 13, fontWeight: '600' },
  mapArea: { flex: 1, backgroundColor: '#f8f9fa' },
  mapBackground: { width: MAP_WIDTH, height: MAP_HEIGHT },
  userLocationContainer: { position: 'absolute', width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
  userDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 3, borderColor: '#fff', justifyContent: 'center', alignItems: 'center', zIndex: 2 },
  userPulse: { position: 'absolute', width: 28, height: 28, borderRadius: 14, zIndex: 1 },
  destinationContainer: { position: 'absolute', alignItems: 'center', width: 100 },
  destinationLabel: { backgroundColor: '#fff', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 4, elevation: 4 },
  destinationLabelText: { fontSize: 12, fontWeight: 'bold' },
  floorSelector: { 
    position: 'absolute', right: 20, top: height * 0.25, 
    backgroundColor: '#fff', borderRadius: 12, padding: 8, 
    elevation: 8, zIndex: 20, shadowOpacity: 0.1 
  },
  floorBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 8, marginVertical: 4 },
  floorText: { fontWeight: 'bold', color: '#444' },
  chatFab: {
    position: 'absolute', right: 20, bottom: 150,
    width: 56, height: 56, borderRadius: 28,
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowOpacity: 0.3, zIndex: 20
  },
  instructionOverlay: { position: 'absolute', bottom: 40, left: 20, right: 20 },
  stepBox: { backgroundColor: '#fff', padding: 18, borderRadius: 20, flexDirection: 'row', alignItems: 'center', elevation: 10 },
  iconContainer: { padding: 10, borderRadius: 15 },
  stepContent: { marginLeft: 15, flex: 1 },
  stepText: { fontSize: 17, fontWeight: 'bold' },
  stepSubText: { fontSize: 13, color: '#8e8e93' },
  successCard: { width: width * 0.85, backgroundColor: 'white', borderRadius: 30, padding: 30, alignItems: 'center' },
  successIcon: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  successTitle: { fontSize: 24, fontWeight: 'bold' },
  successSub: { fontSize: 16, color: '#666', textAlign: 'center', marginTop: 8 },
  doneBtn: { marginTop: 25, backgroundColor: '#1a1a1a', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 15 },
  doneBtnText: { color: 'white', fontWeight: 'bold' },
 // Add/Update these in your styles object:
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', // Dim the map slightly
    justifyContent: 'flex-end' // Push the chat to the bottom
  },
  chatSheet: {
    height: height * 0.5, // Exactly half screen
    backgroundColor: '#fff',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
    elevation: 20,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#ccc',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 5
  }, 
});