import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { getFirestore, doc, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';
import { auth, firestore } from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient'; // Import for gradient

const SettingsScreen: React.FC = () => {
  const [allergies, setAllergies] = useState({
    milk: false,
    peanuts: false,
    gluten: false,
    eggs: false,
    soy: false,
  });
  const router = useRouter();

  useEffect(() => {
    const fetchAllergies = async () => {
      const user = auth.currentUser;

      if (user) {
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            if (userData.allergies) {
              setAllergies(userData.allergies);
            }
          }
        } catch (error) {
          console.error('Error fetching allergies:', error);
          Alert.alert('Error', 'Could not load allergy data.');
        }
      }
    };

    fetchAllergies();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      Alert.alert('Signed Out', 'You have been signed out successfully.');
      router.replace('/LoginScreen');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        await deleteDoc(doc(firestore, 'users', user.uid));
        await deleteUser(user);
        Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
        router.replace('/LoginScreen');
      } catch (error) {
        console.error('Error deleting account:', error);
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'No user is currently signed in.');
    }
  };

  const handleUpdateAllergies = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        await updateDoc(doc(firestore, 'users', user.uid), {
          allergies,
        });
        Alert.alert('Allergies Updated', 'Your allergies have been updated successfully.');
      } catch (error) {
        Alert.alert('Error', error.message);
      }
    } else {
      Alert.alert('Error', 'No user is currently signed in.');
    }
  };

  const toggleAllergy = (allergy: string) => {
    setAllergies((prevAllergies) => ({
      ...prevAllergies,
      [allergy]: !prevAllergies[allergy],
    }));
  };

  return (
    <LinearGradient colors={['#A7C7E7', '#ffffff']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Account Settings</Text>

        <Text style={styles.subtitle}>Select your allergies:</Text>

        <View style={styles.allergyContainer}>
          {Object.keys(allergies).map((allergy) => (
            <TouchableOpacity
              key={allergy}
              onPress={() => toggleAllergy(allergy)}
              style={[
                styles.allergyButton,
                { backgroundColor: allergies[allergy] ? '#A7C7E7' : '#ffffff' },
              ]}
            >
              <Text style={styles.allergyText}>
                {allergy.charAt(0).toUpperCase() + allergy.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.updateButton} onPress={handleUpdateAllergies}>
            <Text style={styles.updateButtonText}>Update Allergies</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteAccount}>
            <Text style={styles.deleteButtonText}>Delete Account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  contentContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    color: '#1A3E6C',
    fontWeight: '600',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 18,
    color: '#1A3E6C',
    marginBottom: 15,
  },
  allergyContainer: {
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  allergyButton: {
    width: '80%',
    paddingVertical: 14,
    marginBottom: 15,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  allergyText: {
    color: '#1A3E6C',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  updateButton: {
    backgroundColor: '#A7C7E7',
    paddingVertical: 14,
    width: '80%',
    borderRadius: 30,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  updateButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signOutButton: {
    backgroundColor: '#B5E6F3',
    paddingVertical: 14,
    width: '80%',
    borderRadius: 30,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  signOutButtonText: {
    color: '#1A3E6C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#D9E8F9',
    paddingVertical: 14,
    width: '80%',
    borderRadius: 30,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  deleteButtonText: {
    color: '#1A3E6C',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SettingsScreen;
