import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // Import for gradient

const EmergencyScreen: React.FC = () => {
  const [pressCount, setPressCount] = useState(0);

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
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Emergency Alert</Text>
        <TouchableOpacity style={styles.emergencyButton} onPress={handleEmergencyPress}>
          <Text style={styles.emergencyText}>Call 101</Text>
        </TouchableOpacity>
        <Text style={styles.instructions}>Press the button 3 times to call 101.</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  innerContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
    fontFamily: 'Roboto',
  },
  emergencyButton: {
    backgroundColor: '#2196F3', // צבע כחול מרגיע
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  emergencyText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  instructions: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginTop: 10,
    fontFamily: 'Roboto',
  },
});

export default EmergencyScreen;
