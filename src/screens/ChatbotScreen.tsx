import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// IMPORT: Connect to your SQLite database logic
import { getAllPersonnel, getPersonByName, Person } from '../db/database';
import { askGemini } from '../services/llm';
import { getRoutePoints } from '../services/routing';
import { useAppStore } from '../stores/appStore';

interface ChatbotProps {
  onClose?: () => void;
}

const STOP_WORDS = new Set([
  'where', 'is', 'the', 'a', 'an', 'of', 'at', 'in', 'on', 'to', 'me', 'please',
  'can', 'you', 'help', 'find', 'locate', 'navigate', 'there', 'for', 'about'
]);

const PIXELS_PER_METER = 5;
const MIN_SEGMENT_DISTANCE_PX = 5;

const normalizeText = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const getTokens = (value: string) => {
  const tokens = normalizeText(value).split(' ').filter(Boolean);
  const filtered = tokens.filter((token) => !STOP_WORDS.has(token));
  return filtered.length ? filtered : tokens;
};

const findBestPersonMatch = (query: string, people: Person[]): Person | null => {
  const normalizedQuery = normalizeText(query);
  const tokens = getTokens(query);
  let best: Person | null = null;
  let bestScore = 0;

  for (const person of people) {
    const name = normalizeText(person.name);
    const office = normalizeText(person.office);
    const haystack = normalizeText(
      [person.name, person.office, person.role, person.building, person.nodeId].join(' ')
    );
    let score = 0;

    if (name && normalizedQuery.includes(name)) score += 3;
    if (office && normalizedQuery.includes(office)) score += 2;
    tokens.forEach((token) => {
      if (haystack.includes(token)) score += 1;
    });

    if (score > bestScore) {
      bestScore = score;
      best = person;
    }
  }

  return bestScore >= 2 ? best : null;
};

const getDirectionLabel = (dx: number, dy: number) => {
  if (Math.abs(dx) >= Math.abs(dy)) {
    return dx >= 0 ? 'right' : 'left';
  }
  return 'straight';
};

const buildStepDirections = (route: string) => {
  if (!route) return [];

  const points = route
    .split(' ')
    .map((point) => {
      const [x, y] = point.split(',').map(Number);
      return { x, y };
    })
    .filter((point) => Number.isFinite(point.x) && Number.isFinite(point.y));

  if (points.length < 2) return [];

  const steps: { direction: string; meters: number }[] = [];
  for (let i = 0; i < points.length - 1; i += 1) {
    const start = points[i];
    const end = points[i + 1];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.hypot(dx, dy);
    if (distance < MIN_SEGMENT_DISTANCE_PX) continue;

    steps.push({
      direction: getDirectionLabel(dx, dy),
      meters: Math.max(1, Math.round(distance / PIXELS_PER_METER)),
    });
  }

  return steps;
};

const formatStepText = (steps: { direction: string; meters: number }[]) => {
  if (!steps.length) return '';
  return steps
    .map((step, index) => {
      if (step.direction === 'straight') {
        return `${index + 1}. Go straight for about ${step.meters} m.`;
      }
      if (index === 0) {
        return `${index + 1}. Move ${step.direction} for about ${step.meters} m.`;
      }
      return `${index + 1}. Turn ${step.direction} and go for about ${step.meters} m.`;
    })
    .join('\n');
};

