import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, ImageBackground } from 'react-native';
import { doc, getDoc } from 'firebase/firestore';
import { auth, firestore } from './firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

interface Recipe {
  title: string;
  ingredients: string[];
  instructions: string;
  allergens: string[];
}

const recipes: Recipe[] = [
  {
    title: 'Vegan Pancakes',
    ingredients: ['Flour', 'Soy milk', 'Baking powder', 'Maple syrup'],
    instructions: 'Mix all ingredients and cook on a hot griddle.',
    allergens: ['gluten', 'soy'],
  },
  {
    title: 'Gluten-Free Pasta',
    ingredients: ['Gluten-free pasta', 'Tomato sauce', 'Basil'],
    instructions: 'Cook pasta, add sauce, and garnish with basil.',
    allergens: [],
  },
  {
    title: 'Egg-Free Brownies',
    ingredients: ['Flour', 'Cocoa powder', 'Sugar', 'Vegetable oil'],
    instructions: 'Mix all ingredients, bake at 180°C for 25 minutes.',
    allergens: ['gluten'],
  },
];

const RestaurantScreen: React.FC = () => {
  const [userAllergies, setUserAllergies] = useState<string[]>([]);

  const fetchAllergies = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData.allergies) {
            const allergyList = Object.keys(userData.allergies).filter(
              (allergy) => userData.allergies[allergy]
            );
            setUserAllergies(allergyList);
          }
        }
      } catch (error) {
        console.error('Error fetching allergies:', error);
        Alert.alert('Error', 'Could not load allergy data.');
      }
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchAllergies();
    }, [])
  );

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.allergens.every((allergen) => !userAllergies.includes(allergen))
  );

  return (
    <ImageBackground
      source={require('../assets/images/chef.png')}
      style={styles.container}
    >
      <LinearGradient colors={['rgba(0,0,0,0.7)', 'transparent']} style={styles.overlay} />
      <Text style={styles.title}>Recipes for You</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {filteredRecipes.map((recipe, index) => (
          <View key={index} style={styles.recipeContainer}>
            <Text style={styles.recipeTitle}>{recipe.title}</Text>
            <Text style={styles.recipeSubtitle}>Ingredients:</Text>
            {recipe.ingredients.map((ingredient, i) => (
              <Text key={i} style={styles.ingredient}>{ingredient}</Text>
            ))}
            <Text style={styles.recipeSubtitle}>Instructions:</Text>
            <Text style={styles.instructions}>{recipe.instructions}</Text>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#fff',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
    textAlign: 'center',
  },
  recipeContainer: {
    marginBottom: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20,
    borderRadius: 12,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  recipeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  recipeSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 10,
    color: '#555',
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 5,
    color: '#666',
  },
  instructions: {
    fontSize: 16,
    color: '#444',
  },
});

export default RestaurantScreen;
