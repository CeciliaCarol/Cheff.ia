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
      <View style={styles.perfil_content}>
              <TouchableOpacity style={styles.imagem_perfil}></TouchableOpacity>
              <Text style={styles.autor}> {item.createdBy || 'Anônimo'}</Text>
            </View>
      <TouchableOpacity 
              onPress={() => navigation.navigate('Detalhes', { recipeId: item.id })}
              activeOpacity={0.8} // Deixa o clique mais suave
      >
              { item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />}
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.recipeTitle}>{item.name || 'Sem nome'}</Text>
       {/* <TouchableOpacity 
    style={styles.removeFavoriteButton} 
    onPress={() => handleFavoritePress(item.id)} // Função que remove
  >
    <Ionicons name="heart-dislike-outline" size={30} color="#f37e8f" />
  </TouchableOpacity>*/}
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
          numColumns={2}
        />
      ) : (
        <Text style={styles.noFavorites}>Você ainda não tem receitas favoritas.</Text>
      )}
     
    </AppLayouts>
  );
};

const styles = StyleSheet.create({
  perfil_content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 5,
  },
  
  imagem_perfil: {
    width: 30,
    height: 30,
    borderRadius: 50,
    backgroundColor: "#333333",
  },
  autor: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "700",
  },

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
    flex: 1,
    marginHorizontal: 5,
    marginVertical: 10,
    padding: 8,
    backgroundColor:'#fff',
    borderRadius: 10,
    elevation: 2,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
  },
  recipeTitle: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 24,
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
