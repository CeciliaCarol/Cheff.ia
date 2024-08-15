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
      <Text style={styles.header}>Entrar</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#808080" // Cor do texto do placeholder
      />
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
    height: 40,
    width: '100%', // Largura total do campo de entrada
    borderColor: '#F37E8F', // Cor da borda
    borderWidth: 2,
    borderRadius: 10, // Arredondamento das bordas
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#FAD2D7', // Cor de fundo do campo de entrada
    color: '#000000', // Cor do texto dentro do campo de entrada
  },
  button: {
    backgroundColor: '#F37E8F', // Cor de fundo do botão
    borderRadius: 10, // Arredondamento das bordas do botão
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: 'white', // Cor do texto dentro do botão
    fontSize: 16,
  },
  error: {
    color: 'red',
    marginBottom: 12,
  },
  
});


export default Login;
