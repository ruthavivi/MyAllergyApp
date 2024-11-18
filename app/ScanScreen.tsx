import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator, ImageBackground } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './firebaseConfig';

const ScanScreen: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allergies, setAllergies] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAllergies = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "User is not logged in.");
      return;
    }

    try {
      const userDocRef = doc(firestore, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        if (userData && userData.allergies) {
          const userAllergies = Object.keys(userData.allergies).filter(
            (allergy) => userData.allergies[allergy]
          );
          setAllergies(userAllergies);
        }
      } else {
        Alert.alert("Error", "User data not found.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch allergies.");
    }
  };

  useEffect(() => {
    fetchAllergies();
  }, []);

  const handleImagePick = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      analyzeImageWithAPI(result.assets[0].uri);
    }
  };

  const translateTextToEnglish = async (text: string): Promise<string> => {
    try {
      const response = await axios.post(
        `https://translation.googleapis.com/language/translate/v2?key=AIzaSyBo9z2tFCJKziGiu84i3YkRuCeu7qHH8Tw`,
        { q: text, target: 'en' }
      );
      return response.data.data.translations[0].translatedText;
    } catch (error) {
      return text;
    }
  };

  const analyzeImageWithAPI = async (uri: string) => {
    setLoading(true);
    const base64Image = await fetch(uri)
      .then((res) => res.blob())
      .then((blob) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      }));

    const formData = JSON.stringify({
      requests: [
        {
          image: { content: (base64Image as string).split(',')[1] },
          features: [{ type: 'TEXT_DETECTION' }],
        },
      ],
    });

    try {
      const response = await axios.post(
        `https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBo9z2tFCJKziGiu84i3YkRuCeu7qHH8Tw`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );
      const recognizedText = response.data.responses[0]?.fullTextAnnotation?.text || '';
      const translatedText = await translateTextToEnglish(recognizedText);

      const foundAllergies = allergies.filter(allergy =>
        translatedText.toLowerCase().includes(allergy.toLowerCase())
      );

      if (foundAllergies.length > 0) {
        Alert.alert('Warning', `The product contains: ${foundAllergies.join(', ')}. It's not safe for you!`);
      } else {
        Alert.alert('Success', 'The product is safe for you.');
      }
    } catch (error) {
      Alert.alert('Error', 'Could not recognize text. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground source={require('../assets/images/food.jpg')} style={styles.container}>
      <View style={styles.overlay} />
      <Text style={styles.title}>Scan Ingredients</Text>
      <TouchableOpacity style={styles.button} onPress={handleImagePick}>
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.capturedImage} />
      ) : (
        <Text style={styles.placeholder}>No image selected</Text>
      )}
      {loading && <ActivityIndicator size="large" color="#00BCD4" />}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Darker overlay
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    color: '#fff',
    fontWeight: '700',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.8)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 6,
  },
  button: {
    backgroundColor: '#00BCD4',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  capturedImage: {
    width: '90%',
    height: 300,
    marginTop: 20,
    borderRadius: 15,
    resizeMode: 'cover',
    borderWidth: 1,
    borderColor: '#00BCD4',
  },
  placeholder: {
    fontSize: 18,
    color: '#ccc',
    marginTop: 20,
  },
});

export default ScanScreen;
