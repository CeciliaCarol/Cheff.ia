import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, ScrollView, TextInput, TouchableWithoutFeedback } from 'react-native';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { collection, onSnapshot, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { TAGS } from '../constants';  // Certifique-se de que essas tags são as que você deseja

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
          <TouchableOpacity onPress={() => handleFavoritePress(item.id)}>
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
      <View style={styles.container}>
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
          <ScrollView horizontal style={styles.tagContainer}>
            {TAGS.map(tag => renderTag(tag))}
          </ScrollView>
        </View>

        {loading ? (
          <Text style={styles.loading}>Carregando...</Text>
        ) : filteredRecipes.length > 0 ? (
          <FlatList
            data={filteredRecipes}
            keyExtractor={(item) => item.id}
            renderItem={renderRecipeItem}
          />
        ) : (
          <Text style={styles.noRecipes}>Sem receitas disponíveis</Text>
        )}

        <View style={styles.footer}>
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Add')}>
            <Image source={require('../assets/imagens/criar.png')} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
   
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
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    elevation: 5,
    zIndex: 1,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownText: {
    fontSize: 20,
    color: '#333',
    fontFamily: 'Poppins-Regular',
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
    margin: 15,
    overflow: 'hidden',
  },
  recipeTitle: {
    color: '#333',
    fontSize: 24,
    fontFamily: 'PlayfairDisplay-Regular',
    alignSelf: 'flex-start',
  },
  viewDetails: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
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
    paddingHorizontal: 10,
  },
  tag: {
    backgroundColor: '#fff',
    padding: 10,
    marginHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  tagSelected: {
    backgroundColor: 'pink',
  },
  tagText: {
    color: '#333',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
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
    width: 60,
    height: 60,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#F37E8F',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  c_footer: {
    marginTop: 100,
    alignItems: 'center',
  },
  b_button: {
    backgroundColor: '#f58d94',
    padding: 5,
    borderRadius: 10,
    alignItems: 'center',
    width: '100%',
  },
  content: {
    flex: 1,
  },
  searchicon: {
    width: 40,
    height: 40,
    marginLeft: 10,
  },
});

export default Home;
