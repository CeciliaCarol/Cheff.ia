import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList, TextInput, Button, Pressable } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { doc, getDoc, collection, query, where, onSnapshot, setDoc, deleteDoc, addDoc } from 'firebase/firestore';
import AppLayouts from '../componentes/AppLayouts';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';


const Detalhes = ({ route }) => {
  const { recipeId } = route.params;
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigation = useNavigation();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');


  useEffect(() => {
      const q = query(
        collection(db, 'comentarios'),
        where('recipeId', '==', recipeId)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const commentsList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setComments(commentsList);
      });
      return () => unsubscribe();
    }, [recipeId]);
  
    const handleAddComment = async () => {
      const user = auth.currentUser;
      if (user && newComment.trim()) {
        await addDoc(collection(db, 'comentarios'), {
          recipeId,
          userId: user.uid,
          text: newComment,
          createdAt: new Date()
        });
        setNewComment('');
      }
    };

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const docRef = doc(db, 'receitas', recipeId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRecipe(docSnap.data());
        } else {
          console.log('No such document!');
        }
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar receita:', error);
        setLoading(false);
      }
    };

    const checkFavoriteStatus = () => {
      const user = auth.currentUser;
      if (user) {
        const favoritesRef = collection(db, 'favorites');
        const q = query(favoritesRef, where('userId', '==', user.uid), where('recipeId', '==', recipeId));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          setIsFavorite(!querySnapshot.empty);
        });

        return unsubscribe; // Return unsubscribe function
      }
    };

    fetchRecipe();
    const unsubscribe = checkFavoriteStatus();

    return () => {
      if (unsubscribe) {
        unsubscribe(); // Call unsubscribe if it exists
      }
    };
  }, [recipeId]);

  const handleFavoritePress = async () => {
    const user = auth.currentUser;
    if (user) {
      const favoriteRef = doc(db, 'favorites', `${user.uid}_${recipeId}`);

      if (isFavorite) {
        await deleteDoc(favoriteRef);
      } else {
        await setDoc(favoriteRef, { userId: user.uid, recipeId });
      }
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!recipe) {
    return <Text>Receita não encontrada</Text>;
  }

   //Função para voltar pra tela anterior
 const handlegoBack = () => {
  navigation.goBack();
};

  return (
    <AppLayouts scrollable={true} >
      <TouchableOpacity style={styles.backButton} onPress={handlegoBack}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.favoriteButton} onPress={handleFavoritePress}>
          <Ionicons 
            name={ isFavorite ? 'heart' : 'heart-outline' }
            size={30}
            color={ isFavorite ? '#f37e8f' : '#f37e8f'}
          />
      </TouchableOpacity>
      {recipe.imageUrl && <Image source={{ uri: recipe.imageUrl }} style={styles.recipeImage} />}
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.perfil_content}>
          <TouchableOpacity style={styles.imagem_perfil}></TouchableOpacity>
         <Text style={styles.autor}> {recipe.createdBy}</Text>
         </View>
         <Ionicons name='share-social-outline' size={28}/>
      </View>
        <View style={styles.header}>
          
          <Text style={styles.title}>{recipe.name}</Text>
          <Ionicons name='chatbubble-outline' size={28}/>
        </View>
        
        <Text style={styles.conteudo}>Ingredientes</Text>
        {recipe.ingredients?.length > 0 && recipe.ingredients.map((ingredient, index) => (
          <Text key={index} style={styles.ingredientItem}>
            {'\u2022'} {ingredient}
          </Text>
        ))}
        <Text style={styles.conteudo}>Instruções</Text>
        <Text>{recipe.instructions}</Text>
      </View>
      <View style={styles.container}>
            <View style={styles.inputcomentario}>
            <View style={styles.inputcomentario}>
            <View style={styles.imagem_perfil}></View>
            <TextInput
              style={styles.input}
              value={newComment}
              onChangeText={setNewComment}
              placeholder="Digite seu comentário..."
            />
            </View>
            <View style={styles.buttaoenviar}>
             <Pressable style={styles.enviarbutton}  onPress={handleAddComment} >
             <Ionicons name="send" size={24} color="#fff"/>
             </Pressable>
            </View>
            </View>
            <View style={styles.linha}></View>
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                
                <View style={styles.commentItem}>
                  <View style={styles.perfil_coment}>
                    <View style={styles.imagem_perfil}></View>
                    <Text style={styles.autor}>Fulaninho123</Text>
                  </View>
                  <Text style={styles.commentText}>{item.text}</Text>
                </View>
              )}
            />
          </View>
      </AppLayouts>
  );
};

const styles = StyleSheet.create({

  commentText: {
    marginBottom: 20,
  },
  perfil_coment: {
    flexDirection: 'row',
    alignItems: 'center',
  },
   enviarbutton: {
    backgroundColor: "#015927",
    padding: 10,
    borderRadius: 30,
    marginBottom: 10,
    right: 0,
   },

  linha: {
  height: 2,
  backgroundColor: '#015927',
  marginVertical: 10,
  },

/*Estilo dos comentarios */
inputcomentario: {
flexDirection: 'row',
justifyContent: "space-between",

},
container: {
margin: 15,
borderRadius: 20,
borderWidth: 2,
borderColor: "#015927",
paddingRight: 20,
paddingLeft: 20,
paddingBottom: 50,
paddingTop: 20,
elevation: 3,
backgroundColor: "#fff",
},
  autor: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "700",
  },
  perfil_content: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  imagem_perfil: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: "#333333",
  },
  backButton: {
    position: "absolute",
    top: 30,
    left: 20,
    zIndex: 100,
    backgroundColor: "#f37e8f",
    padding: 10,
    borderRadius: 30,
    justifyContent: "center",
    alignItems:"center",
  },
  favoriteButton: {
    position: "absolute",
    top: 240,
    right: 10,
    zIndex: 100,
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 30,
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'PlayfairDisplay-Regular',
  },
  conteudo: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 15,
    fontFamily: 'Poppins-SemiBold',
  },
  recipeImage: {
    width: '100%',
    height: 300,
    borderRadius: 30,
  },
  ingredientItem: {
    fontSize: 16,
    lineHeight: 24,
  },
  favoriteIcon: {
    width: 24,
    height: 24,
  },
});

export default Detalhes;
