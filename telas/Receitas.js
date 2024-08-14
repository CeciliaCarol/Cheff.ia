import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, Image } from 'react-native';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';

const Receitas = ({ navigation }) => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const q = query(collection(db, 'receitas'), where('userId', '==', userId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const recipesList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUserRecipes(recipesList);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar receitas do usuário: ', error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteImage = async (imageUrl) => {
    if (imageUrl) {
      try {
        const storage = getStorage();
        const imageRef = ref(storage, imageUrl);

        await deleteObject(imageRef);
        console.log('Imagem excluída com sucesso!');
      } catch (error) {
        console.error('Erro ao excluir imagem:', error);
      }
    }
  };

  const confirmDelete = (id) => {
    setRecipeToDelete(id);
    setModalVisible(true);
  };

  const handleDelete = async () => {
    if (recipeToDelete) {
      try {
        // Obtendo a URL da imagem da receita a ser excluída
        const recipeDoc = doc(db, 'receitas', recipeToDelete);
        const docSnap = await getDoc(recipeDoc);

        if (docSnap.exists()) {
          const recipeData = docSnap.data();
          const imageUrl = recipeData.imageUrl;

          // Excluindo a receita do Firestore
          await deleteDoc(recipeDoc);

          // Excluindo a imagem do Firebase Storage
          await deleteImage(imageUrl);

          Alert.alert('Receita excluída com sucesso!');
        } else {
          Alert.alert('Receita não encontrada');
        }
      } catch (error) {
        console.error('Erro ao excluir receita: ', error);
        Alert.alert('Erro ao excluir receita, tente novamente.');
      } finally {
        setModalVisible(false);
        setRecipeToDelete(null);
      }
    }
  };

  const renderRecipeItem = ({ item }) => (
    <View style={styles.recipeItem}>
      {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.recipeImage} />}
      <Text style={styles.recipeTitle}>{item.name || 'Sem nome'}</Text>
      <Text>Ingredientes: {item.ingredients && item.ingredients.length > 0 ? item.ingredients.join(', ') : 'Nenhum'}</Text>
      <Text>Instruções: {item.instructions || 'Nenhuma'}</Text>
      <Text>Tags: {item.tags && item.tags.length > 0 ? item.tags.join(', ') : 'Nenhuma'}</Text>
      <TouchableOpacity onPress={() => navigation.navigate('Edit', { recipeId: item.id })}>
        <Text style={styles.editButton}>Editar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => confirmDelete(item.id)}>
        <Text style={styles.deleteButton}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.welcome}>Minhas Receitas</Text>
      <Button title="Voltar" onPress={() => navigation.goBack()} />
      {loading ? (
        <Text>Carregando...</Text>
      ) : userRecipes.length > 0 ? (
        <FlatList
          data={userRecipes}
          keyExtractor={(item) => item.id}
          renderItem={renderRecipeItem}
        />
      ) : (
        <Text>Você não criou nenhuma receita ainda</Text>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Tem certeza que deseja excluir esta receita?</Text>
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} />
              <Button title="Excluir" onPress={handleDelete} color="red" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  welcome: {
    fontSize: 24,
    marginBottom: 20,
  },
  recipeItem: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 16,
    width: '100%',
  },
  recipeTitle: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  editButton: {
    color: 'blue',
    marginTop: 10,
  },
  deleteButton: {
    color: 'red',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
  },
});

export default Receitas;
