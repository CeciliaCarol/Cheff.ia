// telas/Comments.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot, addDoc } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';

const Comments = ({ route, navigation }) => {
  const { recipeId } = route.params;
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

  return (
    <View style={styles.container}>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentText}>{item.text}</Text>
          </View>
        )}
      />
      <TextInput
        style={styles.input}
        value={newComment}
        onChangeText={setNewComment}
        placeholder="Digite seu comentário..."
      />
      <Button title="Enviar" onPress={handleAddComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 10 
  },
  commentItem: { 
    padding: 10, 
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc' 
  },
  commentText: {
    fontSize: 16,
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 10, 
    marginVertical: 10, 
    borderRadius: 5 
  },
});

export default Comments;