import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, TextInput, TouchableWithoutFeedback, Button } from 'react-native';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { TAGS } from '../constants';  
import FormIngredientes from './FormIngredientes';
import AppLayouts from '../componentes/AppLayouts';
import Navbar from '../componentes/Navbar';

const Home = ({ navigation }) => {
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
      const unsubscribe = onSnapshot(collection(db, 'favorites'), (querySnapshot) => {
        const favoriteList = querySnapshot.docs
          .filter(doc => doc.data().userId === user.uid)
          .map(doc => doc.data().recipeId);
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
    <View style={styles.recipeItem}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />}
      <View style={styles.content}>
        <Text style={styles.recipeTitle}>{item.name || 'Sem nome'}</Text>
        <Text>Criado por: {item.createdBy || 'Anônimo'}</Text>
        <View style={styles.c_footer}>
          <TouchableOpacity style={styles.b_button} onPress={() => navigation.navigate('Detalhes', { recipeId: item.id })}>
            <Text style={styles.viewDetails}>Ver Mais</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.favoritoButton} onPress={() => handleFavoritePress(item.id)}>
            <Image
              source={favorites.includes(item.id) ? require('../assets/imagens/heart-filled.png') : require('../assets/imagens/heart-outline.png')}
              style={styles.favoriteIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={closeDropdown}>
      <AppLayouts scrollable = {true}>
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
                  <Image source={require('../assets/imagens/Search.png')} style={styles.searchicon} />
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity onPress={toggleDropdown} style={styles.menubutton}>
              <Image source={require('../assets/imagens/Menu Vertical.png')} style={styles.menuIcon} />
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

          {/* Formulário de Ingredientes aqui */}
          <FormIngredientes />

          <ScrollView horizontal style={styles.tagContainer}>
            {TAGS.map(tag => renderTag(tag))}
          </ScrollView>
        </View>
        <Button title="Gerar Receita" onPress={() => navigation.navigate('FormIngredientes')} />
        {loading ? (
          <Text style={styles.loading}>Carregando...</Text>
        ) : filteredRecipes.length > 0 ? (
          <FlatList
            data={filteredRecipes}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipeItem}
            ListFooterComponent={<View style={{ height: 100 }} />}
          />
        ) : (
          <Text style={styles.noRecipes}>Sem receitas disponíveis</Text>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add')}>
            <Image source={require('../assets/imagens/criar.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
        <Navbar/>
      </AppLayouts>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  favoritoButton: {
    borderRadius: 5,
    marginLeft: 5,
  },

  favoriteIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },

  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  pesquisa: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 43,
    width: 325,
    flexDirection: 'row',
    margin: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    padding: 10,
    fontSize: 16,
  },
  header: {
    backgroundColor: '#f37e8f',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 10,
    paddingBottom: 20,
    marginBottom: 35,
  },
  menubutton: {
    padding: 2,
    backgroundColor: '#FDD3D9',
    width: 43,
    height: 43,
    borderRadius: 10,
  },
  menuIcon: {
    width: 40,
    height: 40,
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
  },
  tag: {
    backgroundColor: '#f37e8f',
    paddingVertical: 5,
    paddingHorizontal: 15,
    marginRight: 10,
    borderRadius: 20,
  },
  tagSelected: {
    backgroundColor: '#f4a1b2',
  },
  tagText: {
    color: '#fff',
  },
  tagSelectedText: {
    fontWeight: 'bold',
  },
  recipeItem: {
    flexDirection: 'row',
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 5,
    marginRight: 15,
  },
  content: {
    flex: 1,
  },
  recipeTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  c_footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  searchicon: {
    width: 20,
    height: 20,
  },
  loading: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 18,
    color: '#888',
  },
});

export default Home;
