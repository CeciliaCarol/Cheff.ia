import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, TouchableOpacity, Modal, Alert, Image } from 'react-native';
import { auth } from '../firebaseConfig';
import { db } from '../firebaseConfig';
import { collection, query, where, onSnapshot, deleteDoc, doc, getDoc, orderBy } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import AppLayouts from '../componentes/AppLayouts';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';


const Receitas = ( ) => {
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [recipeToDelete, setRecipeToDelete] = useState(null);
  const navigation = useNavigation();
  

  useEffect(() => {
    const userId = auth.currentUser.uid;
    const q = query(collection(db, 'receitas'),
                    where('userId', '==', userId),
                    orderBy('createdAt', 'desc'));

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
      <View style={styles.content}>
        <Text style={styles.recipeTitle}>{item.name || 'Sem nome'}</Text>
      </View>
      <View style={styles.c_footer}>
        <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('Edit', { recipeId: item.id })} >
          <Ionicons name='pencil' size={24} color="#fff"/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item.id)}>
          <Ionicons name='trash-sharp' size={24} color="#fff"/>
        </TouchableOpacity>
      </View>
    </View>
  );

  //Função para voltar pra tela anterior
 const handlegoBack = () => {
  navigation.goBack();
};

  return (
    <AppLayouts>
      <View style={styles.welcome}>
        <TouchableOpacity style={styles.backButton} onPress={handlegoBack}>
          <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.recipeTitle} >Minhas Receitas</Text>
        </View>
      
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
            <Text style={styles.modalTitulo}>Aviso!</Text>
            <Text style={styles.modalText}>Tem certeza que deseja excluir esta receita?</Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancel} onPress={() => setModalVisible(false)}>
                <Text style={{color: '#fff'}}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.delete} onPress={handleDelete}>
                <Text style={{color: '#f37e8f'}}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      </AppLayouts>
  );
};

const styles = StyleSheet.create({
 
  welcome: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    padding: 30,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 10,
    textAlign: 'center',
    backgroundColor: "#F9D5CD",
  },
  
  backButton: {
    position: "absolute",
        top: 0,
        left: 0,
        margin: 10,
        backgroundColor: "#fff",
        width: 35,
        height: 35,
        borderRadius: 30,
        justifyContent: "center",
        alignItems: "center",
  },
  content: {
   width: '100%',
  },
  recipeItem: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 5,
    marginVertical: 8,
    padding: 10,
    margin: 2,
    overflow: 'hidden',
  },
  ingredientItem: {
    fontSize: 16,
    lineHeight: 20,
    paddingLeft: 5,
  },
  recipeTitle: {
    fontFamily: 'PlayfairDisplay-Regular',
    fontSize: 24,
    padding: 5,
  },

  infoText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#333',
    padding: 5,
  },

  c_footer: {
    flexDirection: 'row',    
    marginTop: 10,  
    },
  editButton: {
    backgroundColor:'#f58d94',
    marginTop: 10,
    padding:10,
    borderRadius: 30,
    marginRight: 10,

  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 30,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: 340,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
    alignItems: 'left',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  modalTitulo: {
    fontSize: 32,
    fontFamily: 'PlayfairDisplay-Regular',
  },

  modalText: {
    fontSize: 20,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%',
  },

  cancel: {
    backgroundColor: '#f37e8f',
    borderRadius: 10,
    padding: 10,
    marginRight: 5,
  },
  delete: {
   borderColor: '#f37e8f',
   borderWidth: 1,
   borderRadius: 10,
   padding: 10,
   marginLeft: 5,
  },

  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 20,
    marginBottom: 10,
  },
  
  
});

export default Receitas;
