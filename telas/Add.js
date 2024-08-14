import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const Add = ({ navigation }) => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [tags, setTags] = useState('');

  const handlePickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      alert('Permissão para acessar a biblioteca de mídia é necessária!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleUploadImage = async () => {
    if (imageUri) {
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const storage = getStorage();
      const storageRef = ref(storage, `images/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      return await getDownloadURL(storageRef);
    }
    return null;
  };

  const handleAddRecipe = async () => {
    try {
      const user = auth.currentUser;
      const userId = user.uid;
      const imageUrl = await handleUploadImage();

      await addDoc(collection(db, 'receitas'), {
        userId: userId,
        name: recipeName,
        ingredients: ingredients.split(','), // Separa os ingredientes por vírgula
        instructions: instructions,
        tags: tags.split(','), // Separa as tags por vírgula
        createdAt: new Date(),
        imageUrl: imageUrl,
      });

      console.log('Receita adicionada com sucesso!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao adicionar a receita: ', error);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nome da Receita"
        value={recipeName}
        onChangeText={setRecipeName}
      />
      <TextInput
        placeholder="Ingredientes (separados por vírgula)"
        value={ingredients}
        onChangeText={setIngredients}
      />
      <TextInput
        placeholder="Instruções"
        value={instructions}
        onChangeText={setInstructions}
      />
      <TextInput
        placeholder="Tags (separadas por vírgula)"
        value={tags}
        onChangeText={setTags}
      />
      <Button title="Escolher Imagem" onPress={handlePickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Adicionar Receita" onPress={handleAddRecipe} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
});

export default Add;
