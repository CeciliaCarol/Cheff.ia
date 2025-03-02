import React, { useEffect, useState } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, TextInput, TouchableWithoutFeedback, Button 
} from 'react-native';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, setDoc, deleteDoc, query, where } from 'firebase/firestore';
import { TAGS } from '../constants';  
import FormIngredientes from './FormIngredientes';
import AppLayouts from '../componentes/AppLayouts';
import { Ionicons } from '@expo/vector-icons';

const Home = ({ navigation, route }) => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [favorites, setFavorites] = useState([]);
  


  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const closeDropdown = () => {
    setDropdownVisible(false);
  };

  

  // Código para lidar com favoritos
  const handleFavoritePress = async (recipeId) => {
    const user = auth.currentUser;
    if (user) {
      const favoriteRef = doc(collection(db, 'favorites'), `${user.uid}_${recipeId}`);
      const exists = favorites.includes(recipeId);

      if (exists) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, { userId: user.uid, recipeId });
      }
    }
  };

  // Código para exibir o estado do favorito
  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, 'favorites'), where('userId', '==', user.uid)); // Filtra só os favoritos do usuário
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const favoriteList = querySnapshot.docs.map(doc => doc.data().recipeId);
        setFavorites(favoriteList);
      });
  
      return () => unsubscribe();
    }
  }, []);
  

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'receitas'), (querySnapshot) => {
      const recipesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecipes(recipesList);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar receitas: ', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = recipes;

    if (selectedTags.length > 0) {
      filtered = filtered.filter(recipe =>
        recipe.tags && recipe.tags.some(tag => selectedTags.includes(tag))
      );

      filtered = filtered.sort((a, b) => {
        const aHasTag = selectedTags.some(tag => a.tags.includes(tag));
        const bHasTag = selectedTags.some(tag => b.tags.includes(tag));

        if (aHasTag && !bHasTag) return -1;
        if (!aHasTag && bHasTag) return 1;
        return 0;
      });
    }

    if (searchText) {
      filtered = filtered.filter(recipe =>
        recipe.name && recipe.name.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Ordenar por data (mais recente primeiro)
    filtered = filtered.sort((a, b) => b.createdAt.toDate() - a.createdAt.toDate());

    setFilteredRecipes(filtered);
  }, [selectedTags, recipes, searchText]);

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
    <View style={styles.recipeItem} >
      <View style={styles.perfil_content}>
        <TouchableOpacity style={styles.imagem_perfil}>

        </TouchableOpacity>
        <Text style={styles.autor}> {item.createdBy || 'Anônimo'}</Text>
      </View>
       {item.imageUrl && (
      <TouchableOpacity 
        onPress={() => navigation.navigate('Detalhes', { recipeId: item.id })}
        activeOpacity={0.8} // Deixa o clique mais suave
      >
        <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />
      </TouchableOpacity>
    )}
    
      <View style={styles.content}>
        <Text style={styles.recipeTitle}>{item.name || 'Sem nome'}</Text>
        <View style={styles.c_footer}>
          
          <TouchableOpacity style={styles.favoritoButton} onPress={() => handleFavoritePress(item.id)}>
            <Ionicons 
              name={favorites.includes(item.id) ? 'heart' : 'heart-outline'}
              size={30}
              color={favorites.includes(item.id) ? '#f37e8f' : '#f37e8f'}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Comments', { recipeId: item.id })}>
            <Ionicons name="chatbubble-outline" size={30} color="#333" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <AppLayouts>
        <View style={styles.header}>
          <View style={styles.searchSection}>
            <View style={styles.pesquisa}>
              <TextInput
                style={styles.searchInput}
                placeholder="Pesquise..."
                placeholderTextColor="#f37e8f"
                value={searchText}
                onChangeText={setSearchText}
              />
              <View style={styles.iconContainer}>
                <TouchableOpacity>
                  <Ionicons name='search' size={24} color="#f37e8f"/>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={toggleDropdown} style={styles.menubutton}>
              <Ionicons name='ellipsis-vertical' size={30} color="#fff"/>
            </TouchableOpacity>
          </View>
          {dropdownVisible && (
            <View style={styles.dropdown}>
              <TouchableOpacity onPress={() => navigation.navigate('Receitas')} style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>Minhas Receitas</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.navigate('Favoritos')} style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>Favoritos</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={styles.dropdownItem}>
                <Text style={styles.dropdownText}>Sair</Text>
              </TouchableOpacity>
            </View>
          )}

          <Text style={styles.titulotext}>Olá, Cheff!</Text>
        </View>  
        <Text style={styles.recipeTitle}>Categorias</Text>
        <ScrollView horizontal style={styles.tagContainer}>
          {TAGS.map(tag => renderTag(tag))}
        </ScrollView>      
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipeItem}
          ListFooterComponent={<View style={{ height: 100 }} />}
        />
      </AppLayouts>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({

  perfil_content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  
  imagem_perfil: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: "#333",
  },
  autor: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "700",
  },
  titulotext: {
    fontSize: 28,
    color: '#fff',
    fontFamily: 'PlayfairDisplay-Regular',
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    margin: 10,
  },
  favoritoButton: {
    marginRight: 30,
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pesquisa: {
    backgroundColor: '#fff',
    borderRadius: 30,
    height: 43,
    width: 280, 
    flexDirection: 'row',
  },
  searchInput: {
    flex: 1,
    height: 40,
    padding: 10,
    fontSize: 16,
  },
  header: {
    backgroundColor: '#f17166',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 10,
    marginTop: 0,
    marginBottom: 20,
    width: "100%",
  },
  menubutton: {
    padding: 2,
    backgroundColor: '#FDD3D9',
    width: 43,
    height: 43,
    borderRadius: 30,
    marginLeft: 10, 
    justifyContent: "center",
    alignItems: "center",
  },
  dropdown: {
    position: 'absolute',
    top: 50,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    elevation: 10,
    width: 150,
    zIndex: 1000,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  tagContainer: {
    flexDirection: 'row',
    marginTop: 10,
    paddingBottom: 80,
  },
  tag: {
    backgroundColor: '#015927', 
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 10,
    width: 90,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  tagSelected: {
    backgroundColor: '#218838', 
  },
  tagText: {
    color: '#fff',
    fontWeight: "700", 
  },
  tagSelectedText: {
    fontWeight: 'bold',
  },
  recipeItem: {
    flexDirection: "column",
    padding: 0,
    marginVertical: 20,
    borderRadius: 10,
  },
  recipeImage: {
    width: "100%",
    height: 250,
    borderRadius: 15,
    marginRight: 15,
  },
  content: {
    justifyContent: "space-between",
    flexDirection: "row",
    marginTop: 10,
  },
  recipeTitle: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  c_footer: {
    flexDirection: 'row',
    justifyContent: "flex-start",
    alignItems: 'center',
  },
  b_button: {
    backgroundColor: '#f37e8f',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  viewDetails: {
    color: '#fff',
  },
  noRecipes: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
    color: '#888',
  },
  footer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#f37e8f',
    padding: 15,
    borderRadius: 10,
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#888',
  },
});

export default Home;