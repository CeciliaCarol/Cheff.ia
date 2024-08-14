import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';

const Home = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'receitas'), (querySnapshot) => {
      const recipesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesList);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar receitas: ', error);
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, []);

  const handleLogout = () => {
    auth.signOut().then(() => navigation.navigate('Login'));
  };

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeItem}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />}
      <Text style={styles.recipeTitle}>{item.name || 'Sem nome'}</Text>
      <Text>Criado por: {item.createdBy || 'Anônimo'}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Detalhes', { recipeId: item.id })}>
        <Text style={styles.viewDetails}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Bem-vindo à Tela Inicial!</Text>
      <Button title="Sair" onPress={handleLogout} />
      <Button title='Criar' onPress={() => navigation.navigate('Add')} />
      <Button title="Minhas Receitas" onPress={() => navigation.navigate('Receitas')} />

      {loading ? (
        <Text>Carregando...</Text>
      ) : recipes.length > 0 ? (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipeItem}
        />
      ) : (
        <Text>Sem receitas disponíveis</Text>
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
  viewDetails: {
    color: 'blue',
    marginTop: 5,
    fontSize: 16,
  },
  recipeImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
});

export default Home;
