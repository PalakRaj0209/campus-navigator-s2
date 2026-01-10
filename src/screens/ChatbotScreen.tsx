import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, 
  TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

// IMPORT: Connect to your SQLite database logic
import { getPersonByName } from '../db/database';

interface ChatbotProps {
  onClose?: () => void;
}

export default function ChatbotScreen({ onClose }: ChatbotProps) {
  const navigation = useNavigation<any>();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! I'm your Campus AI. How can I help you find a room, locate a person, or stay safe today?", sender: 'ai' }
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    
    const userMsg = { id: Date.now(), text: inputText, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    const query = inputText.trim();
    setInputText('');

    setTimeout(async () => {
      let aiText = "I'm checking the campus directory for you...";
      const lowerQuery = query.toLowerCase();
      
      try {
        const person = await getPersonByName(query);
        if (person) {
          aiText = `${person.name} is located in the ${person.building}, Office ${person.office}. Would you like to start navigation?`;
        } else if (lowerQuery.includes('exit')) {
          aiText = "The nearest emergency exit is currently the South Staircase, 30 meters from your position.";
        } else if (lowerQuery.includes('safe') || lowerQuery.includes('security')) {
          aiText = "The campus is currently under normal status. Security contact: +91 999 888 7777.";
        } else {
          aiText = "I couldn't find that specific person or location. Try searching for 'Dr. Aris' or ask about 'exits'.";
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