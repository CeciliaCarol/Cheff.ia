import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AppLayouts from '../componentes/AppLayouts';

const Welcome = ({ navigation }) => {
  return (
    <AppLayouts scrollable = {true}>
      

      {/* Texto abaixo da logo */}
      <Text style={styles.welcomeText}>
            Transforme os ingredientes que você tem em casa 
            pratos incríveis!
      </Text>

      {/* Botões */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Register')}
        >
          <Text style={styles.buttonText}>Crie sua conta</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </AppLayouts>
  );
};

const styles = StyleSheet.create({
  patternImage: {
    width: '100%',
    height: 150,
    position: 'absolute',
    top: 0,
  },
  logo: {
    width: 150,
    height: 150,
    marginTop: 100,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 40,
    color: '#333',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    width: '80%',
    marginBottom: 10,
    borderRadius: 30,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Welcome;
