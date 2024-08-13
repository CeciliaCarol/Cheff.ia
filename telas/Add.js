import React, { useState } from 'react';
import { View, TextInput, Button } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

const Add = ({ navigation }) => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tags, setTags] = useState('');

  const handleAddRecipe = async () => {
    try {
      const user = auth.currentUser;
      const userId = user.uid;

      await addDoc(collection(db, 'receitas'), {
        userId: userId,
        name: recipeName,
        ingredients: ingredients.split(','), // Separa os ingredientes por vírgula
        instructions: instructions,
        tags: tags.split(','), // Separa as tags por vírgula
        createdAt: new Date(),
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
      <Button title="Adicionar Receita" onPress={handleAddRecipe} />
    </View>
  );
};

export default Add;
