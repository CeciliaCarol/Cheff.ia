// Register.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { auth, firestore, createUserWithEmailAndPassword, doc, setDoc } from '../firebaseConfig';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    try {
      // Cria o usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Adiciona o nome e outras informações ao Firestore
      await setDoc(doc(firestore, 'users', user.uid), {
        name: name,
        email: email,
      });

      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      navigation.navigate('Login'); // Navega para a tela de login após o registro
    } catch (error) {
      // **Aqui foi onde adicionei a verificação do erro específico**
      if (error.code === 'auth/email-already-in-use') {  // **Linha adicionada**
        Alert.alert('Erro', 'Este email já está em uso. Por favor, use outro email.');  // **Linha adicionada**
      } else {
        console.error('Erro ao registrar:', error.message);
        Alert.alert('Erro', 'Não foi possível registrar o usuário.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text>Registrar</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button title="Registrar" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
});
