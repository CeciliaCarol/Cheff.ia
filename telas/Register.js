// Register.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet,Alert, TouchableOpacity, Image } from 'react-native';
import { auth, db } from '../firebaseConfig'; 
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; 
import { doc, setDoc } from 'firebase/firestore'; 
import AppLayouts from '../componentes/AppLayouts';
import Input from '../componentes/Inputs';



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

      await updateProfile(user, {
        displayName: name,
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
    
    <AppLayouts hideNavbar={true}>
      <Image source={require('../assets/imagens/green.png')} style={styles.padrao} />
      <Image source={require('../assets/imagens/logo.png')} style={styles.logo} />
      
      <Text style={styles.header}>Nome</Text>
      <Input
        placeholder="Nome"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#808080" // Cor do texto do placeholder
      />
      <Text style={styles.header}>Email</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#808080" // Cor do texto do placeholder
      />
      <Text style={styles.header}>Senha</Text>
      <Input
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
    </AppLayouts>
  );
}

const styles = StyleSheet.create({
  patternImage: {
    width: '100%',
    height: 250,
    top: 0,
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: "contain",
    margin: 50,
  },
  
  button: {
    backgroundColor: '#F17166', // Cor de fundo do botão
    borderRadius: 30, // Arredondamento das bordas do botão
    paddingVertical: 5,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
    width:'100%',    
  },
  buttonText: {
    color: 'white', // Cor do texto dentro do botão
    fontSize: 20,
    fontFamily: 'Poppins-Bold',

  },
  link: {
    color: '#015927', // Cor do link para a tela de login
    marginTop: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    paddingTop: 50,
  },

  header: {
    color: '#333',
    fontSize: 20,
    padding: 1,
    fontFamily: 'Poppins-Regular',
    alignSelf: 'flex-start'
  },
  

});
