// TabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';
import { CartProvider } from './CartContext';  // הייבוא של ה-Context שלך

import ChatScreen from './ChatScreen';
import RestaurantScreen from './RestaurantScreen';
import ScanScreen from './ScanScreen';
import StoreScreen from './StoreScreen';
import CartScreen from './CartScreen';
import EmergencyScreen from './EmergencyScreen';
import SettingsScreen from './SettingsScreen';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <CartProvider>
      <Tab.Navigator>
        <Tab.Screen
          name="Chat"
          component={ChatScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="comments" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Restaurant"
          component={RestaurantScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="utensils" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="camera" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Store"
          component={StoreScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="shopping-cart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Cart"
          component={CartScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="shopping-cart" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Emergency"
          component={EmergencyScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="exclamation-triangle" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="cogs" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
    </CartProvider>
  );
};

export default TabNavigator;
