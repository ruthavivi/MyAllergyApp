import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="LoginScreen" />
      <Stack.Screen name="RegisterScreen" />
      <Stack.Screen name="CartScreen" />
      <Stack.Screen name="ChatScreen" />
      <Stack.Screen name="SettingsScreen" />
      <Stack.Screen name="EmergencyScreen" />
      <Stack.Screen name="RestaurantScreen" />
      <Stack.Screen name="ScanScreen" />
      <Stack.Screen name="StoreScreen" />
      <Stack.Screen name="TabNavigator" />
    </Stack>
  );
}
