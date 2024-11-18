// StoreScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { getFirestore, collection, onSnapshot } from 'firebase/firestore';
import { useCart } from './CartContext';  // הייבוא של ה-Context שלך

const StoreScreen: React.FC = ({ navigation }: any) => {
  const [products, setProducts] = useState<Array<any>>([]);
  const { cart, setCart } = useCart();  // שימוש ב-Context

  // Function to fetch products from Firestore
  const fetchProducts = () => {
    const db = getFirestore();
    const productsRef = collection(db, 'products');

    const unsubscribe = onSnapshot(productsRef, (snapshot) => {
      const productsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(productsList); // Log the products to console
      setProducts(productsList);
    });

    return unsubscribe;
  };

  useEffect(() => {
    const unsubscribe = fetchProducts();
    return () => unsubscribe(); // Release the listener when the component unmounts
  }, []);

  // פונקציה להוספת מוצר לעגלה
  const addToCart = (product: any) => {
    setCart([...cart, product]);
  };

  // הצגת מוצר בתצוגה
  const renderProduct = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>

      {/* כפתור ה-Add to Cart */}
      <TouchableOpacity style={styles.addToCartButton} onPress={() => addToCart(item)}>
        <Text style={styles.addToCartButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Store</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
      />


      <TouchableOpacity
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart')}
      >
        <Text style={styles.cartButtonText}>Go to Cart ({cart.length})</Text>
      </TouchableOpacity>
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
  productList: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 15,
    marginVertical: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  productImage: {
    width: '100%',
    height: 160,
    borderRadius: 12,
    marginBottom: 10,
  },
  productName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#34495e',
  },
  productPrice: {
    fontSize: 18,
    color: '#7f8c8d',
  },
  addToCartButton: {
    backgroundColor: '#00bfae',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartButton: {
    backgroundColor: '#2980b9',
    paddingVertical: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  cartButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StoreScreen;
