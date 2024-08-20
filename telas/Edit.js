import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig'; 
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const db = getFirestore(app);
const auth = getAuth(app);

const Edit = ({ route, navigation }) => {
  const { recipeId } = route.params; // Recebe o ID da receita como parâmetro
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: [],
    instructions: '',
    tags: [],
    imageUrl: ''
  });
  const [selectedImage, setSelectedImage] = useState('');

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, 'receitas', recipeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setRecipe(data);
        setSelectedImage(data.imageUrl || '');
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

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();

    const imageRef = ref(getStorage(), `images/${recipeId}/${Date.now()}`);
    await uploadBytes(imageRef, blob);

    const downloadURL = await getDownloadURL(imageRef);
    return downloadURL;
  };

  const handleUpdate = async () => {
    let imageUrl = recipe.imageUrl;

      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      const updatedRedipe = { ...recipe, imageUrl};

      const docRef = doc(db, 'receitas', recipeId);
      await updateDoc(docRef, updatedRedipe);
      navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edite sua Receita</Text>
      <Text style={styles.label}>Nome</Text>
      <TextInput
        style={styles.input}
        value={recipe.name}
        onChangeText={(text) => setRecipe({ ...recipe, name: text })}
      />
      <Text style={styles.label}>Ingredientes</Text>
      <TextInput
        style={styles.input}
        value={recipe.ingredients.join(', ')}
        onChangeText={(text) => setRecipe({ ...recipe, ingredients: text.split(', ') })}
      />
      <Text style={styles.label}>Instruções</Text>
      <TextInput
        style={styles.input}
        value={recipe.instructions}
        onChangeText={(text) => setRecipe({ ...recipe, instructions: text })}
      />
      <Text style={styles.label}>Tags</Text>
      <TextInput
        style={styles.input}
        value={recipe.tags.join(', ')}
        onChangeText={(text) => setRecipe({ ...recipe, tags: text.split(', ') })}
      />
      <TouchableOpacity  onPress={handleSelectImage}>
        <Text style={styles.imagePicker}>Selecionar Imagem</Text>
      </TouchableOpacity>
      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.image} />
        ) : (
        recipe.imageUrl && <Image source={{ uri: recipe.imageUrl }} style={styles.image} />
        )}
      <TouchableOpacity onPress={handleUpdate} >
        <Text style={styles.editButton}>Editar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 10,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    margin: 20,
    fontFamily: 'PlayfairDisplay-Regular',
    color: '#333',
  },
  label: {
   color: '#333',
    fontSize: 20,
    marginLeft: 15,
    fontFamily: 'Poppins-Regular',
    alignSelf: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#F37E8F',
    padding: 10,
    margin: 15,
    borderRadius: 10,
    marginTop: 2,
  },
   image: {
    width: 100,
    height: 100,
    marginBottom: 20,
    marginHorizontal: 15,
    borderRadius: 10, 
    
  },
  imagePicker: {
    margin: 15,
    color:'#333',
    backgroundColor: '#F9E6D8',
    padding: 8,
    borderRadius: 10,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
  },
   editButton: {
    color: '#fff',
    backgroundColor: '#F37E8F',
    padding: 8,
    textAlign: 'center',
    borderRadius: 10,
    fontSize: 20,
    marginHorizontal: 120,
    marginTop: 50,
    fontFamily: 'Poppins-SemiBold',
  },
});

export default Edit;
