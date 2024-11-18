// CartScreen.tsx
import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useCart } from './CartContext';  // הייבוא של ה-Context שלך

const CartScreen: React.FC = () => {
  const { cart, setCart } = useCart();  // שימוש ב-Context

  const removeFromCart = (id: string) => {
    setCart(cart.filter(item => item.id !== id));  // הסרה מהעגלה
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Text style={styles.cartItemName}>{item.name}</Text>
      <Text style={styles.cartItemPrice}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity style={styles.removeButton} onPress={() => removeFromCart(item.id)}>
        <Text style={styles.removeButtonText}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Cart</Text>
      {cart.length === 0 ? (
        <Text style={styles.emptyText}>Your cart is empty!</Text>
      ) : (
        <FlatList
          data={cart}
          renderItem={renderCartItem}
          keyExtractor={item => item.id}
        />
      )}

      {cart.length > 0 && (
        <View style={styles.checkoutContainer}>
          <Text style={styles.totalText}>
            Total: ${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}
          </Text>
          <TouchableOpacity style={styles.checkoutButton}>
            <Text style={styles.checkoutButtonText}>Checkout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f7f9fc',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#7f8c8d',
  },
  cartItem: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#34495e',
  },
  cartItemPrice: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  removeButton: {
    backgroundColor: '#e74c3c',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  removeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkoutContainer: {
    marginTop: 20,
    paddingTop: 10,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 15,
    textAlign: 'center',
  },
  checkoutButton: {
    backgroundColor: '#00bfae',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartScreen;
