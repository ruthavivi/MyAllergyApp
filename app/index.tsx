import React, { useEffect } from 'react';
import { useRouter } from 'expo-router';  // ייבוא הניווט
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './TabNavigator';

const HomeScreen: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    const navigateToLogin = async () => {
      await new Promise(resolve => setTimeout(resolve, 1000)); // טיימר להבטחת טעינה
      router.replace('/LoginScreen');
    };

    navigateToLogin();
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default HomeScreen;
