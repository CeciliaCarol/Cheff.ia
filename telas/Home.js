import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, TextInput } from 'react-native';
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
      <View style={styles.content}>
        <Text style={styles.recipeTitle}>{item.name || 'Sem nome'}</Text>
        <Text>Criado por: {item.createdBy || 'Anônimo'}</Text>
        <View style={styles.c_footer}>
          <TouchableOpacity style={styles.b_button} onPress={() => navigation.navigate('Detalhes', { recipeId: item.id })}>
          <Text style={styles.viewDetails}>Ver Mais</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
    <View style={styles.searchSection}>
    <TextInput
      style={styles.searchInput}
      placeholder="Pesquise..."
      placeholderTextColor="#aaa"
    />
    <View style={styles.iconContainer}>
      <TouchableOpacity>
        
      </TouchableOpacity>
    </View>
  </View>

      <Button title="Sair" onPress={handleLogout} />
      
      <Button title="Minhas Receitas" onPress={() => navigation.navigate('Receitas')} />
      <ScrollView horizontal style={styles.tagContainer}>
        {TAGS.map(tag => renderTag(tag))}
      </ScrollView>
      </View>
      
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
      
      
       <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add')}>
          <Image source={require('../assets/imagens/criar.png')} style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  
searchSection: {
 flexDirection: 'row',
 alignItems: 'center',
 backgroundColor: '#fff',
 borderRadius: 20,
 paddingHorizontal: 15,
 marginBottom: 10,
},

 header: {
backgroundColor: '#f37e8f',
borderBottomLeftRadius: 20,
borderBottomRightRadius: 20,
padding: 10,

 },
  container: {
    flex: 1,
  
    padding: 0,
    backgroundColor:'#fff',
  },
  welcome: {
    fontSize: 24,
    marginBottom: 20,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    marginVertical: 8,
    padding: 10,
    width: '100%',
    margin:10,
    
   
  },
  recipeTitle: {
    color: '#333',
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Regular',
    alignSelf: 'flex-start'
  },
  viewDetails: {
    color: '#fff',
    fontFamily:'Poppins-Regular',
    fontSize: 20,
  },
  recipeImage: {
    width: 150,
    height: 200,
    borderRadius: 20,
    marginRight: 10,
  },
  tagContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  tag: {
    backgroundColor: '#eee',
    padding: 10,
    marginHorizontal: 8,
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

  footer: {
    width: 70,
    height: 70,
    position: 'absolute',
    bottom: 20,
    right: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 60,                       // Largura do ícone
    height: 60,  
  },
  button: {
    width: 70,                        // Largura do botão
    height: 70,                       // Altura do botão
    borderRadius: 40,                // Faz o botão redondo
    backgroundColor: '#F37E8F',      // Cor de fundo do botão (pode ser alterada)
    justifyContent: 'center',        // Centraliza o conteúdo verticalmente
    alignItems: 'center',            // Centraliza o conteúdo horizontalmente
    elevation: 5,
  },

  c_footer: {
  marginTop: 100,
  
  },

  b_button: {
   backgroundColor:'#f58d94',
   padding: 5,
   borderRadius: 10,
   alignItems: 'center',
  },

  

  content: {
   width: 200,
  },
});

export default Home;
