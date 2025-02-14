import React from 'react';
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import AppLayouts from '../componentes/AppLayouts';
import Buttons  from '../componentes/Buttons';

const Welcome = ({ navigation }) => {
  return (
    <AppLayouts>
      <Image source={require("../assets/imagens/green.png")} style={styles.padrao}/>

      <Image source={require("../assets/imagens/logo.png")} style={styles.logo}/>

      {/* Texto abaixo da logo */}
      <Text style={styles.welcomeText}>
            Transforme os ingredientes que você tem em casa 
            pratos incríveis!
      </Text>

      {/* Botões */}

        <Buttons 
        title="Cadastrar"
        onPress={() => navigation.navigate('Register')} 
        />
        <TouchableOpacity style={styles.button}
        onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        
    </AppLayouts>
  );
};

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
  welcomeText: {
    fontSize: 20,
    fontFamily: 'PlayfairDisplay-Regular',
    textAlign: 'center',
    marginBottom: 150,
    color: '#333',
  },

  button: {
    backgroundColor: '#F17166', // Cor de fundo do botão
        borderRadius: 30, //rredondamento das bordas do botão
        padding: 10,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 20,
        width:'100%',
  },

  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
});

export default Welcome;
