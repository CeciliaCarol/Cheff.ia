import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import AppLayouts from '../componentes/AppLayouts';
import Input from '../componentes/Inputs';
import Buttons from '../componentes/Buttons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const db = getFirestore(app);
const auth = getAuth(app);

const tagsList = ['Doce', 'Salgado', 'Vegano', 'Vegetariano', 'Sem Lactose'];

const Edit = ({ route}) => {
  const { recipeId } = route.params; // Recebe o ID da receita como parâmetro
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: '',
    instructions: '',
    tags: [],
    imageUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, 'receitas', recipeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRecipe({
          name: data.name,
          ingredients: data.ingredients.join(', '), // Inicializa com dados existentes
          instructions: data.instructions,
          tags: data.tags,
          imageUrl: data.imageUrl
        });
        setSelectedImage(data.imageUrl || '');
        setSelectedTags(data.tags || []);
      } else {
        console.log('Documento não encontrado!');
      }
    };
    fetchRecipe();
  }, [recipeId]);

  const handleSelectImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleUploadImage = async () => {
    if (selectedImage) {
      const response = await fetch(selectedImage);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `images/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    }
    return null;
  };

  const handleUpdateRecipe = async () => {
    try {
      const imageUrl = await handleUploadImage();

      await updateDoc(doc(db, 'receitas', recipeId), {
        name: recipe.name,
        ingredients: recipe.ingredients.split(',').map(ingredient => ingredient.trim()), // Corrige a separação dos ingredientes
        instructions: recipe.instructions,
        tags: selectedTags, // Usa as tags selecionadas
        imageUrl: imageUrl || recipe.imageUrl,
      });

      console.log('Receita atualizada com sucesso!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao atualizar a receita: ', error);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handlegoBack = () => {
    navigation.goBack();
 };


  return (
    <AppLayouts hideNavbar={true}>
      <TouchableOpacity style={styles.backButton} onPress={handlegoBack}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Edite sua Receita</Text>
      <Text style={styles.subtitle}>Nome da Receita</Text>
      <Input
        placeholder="Nome da Receita"
        placeholderTextColor={'#F37E8F'}
        value={recipe.name}
        onChangeText={text => setRecipe({...recipe, name: text})}
      />
      <Text style={styles.subtitle}>Ingredientes</Text>
      <Input
        placeholder="Ingredientes (separados por vírgula)"
        value={recipe.ingredients}
        placeholderTextColor={'#F37E8F'}
        onChangeText={text => setRecipe({...recipe, ingredients: text})}
        multiline={true}
      />
      <Text style={styles.subtitle}>Passo a Passo</Text>
      <Input
        placeholder="Instruções"
        value={recipe.instructions}
        placeholderTextColor={'#F37E8F'}
        onChangeText={text => setRecipe({...recipe, instructions: text})}
        multiline={true}
      />
      <Text style={styles.subtitle}>Tags</Text>
      <View style={styles.tagsContainer}>
        {tagsList.map(tag => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tagButton,
              selectedTags.includes(tag) && styles.selectedTagButton
            ]}
            onPress={() => toggleTag(tag)}
          >
            <Text style={styles.tagText}>{tag}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Buttons onPress={handleSelectImage}
      title="Alterar Imagem"
      />
      {selectedImage && <Image source={{ uri: selectedImage }} style={styles.image} />}
      <TouchableOpacity onPress={handleUpdateRecipe}>
        <Text style={styles.buttonAdd}>Atualizar</Text>
      </TouchableOpacity>
      
    </AppLayouts>
  );
};

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    margin: 10,
    backgroundColor: "#F17166",
    width: 35,
    height: 35,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
},
  title: {
    fontSize: 32,
    textAlign: 'center',
    margin: 20,
    fontFamily: 'PlayfairDisplay-Regular',
    color: '#333',
    marginBottom: 30,
  },
  subtitle: {
    color: '#333',
    fontSize: 20,
    marginLeft: 15,
    fontFamily: 'Poppins-Regular',
    alignSelf: 'flex-start',
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginHorizontal: 15,
    borderRadius: 10,
  },
  buttonAdd: {
    color: '#fff',
    backgroundColor: '#F17166',
    padding: 8,
    textAlign: 'center',
    borderRadius: 30,
    fontSize: 20,
    marginHorizontal: 120,
    marginTop: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  buttonImg: {
    margin: 15,
    color: '#333',
    backgroundColor: '#F9E6D8',
    padding: 8,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 15,
  },
  tagButton: {
    backgroundColor: '#E43434',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  selectedTagButton: {
    backgroundColor: '#F17166',
  },
  tagText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
});

export default Edit;
