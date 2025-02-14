import React, { useState } from 'react';
import { View, TextInput, Button, Image, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import AppLayouts from '../componentes/AppLayouts';
import Input from '../componentes/Inputs';
import Buttons from '../componentes/Buttons';

const tagsList = ['Doce', 'Salgado', 'Vegano', 'Vegetariano', 'Sem Lactose'];

const Add = ({ navigation }) => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

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
        tags: selectedTags, // Usa as tags selecionadas
        createdAt: new Date(),
        imageUrl: imageUrl,
        createdBy: user.displayName,
      });

      console.log('Receita adicionada com sucesso!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao adicionar a receita: ', error);
    }
  };

  const toggleTag = (tag) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  return (
    <AppLayouts scrollable = {true}>
      <Text style={styles.title}>Crie sua receita</Text>
      <Text style={styles.subtitle}>Nome de Receita</Text>
      <Input
        placeholder="Nome da Receita"
        placeholderTextColor={'#F37E8F'}
        value={recipeName}
        onChangeText={setRecipeName}
        style={styles.input}
      />
      <Text style={styles.subtitle}>Ingredientes</Text>
      <Input
        placeholder="Ingredientes (separados por vírgula)"
        value={ingredients}
        placeholderTextColor={'#F37E8F'}
        onChangeText={setIngredients}
        style={styles.input}
        multiline={true}
      />
      <Text style={styles.subtitle}>Passo a Passo</Text>
      <Input
        placeholder="Instruções"
        value={instructions}
        placeholderTextColor={'#F37E8F'}
        onChangeText={setInstructions}
        style={styles.input}
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
            <Text style={styles.tagText}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Buttons onPress={handlePickImage}
      title="Adicionar Imagem"/>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <TouchableOpacity onPress={handleAddRecipe}>
        <Text style={styles.buttonAdd}>Criar</Text>
      </TouchableOpacity>
    </AppLayouts>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 32,
    textAlign:'center',
    margin:20,
    fontFamily: 'PlayfairDisplay-Regular',
    color: '#333',
    marginBottom: 100,
  },
  subtitle: {
    color: '#333',
    fontSize: 20,
    marginLeft: 15,
    fontFamily:'Poppins-Regular',
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
    marginTop: 50,
    fontFamily: 'Poppins-SemiBold',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 15,
  },
  tagButton: {
    backgroundColor: '#F37E8F',
    padding: 10,
    borderRadius: 10,
    margin: 5,
  },
  selectedTagButton: {
    backgroundColor: '#A31F51',
  },
  tagText: {
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
});

export default Add;
