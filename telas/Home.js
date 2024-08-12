// Home.js
import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Image, TouchableOpacity, Modal, TextInput } from 'react-native';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const [recipeName, setRecipeName] = useState('');
  const [recipeDescription, setRecipeDescription] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleCreateOrUpdateRecipe = () => {
    if (editingIndex !== null) {
      const updatedRecipes = recipes.map((recipe, index) =>
        index === editingIndex ? { name: recipeName, description: recipeDescription } : recipe
      );
      setRecipes(updatedRecipes);
      setEditingIndex(null);
    } else {
      setRecipes([...recipes, { name: recipeName, description: recipeDescription }]);
    }
    setRecipeName('');
    setRecipeDescription('');
    setShowForm(false);
  };

  const handleEditRecipe = (index) => {
    setRecipeName(recipes[index].name);
    setRecipeDescription(recipes[index].description);
    setEditingIndex(index);
    setShowForm(true);
  };

  const handleDeleteRecipe = (index) => {
    setRecipes(recipes.filter((_, i) => i !== index));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo!</Text>
      <Text style={styles.welcomeMessage}>Seja bem-vindo ao aplicativo de receitas...</Text>
      
      <Image 
        style={styles.image}
        source={{ uri: 'https://example.com/recipe1.jpg' }} 
      />
      <Image 
        style={styles.image}
        source={{ uri: 'https://example.com/recipe2.jpg' }} 
      />

      <Button
        title="Criar nova receita"
        onPress={() => setShowForm(true)}
      />

      <FlatList
        data={recipes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item, index }) => (
          <View style={styles.recipeItem}>
            <Text style={styles.recipeName}>{item.name}</Text>
            <Text>{item.description}</Text>
            <View style={styles.buttons}>
              <TouchableOpacity onPress={() => handleEditRecipe(index)} style={styles.editButton}>
                <Text style={styles.buttonText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteRecipe(index)} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Deletar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      <Modal
        visible={showForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowForm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              placeholder="Nome da Receita"
              value={recipeName}
              onChangeText={setRecipeName}
            />
            <TextInput
              style={styles.input}
              placeholder="Descrição"
              value={recipeDescription}
              onChangeText={setRecipeDescription}
            />
            <Button
              title={editingIndex !== null ? "Atualizar Receita" : "Criar Receita"}
              onPress={handleCreateOrUpdateRecipe}
            />
            <Button
              title="Cancelar"
              onPress={() => setShowForm(false)}
              color="red"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  welcomeMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
  },
  recipeItem: {
    padding: 10,
    borderBottomColor: 'gray',
    borderBottomWidth: 1,
    width: '100%',
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 10,
  },
  editButton: {
    marginRight: 10,
    backgroundColor: 'blue',
    padding: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
  },
  buttonText: {
    color: 'white',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: '100%',
  },
});
