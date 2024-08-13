import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList } from 'react-native';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const Receitas = ({ navigation }) => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const q = query(collection(db, 'receitas'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserRecipes(recipesList);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar receitas do usuário: ', error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeItem}>
      <Text style={styles.recipeTitle}>{item.name || 'Sem nome'}</Text>
      <Text>Ingredientes: {item.ingredients && item.ingredients.length > 0 ? item.ingredients.join(', ') : 'Nenhum'}</Text>
      <Text>Instruções: {item.instructions || 'Nenhuma'}</Text>
      <Text>Tags: {item.tags && item.tags.length > 0 ? item.tags.join(', ') : 'Nenhuma'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Minhas Receitas</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
      {loading ? (
        <Text>Carregando...</Text>
      ) : userRecipes.length > 0 ? (
        <FlatList
          data={userRecipes}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipeItem}
        />
      ) : (
        <Text>Você não criou nenhuma receita ainda</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  welcome: {
    fontSize: 24,
    marginBottom: 20,
  },
  recipeItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
  },
  recipeTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default Receitas;
