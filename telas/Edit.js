import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { app } from '../firebaseConfig'; // Certifique-se de que o caminho esteja correto

const db = getFirestore(app);
const auth = getAuth(app);

const Edit = ({ route, navigation }) => {
  const { recipeId } = route.params; // Recebe o ID da receita como parâmetro
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: [],
    instructions: '',
    tags: []
  });

  useEffect(() => {
    const fetchRecipe = async () => {
      const docRef = doc(db, 'receitas', recipeId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setRecipe(docSnap.data());
      } else {
        console.log('No such document!');
      }
    };
    fetchRecipe();
  }, [recipeId]);

  const handleUpdate = async () => {
    const docRef = doc(db, 'receitas', recipeId);
    await updateDoc(docRef, recipe);
    navigation.goBack(); // Volta para a tela anterior após atualizar
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput
        style={styles.input}
        value={recipe.name}
        onChangeText={(text) => setRecipe({ ...recipe, name: text })}
      />
      <Text style={styles.label}>Ingredientes:</Text>
      <TextInput
        style={styles.input}
        value={recipe.ingredients.join(', ')}
        onChangeText={(text) => setRecipe({ ...recipe, ingredients: text.split(', ') })}
      />
      <Text style={styles.label}>Instruções:</Text>
      <TextInput
        style={styles.input}
        value={recipe.instructions}
        onChangeText={(text) => setRecipe({ ...recipe, instructions: text })}
      />
      <Text style={styles.label}>Tags:</Text>
      <TextInput
        style={styles.input}
        value={recipe.tags.join(', ')}
        onChangeText={(text) => setRecipe({ ...recipe, tags: text.split(', ') })}
      />
      <Button title="Atualizar Receita" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginVertical: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 8,
    marginBottom: 16,
  },
});

export default Edit;
