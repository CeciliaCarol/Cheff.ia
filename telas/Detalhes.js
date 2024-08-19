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
        <View style={styles.content}>
          <Text style={styles.title}>{recipe.name}</Text>
          <Text style={styles.conteudo}>Ingredientes</Text>
          {recipe.ingredients?.length > 0 && recipe.ingredients.map((ingredient, index) => (
    <Text key={index} style={styles.ingredientItem}>
      {'\u2022'} {ingredient}
    </Text>
  ))}
          <Text style={styles.conteudo}>Instruções </Text>
          <Text>{recipe.instructions}</Text>
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    marginBottom: 10,
    fontFamily: 'PlayfairDisplay-Regular',
  },
  conteudo: {
    fontSize: 18,
    marginTop: 15,
    marginBottom: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  recipeImage: {
    width: '100%',
    height: 300,
    marginBottom: 5,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  ingredientItem: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export default Detalhes;
