import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView } from 'react-native';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { collection, onSnapshot } from 'firebase/firestore';
import { TAGS } from '../constants';  // Importar as tags permanentes

const Home = ({ navigation }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
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

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (selectedTags.length > 0) {
      const filtered = recipes.filter(recipe =>
        recipe.tags && recipe.tags.some(tag => selectedTags.includes(tag))
      );

      // Ordena as receitas filtradas, priorizando as que têm tags selecionadas
      const prioritized = filtered.sort((a, b) => {
        const aHasTag = selectedTags.some(tag => a.tags.includes(tag));
        const bHasTag = selectedTags.some(tag => b.tags.includes(tag));

        if (aHasTag && !bHasTag) return -1;
        if (!aHasTag && bHasTag) return 1;
        return 0; // Se ambos têm ou não têm tags, mantém a ordem original
      });

      setFilteredRecipes(prioritized);
    } else {
      setFilteredRecipes(recipes);
    }
  }, [selectedTags, recipes]);

  const handleTagPress = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag) ? prevTags.filter(t => t !== tag) : [...prevTags, tag]
    );
  };

  const handleLogout = () => {
    auth.signOut().then(() => navigation.navigate('Login'));
  };

  const renderTag = (tag) => (
    <TouchableOpacity
      key={tag}
      style={[
        styles.tag,
        selectedTags.includes(tag) && styles.tagSelected
      ]}
      onPress={() => handleTagPress(tag)}
    >
      <Text style={[
        styles.tagText,
        selectedTags.includes(tag) && styles.tagSelectedText
      ]}>{tag}</Text>
    </TouchableOpacity>
  );

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
      <ScrollView horizontal style={styles.tagContainer}>
        {TAGS.map(tag => renderTag(tag))}
      </ScrollView>
      {loading ? (
        <Text>Carregando...</Text>
      ) : filteredRecipes.length > 0 ? (
        <FlatList
          data={filteredRecipes}
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
  tagContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  tag: {
    backgroundColor: '#eee',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  tagSelected: {
    backgroundColor: '#007BFF',
  },
  tagText: {
    color: '#333',
  },
  tagSelectedText: {
    color: '#fff',
  },
});

export default Home;
