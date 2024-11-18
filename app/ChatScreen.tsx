import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Image, KeyboardAvoidingView, Platform, Keyboard, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { collection, addDoc, query, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { auth, firestore, storage } from './firebaseConfig';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ImageBackground from 'react-native/Libraries/Image/ImageBackground';
import { useFocusEffect } from '@react-navigation/native';

// ייבוא תמונת הרקע החדשה
import AllergyBackground from '../assets/images/allergy.jpg';

// תמונות אחרות
import milkImage from '../assets/images/milk.webp';
import peanutsImage from '../assets/images/Peanut.webp';
import eggsImage from '../assets/images/eggs.webp';
import soyImage from '../assets/images/soy.webp';
import glutenImage from '../assets/images/gluten.webp';

// פונקציה שמחזירה את תמונת הרקע המתאימה בהתאם לאלרגיה
const getBackgroundImage = (allergy) => {
  switch (allergy) {
    case 'milk':
      return milkImage;
    case 'peanuts':
      return peanutsImage;
    case 'eggs':
      return eggsImage;
    case 'soy':
      return soyImage;
    case 'gluten':
      return glutenImage;
    default:
      return AllergyBackground;
  }
};

const ChatScreen: React.FC = () => {
  const [allergies, setAllergies] = useState<string[]>([]);
  const [selectedAllergy, setSelectedAllergy] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');
  const [messages, setMessages] = useState<Array<any>>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false); // סטייט לרענון
  const flatListRef = useRef<FlatList>(null);

  // פונקציה של רענון המידע
  const fetchAllergies = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.allergies) {
            setAllergies(Object.keys(userData.allergies).filter((allergy) => userData.allergies[allergy]));
          }
        }
      } catch (error) {
        console.error('Error fetching allergies:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  // קריאה מחדש על כל מעבר לדף הצ'אטים
  useFocusEffect(
    React.useCallback(() => {
      fetchAllergies(); // רענון הנתונים
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAllergies(); // קריאה מחדש לפיירבייס על מנת לרענן את רשימת הקבוצות
    setRefreshing(false);
  };

  useEffect(() => {
    if (selectedAllergy) {
      const messagesRef = collection(firestore, 'chats', selectedAllergy, 'messages');
      const q = query(messagesRef, orderBy('createdAt', 'asc'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const loadedMessages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(loadedMessages);
      });
      return () => unsubscribe();
    }
  }, [selectedAllergy]);

  const handleSendMessage = async () => {
    if (message.trim() === '' || !selectedAllergy) return;
    const user = auth.currentUser;
    if (user) {
      try {
        await addDoc(collection(firestore, 'chats', selectedAllergy, 'messages'), {
          text: message,
          createdAt: new Date(),
          userId: user.uid,
          email: user.email,
        });
        setMessage(''); // ניקוי השדה לאחר שליחת הודעה
        Keyboard.dismiss();
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

  const handlePickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled && selectedAllergy) {
      const { uri, type } = result;
      const filename = uri.split('/').pop();
      const fileRef = ref(storage, `chats/${selectedAllergy}/${filename}`);
      const response = await fetch(uri);
      const blob = await response.blob();

      await uploadBytes(fileRef, blob);
      const downloadURL = await getDownloadURL(fileRef);

      await addDoc(collection(firestore, 'chats', selectedAllergy, 'messages'), {
        mediaUrl: downloadURL,
        mediaType: type,
        createdAt: new Date(),
        userId: auth.currentUser?.uid,
        email: auth.currentUser?.email,
      });
    }
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#00bfae" />
        <Text>Loading your allergy groups...</Text>
      </View>
    );
  }

  const handleBackToAllergies = () => {
    setSelectedAllergy(null);
    setMessages([]);
  };

  return (
    <ImageBackground source={getBackgroundImage(selectedAllergy || 'default')} style={styles.container}>
      <LinearGradient colors={['rgba(0,0,0,0.5)', 'transparent']} style={styles.overlay}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={Platform.OS === 'ios' ? 140 : 0}>
          {selectedAllergy ? (
            <View style={{ flex: 1 }}>
              <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={handleBackToAllergies}>
                  <Icon name="arrow-left" size={20} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.chatTitle}>{selectedAllergy} Chat</Text>
              </View>
              <FlatList
                ref={flatListRef}
                data={messages}
                renderItem={({ item }) => (
                  <View style={item.userId === auth.currentUser?.uid ? styles.myMessageContainer : styles.otherMessageContainer}>
                    <View style={styles.messageCard}>
                      <Text style={styles.messageEmail}>{item.email}</Text>
                      {item.text ? <Text style={styles.messageText}>{item.text}</Text> : null}
                      {item.mediaUrl ? (
                        item.mediaType.startsWith('image') ? (
                          <Image source={{ uri: item.mediaUrl }} style={styles.mediaImage} />
                        ) : (
                          <Text style={styles.messageText}>Video link: {item.mediaUrl}</Text>
                        )
                      ) : null}
                    </View>
                  </View>
                )}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
              />
              <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="Type a message" value={message} onChangeText={setMessage} placeholderTextColor="#aaa" onSubmitEditing={handleSendMessage} />
                <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                  <Icon name="send" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.mediaButton} onPress={handlePickMedia}>
                  <Icon name="camera" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.allergyGroupContainer}>
              <Text style={styles.title}>Allergy Chat Groups</Text>
              <FlatList
                data={allergies}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.allergyCard} onPress={() => setSelectedAllergy(item)}>
                    <Text style={styles.allergyText}>{item.charAt(0).toUpperCase() + item.slice(1)} Chat</Text>
                  </TouchableOpacity>
                )}
                keyExtractor={(item) => item}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
              />
            </View>
          )}
        </KeyboardAvoidingView>
      </LinearGradient>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.7,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginVertical: 20,
  },
  allergyGroupContainer: {
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  chatTitle: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  allergyCard: {
    backgroundColor: '#ffffff',
    marginVertical: 10,
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  allergyText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  messageCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  mediaImage: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: '#00796b', // צבע ירוק כהה
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  mediaButton: {
    backgroundColor: 'rgba(0, 121, 107, 0.7)', // צבע ירוק כהה עם שקיפות
    borderRadius: 20,
    padding: 10,
    marginLeft: 5,
  },
  myMessageContainer: {
    alignItems: 'flex-end',
  },
  otherMessageContainer: {
    alignItems: 'flex-start',
  },
});

export default ChatScreen;