export default function ChatbotScreen({ onClose }: ChatbotProps) {
  const navigation = useNavigation<any>();
  const scrollViewRef = useRef<ScrollView>(null);
  const { position } = useAppStore();
  
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Campus AI. How can I help you find a room, locate a person, or stay safe today?", sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');
  const [pendingTarget, setPendingTarget] = useState<{ nodeId: string; destination: string } | null>(null);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    
    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const query = inputText.trim();
    setInputText('');

    setTimeout(async () => {
      let aiText = "I'm checking the campus directory for you...";
      const lowerQuery = query.toLowerCase();
      const isAffirmative = ['yes', 'y', 'yeah', 'yep', 'sure', 'ok', 'okay', 'start', 'go ahead', 'please']
        .some(token => lowerQuery.includes(token));
      const isNavigateIntent = ['navigate', 'direction', 'directions', 'route', 'take me', 'guide me', 'start navigation']
        .some(token => lowerQuery.includes(token));
      const isNegative = ['no', 'nope', 'not now', 'cancel', 'stop', 'later']
        .some(token => lowerQuery.includes(token));
      const isLocationQuery = /(where|locate|find|office|room|lab|classroom|hod|principal|dean|director|library|toilet|stairs|lift|store)/i
        .test(lowerQuery);
      
      try {
        if (pendingTarget && (isAffirmative || isNavigateIntent)) {
          aiText = `Starting navigation to ${pendingTarget.destination}.`;
          navigation.navigate('FloorMap', {
            nodeId: pendingTarget.nodeId,
            destination: pendingTarget.destination,
          });
          setPendingTarget(null);
        } else if (pendingTarget && isNegative) {
          aiText = "Okay, let me know if you need anything else.";
          setPendingTarget(null);
        } else {
          const directPerson = await getPersonByName(query);
          const bestPerson = directPerson ?? findBestPersonMatch(query, getAllPersonnel());

          if (bestPerson) {
            const route = getRoutePoints(position.x, position.y, bestPerson.nodeId);
            const steps = buildStepDirections(route);
            const stepText = formatStepText(steps);

            aiText = `${bestPerson.name} is located in the ${bestPerson.building}, Office ${bestPerson.office}.`;
            if (stepText) {
              aiText += `\n\nSteps:\n${stepText}`;
            }
            aiText += '\n\nWould you like to start navigation?';
            if (bestPerson.nodeId) {
              setPendingTarget({ nodeId: bestPerson.nodeId, destination: bestPerson.name });
            }
          } else if (lowerQuery.includes('exit')) {
            aiText = "The nearest emergency exit is currently the South Staircase, 30 meters from your position.";
          } else if (lowerQuery.includes('safe') || lowerQuery.includes('security')) {
            aiText = "The campus is currently under normal status. Security contact: +91 999 888 7777.";
          } else if (isLocationQuery) {
            aiText = "I could not find that location in the campus directory. Try a room name, person, or scan a QR code.";
          } else {
            const llmReply = await askGemini(
              query,
              "You are a campus navigation assistant. Answer briefly and suggest actionable next steps when possible."
            );
            if (llmReply) {
              aiText = llmReply;
            } else {
              aiText = "I couldn't find that specific person or location. Try searching for 'Dr. Aris' or ask about 'exits'.";
            }
          }
        }
      } catch (e) {
        aiText = "I'm having trouble accessing the directory right now. Please try again.";
      }
      
      setMessages(prev => [...prev, { id: Date.now() + 1, text: aiText, sender: 'ai' }]);
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 800);
  };

  return (
    // ✅ Use View instead of SafeAreaView to allow the parent Modal to control the height
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose || (() => navigation.goBack())} style={styles.backBtn}>
          <Ionicons name={onClose ? "close" : "arrow-back"} size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Campus AI Assistant</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        ref={scrollViewRef}
        style={styles.messageList} 
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map((msg) => (
          <View key={msg.id} style={[styles.bubble, msg.sender === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.bubbleText, msg.sender === 'user' ? styles.userText : styles.aiText]}>
              {msg.text}
            </Text>
          </View>
        ))}
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined} 
        // Small offset so the input doesn't hit the very bottom
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <View style={styles.inputArea}>
          <TextInput 
            style={styles.input} 
            placeholder="Ask about people or safety..." 
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#9ca3af"
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Ionicons name="send" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f3f4f6',
  },
  backBtn: { padding: 5 },
  headerText: { fontSize: 17, fontWeight: 'bold', color: '#1a1a1a' },
  messageList: { flex: 1, paddingHorizontal: 15, paddingTop: 10 },
  bubble: { padding: 12, borderRadius: 18, marginBottom: 8, maxWidth: '85%' },
  userBubble: { alignSelf: 'flex-end', backgroundColor: '#6366f1', borderBottomRightRadius: 4 },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: '#f3f4f6', borderBottomLeftRadius: 4 },
  userText: { color: 'white' },
  aiText: { color: '#1a1a1a' },
  bubbleText: { fontSize: 14, lineHeight: 19 },
  inputArea: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 10, 
    borderTopWidth: 1, 
    borderTopColor: '#f3f4f6',
    backgroundColor: '#fff',
    // Reduced padding for half-screen mode
    paddingBottom: Platform.OS === 'ios' ? 20 : 10 
  },
  input: { 
    flex: 1, 
    backgroundColor: '#f9fafb', 
    borderRadius: 20, 
    paddingHorizontal: 15, 
    height: 40, 
    marginRight: 8,
    fontSize: 14,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  sendBtn: { 
    backgroundColor: '#6366f1', 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
  }
});
