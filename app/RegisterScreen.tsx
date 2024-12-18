import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { LinearGradient } from 'expo-linear-gradient'; // For gradient background
import { auth, firestore } from './firebaseConfig'; // Import auth and firestore from firebaseConfig
import Constants from 'expo-constants';

const RegisterScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [allergies, setAllergies] = useState({
    milk: false,
    peanuts: false,
    gluten: false,
    eggs: false,
    soy: false,
  });
  const router = useRouter();

  const toggleAllergy = (allergy: string) => {
    setAllergies((prevAllergies) => ({
      ...prevAllergies,
      [allergy]: !prevAllergies[allergy],
    }));
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', "Passwords don't match");
      return;
    }

    if (!name) {
      Alert.alert('Error', 'Please enter your name.');
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Save user data to Firestore
      await setDoc(doc(firestore, 'users', userId), {
        name,
        email,
        allergies,
      });

      Alert.alert('Registration Successful', `Welcome, ${name}`);
      router.push('/LoginScreen'); // Navigate to login screen after registration
    } catch (error: any) {
      Alert.alert('Registration error', error.message);
    }
  };

  return (
    <LinearGradient colors={['#ffafbd', '#ffc3a0']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#aaa" // Darker placeholder color
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholderTextColor="#aaa" // Darker placeholder color
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholderTextColor="#aaa" // Darker placeholder color
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholderTextColor="#aaa" // Darker placeholder color
        />

        <View style={styles.allergyContainer}>
          <Text style={styles.subtitle}>Select your allergies:</Text>

          {Object.keys(allergies).map((allergy) => (
            <TouchableOpacity
              key={allergy}
              onPress={() => toggleAllergy(allergy)}
              style={[
                styles.allergyButton,
                { backgroundColor: allergies[allergy] ? '#d9534f' : '#5bc0de' },
              ]}
            >
              <Text style={styles.allergyText}>
                {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 20,
    color: '#fff',
    fontSize: 16,
  },
  allergyContainer: {
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 10,
  },
  allergyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 25,
    marginBottom: 10,
  },
  allergyText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  registerButton: {
    backgroundColor: '#00b894',
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 25,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 5,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
