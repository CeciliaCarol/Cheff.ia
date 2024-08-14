import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Detalhes = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, 'receitas', recipeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe(docSnap.data());
        } else {
          console.log('No such document!');
        }
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar receita:', error);
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!recipe) {
    return <Text>Receita não encontrada</Text>;
  }

  return (
    <View style={styles.container}>
      {recipe.imageUrl && <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />}
      <Text style={styles.title}>{recipe.name}</Text>
      <Text>Ingredientes: {recipe.ingredients.join(', ')}</Text>
      <Text>Instruções: {recipe.instructions}</Text>
      <Text>Tags: {recipe.tags.join(', ')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
});

export default Detalhes;
