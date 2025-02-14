import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, onSnapshot, setDoc, deleteDoc } from 'firebase/firestore';
import AppLayouts from '../componentes/AppLayouts';

const Detalhes = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

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

    const checkFavoriteStatus = () => {
      const user = auth.currentUser;
      if (user) {
        const favoritesRef = collection(db, 'favorites');
        const q = query(favoritesRef, where('userId', '==', user.uid), where('recipeId', '==', recipeId));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          setIsFavorite(!querySnapshot.empty);
        });

        return unsubscribe; // Return unsubscribe function
      }
    };

    fetchRecipe();
    const unsubscribe = checkFavoriteStatus();

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Call unsubscribe if it exists
      }
    };
  }, [recipeId]);

  const handleFavoritePress = async () => {
    const user = auth.currentUser;
    if (user) {
      const favoriteRef = doc(db, 'favorites', `${user.uid}_${recipeId}`);

      if (isFavorite) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, { userId: user.uid, recipeId });
      }
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!recipe) {
    return <Text>Receita não encontrada</Text>;
  }

  return (
    <AppLayouts scrollable = {true}>
      {recipe.imageUrl && <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />}
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{recipe.name}</Text>
          <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
            <Image
              source={isFavorite ? require('../assets/imagens/heart-filled.png') : require('../assets/imagens/heart-outline.png')}
              style={styles.favoriteIcon}
            />
          </TouchableOpacity>
        </View>
        <Text>Criado por: {recipe.createdBy}</Text>
        <Text style={styles.conteudo}>Ingredientes</Text>
        {recipe.ingredients?.length > 0 && recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientItem}>
            {'\u2022'} {ingredient}
          </Text>
        ))}
        <Text style={styles.conteudo}>Instruções</Text>
        <Text>{recipe.instructions}</Text>
      </View>
      </AppLayouts>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    marginTop: 40,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 32,
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
    borderRadius: 30,
  },
  ingredientItem: {
    fontSize: 16,
    lineHeight: 24,
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
  },
});

export default Detalhes;
