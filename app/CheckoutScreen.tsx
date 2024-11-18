import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useRoute } from '@react-navigation/native';

const CheckoutScreen: React.FC = () => {
  const route = useRoute();
  const { product } = route.params; // מקבלים את המוצר שנבחר

  const handleConfirmPurchase = () => {
    // כאן אפשר להוסיף את הקוד לרכישת המוצר
    alert(`You have confirmed the purchase of ${product.name}!`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Checkout</Text>
      <Text style={styles.productName}>{product.name}</Text>
      <Text style={styles.productPrice}>${product.price.toFixed(2)}</Text>
      {/* אפשר להוסיף כאן שדות נוספים כמו כתובת למשלוח, פרטי תשלום וכו' */}
      <Button title="Confirm Purchase" onPress={handleConfirmPurchase} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e5ddd5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#007a7c',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 16,
    color: 'gray',
  },
});

export default CheckoutScreen;
