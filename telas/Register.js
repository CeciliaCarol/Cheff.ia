// Register.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Alert, TouchableOpacity, Image } from 'react-native';
import { auth, db } from '../firebaseConfig'; 
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { doc, setDoc } from 'firebase/firestore'; 



export default function Register({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Opa!', 'Preencha todos os campos!');
      return;
    }

    try {
      // Cria o usuário com email e senha
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Adiciona o nome e outras informações ao Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: name,
        email: email,
      });

      Alert.alert('Sucesso', 'Usuário registrado com sucesso!');
      navigation.navigate('Login'); // Navega para a tela de login após o registro
    } catch (error) {
      // **Aqui foi onde adicionei a verificação do erro específico**
      if (error.code === 'auth/email-already-in-use') {  // **Linha adicionada**
        Alert.alert('Opa!', 'Este email já está em uso. Por favor, use outro email.');  // **Linha adicionada**
      } else {
        console.error('Erro ao registrar:', error.message);
        Alert.alert('Opa!', 'Não foi possível registrar o usuário.');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/imagens/logo.png')} style={styles.image} />
      
      <Text style={styles.titulo}>Crie e Encontre
      Suas Receitas Favoritas</Text>
      <Text style={styles.header}>Nome</Text>
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#808080" // Cor do texto do placeholder
      />
      <Text style={styles.header}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#808080" // Cor do texto do placeholder
      />
      <Text style={styles.header}>Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholderTextColor="#808080" // Cor do texto do placeholder
      />
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF', // Cor de fundo da tela
  },
  input: {
    height: 43,
    width: '100%', // Largura total do campo de entrada
    borderColor:  '#F37E8F', // Cor da borda
    borderWidth: 1,
    borderRadius: 10, // Arredondamento das bordas
    marginBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff', // Cor de fundo do campo de entrada
    color: '#000000', // Cor do texto dentro do campo de entrada
  },
  button: {
    backgroundColor: '#F37E8F', // Cor de fundo do botão
    borderRadius: 10, // Arredondamento das bordas do botão
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
    width:'100%',
    
    
  },
  buttonText: {
    color: 'white', // Cor do texto dentro do botão
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    

  },
  link: {
    color: '#F37E8F', // Cor do link para a tela de login
    marginTop: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-Bold',
    fontSize: 16
  },

  header: {
    color: '#333',
    fontSize: 20,
    padding: 1,
    fontFamily: 'Poppins-Regular',
    alignSelf: 'flex-start'
  },
  
  titulo: {
    color: '#333',
    textAlign: 'center',
    fontSize: 40,
    fontStyle: 'normal',
    fontFamily: 'PlayfairDisplay-Regular',
    padding: 20,
  },
  image: {
    
  },
});
