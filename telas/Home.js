import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, deleteDoc } from 'firebase/firestore';

const Home = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth.currentUser?.uid; // ID do usuário autenticado

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

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'receitas', id));
      console.log('Receita excluída com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir receita: ', error);
    }
  };

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeItem}>
      <Text style={styles.recipeTitle}>{item.name || 'Sem nome'}</Text>
      <Text>Ingredientes: {item.ingredients && item.ingredients.length > 0 ? item.ingredients.join(', ') : 'Nenhum'}</Text>
      <Text>Instruções: {item.instructions || 'Nenhuma'}</Text>
      <Text>Tags: {item.tags && item.tags.length > 0 ? item.tags.join(', ') : 'Nenhuma'}</Text>
      {item.userId === userId && (
        <TouchableOpacity onPress={() => navigation.navigate('Edit', { recipeId: item.id })}>
          <Text style={styles.editButton}>Editar</Text>
        </TouchableOpacity>
      )}
      {item.userId === userId && (
        <Button title="Excluir" onPress={() => handleDelete(item.id)} />
      )}
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
  editButton: {
    color: 'blue',
    marginTop: 10,
    fontSize: 16,
  },
});

export default Home;
