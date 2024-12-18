import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';
import Constants from 'expo-constants'; // Import Constants from expo

const AIAssistantScreen: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [pressCount, setPressCount] = useState(0); // Counter for the emergency button

  // Accessing the API key from Constants
  const apiKey = Constants.expoConfig.extra.HUGGINGFACE_API_KEY;

  const handleAskAI = async () => {
    if (!input.trim()) {
      Alert.alert('Error', 'Please enter a question.');
      return;
    }

    setLoading(true);
    setResponse('');

    try {
      const result = await axios.post(
        'https://api-inference.huggingface.co/models/gpt2', // Replace gpt2 with another model if needed
        {
          inputs: input,
        },
        {
          headers: {
            Authorization: `Bearer ${apiKey}`, // Using the API key from Constants
            'Content-Type': 'application/json',
          },
        }
      );

      const aiResponse = result.data?.generated_text || 'No response generated.';
      setResponse(aiResponse);
    } catch (error: any) {
      console.error('Error:', error);

      if (error.response) {
        Alert.alert(
          'API Error',
          `Server responded with status: ${error.response.status}\nMessage: ${error.response.data.error || 'Unknown error'}`
        );
      } else if (error.request) {
        Alert.alert('Network Error', 'No response from the server. Check your internet connection.');
      } else {
        Alert.alert('Error', `An unexpected error occurred: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyPress = () => {
    setPressCount(pressCount + 1);

    if (pressCount + 1 === 3) {
      setPressCount(0);
      Alert.alert('Emergency', 'Calling 101...');
      Linking.openURL('tel:101');
    }
  };

  return (
    <LinearGradient colors={['#E3F2FD', '#BBDEFB']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.innerContainer}>
        <Text style={styles.title}>AI Assistant & Emergency</Text>

        <TextInput
          style={styles.input}
          placeholder="Ask me anything..."
          value={input}
          onChangeText={setInput}
        />
        <TouchableOpacity style={styles.button} onPress={handleAskAI} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? 'Loading...' : 'Ask AI'}</Text>
        </TouchableOpacity>
        {response ? (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>AI Response:</Text>
            <Text style={styles.responseText}>{response}</Text>
          </View>
        ) : null}

        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyPress}>
          <Text style={styles.emergencyText}>Emergency: Call 101</Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>Press the emergency button 3 times to call 101:.</Text>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  // Same styles as in your original code
});

export default AIAssistantScreen;
