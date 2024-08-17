// telas/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet,TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';



const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('User Logged In:', user);
      navigation.navigate('Home');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Crie e Encontre
      Suas Receitas Favoritas</Text>
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
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não tem uma conta? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF', // Cor de fundo da tela
  },
  input: {
    height: 43,
    width: '313', // Largura total do campo de entrada
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
  },
  buttonText: {
    color: 'white', // Cor do texto dentro do botão
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  header: {
    color: '#333',
    fontSize: 20,
    padding: 1,
    fontFamily:'Poppins-Regular',
  },
  
  link: {
    color: '#F37E8F', // Cor do link para a tela de login
    marginTop: 12,
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
  },
  titulo: {
    color: '#333',
    textAlign: 'center',
    fontSize: 40,
    fontStyle: 'normal',
    fontFamily: 'PlayfairDisplay-Regular'
    
  },
});


export default Login;
