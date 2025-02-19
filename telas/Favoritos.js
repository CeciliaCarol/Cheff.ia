import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { auth } from '../firebaseConfig';
import AppLayouts from '../componentes/AppLayouts';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const Favoritos = ( ) => {
  const [favoriteRecipes, setFavoriteRecipes] = useState([]);
  const navigation = useNavigation();

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

  //Função para voltar pra tela anterior
 const handlegoBack = () => {
  navigation.goBack();
};

  return (
    <AppLayouts >
      <View style={styles.welcome}>
        <TouchableOpacity style={styles.backButton} onPress={handlegoBack}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.recipeTitle} >Meus Favoritos</Text>
        </View>
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
  backButton: {
    position: "absolute",
        top: 0,
        left: 0,
        margin: 10,
        backgroundColor: "#fff",
        width: 35,
        height: 35,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
  },
  welcome: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    padding: 30,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 10,
    textAlign: 'center',
    backgroundColor: "#F9D5CD",
  },
  recipeItem: {
    flexDirection: 'column',
    marginHorizontal: 2,
    marginVertical: 15,
    padding: 10,
    backgroundColor:'#fff',
    borderRadius: 10,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
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
