import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import AppLayouts from '../componentes/AppLayouts';

const Favoritos = ({ navigation }) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      // Buscar receitas favoritas do usuário
      const favoritesQuery = query(collection(db, 'favorites'), where('userId', '==', user.uid));
      const unsubscribeFavorites = onSnapshot(favoritesQuery, (querySnapshot) => {
        const favoriteRecipeIds = querySnapshot.docs.map(doc => doc.data().recipeId);

        if (favoriteRecipeIds.length > 0) {
          // Buscar receitas com base nos IDs das favoritas
          const recipesQuery = query(collection(db, 'receitas'), where('__name__', 'in', favoriteRecipeIds));
          const unsubscribeRecipes = onSnapshot(recipesQuery, (recipeSnapshot) => {
            const recipes = recipeSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setFavoriteRecipes(recipes);
          });

          return () => unsubscribeRecipes();
        } else {
          setFavoriteRecipes([]); // Nenhum favorito encontrado
        }
      });

      return () => unsubscribeFavorites();
    }
  }, []);

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeItem}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />}
      <View style={styles.content}>
        <Text style={styles.recipeTitle}>{item.name || 'Sem nome'}</Text>
        <Text>Criado por: {item.createdBy || 'Anônimo'}</Text>
        <TouchableOpacity style={styles.viewDetailsButton} onPress={() => navigation.navigate('Detalhes', { recipeId: item.id })}>
          <Text style={styles.viewDetailsText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <AppLayouts scrollable = {true}>
      <Text style={styles.header}>Receitas Favoritas</Text>
      {favoriteRecipes.length > 0 ? (
        <FlatList
          data={favoriteRecipes}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipeItem}
        />
      ) : (
        <Text style={styles.noFavorites}>Você ainda não tem receitas favoritas.</Text>
      )}
    </AppLayouts>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: 25,
    
  },
  header: {
    fontSize: 25,
    marginBottom: 10,
    fontFamily:'PlayfairDisplay-Regular',
    padding: 15,
    textAlign: 'center',
  },
  recipeItem: {
    flexDirection: 'column',
    marginVertical: 8,
    margin: 15,
    padding: 10,
    backgroundColor:'#fff',
    borderRadius: 10,
    elevation: 5,
  },
  recipeImage: {
    width: '100%',
    height: 300,
    marginRight: 10,
    borderRadius: 8,
  },
  content: {
    width: '100%',
  },
  recipeTitle: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 24,
    padding: 5,
  },
  viewDetailsButton: {
    marginTop: 10,
    backgroundColor: '#F58D96',
    padding: 10,
    borderRadius: 10,
  },
  viewDetailsText: {
    color: '#FFF',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
    fontSize: 20,
  },
  noFavorites: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default Favoritos;
