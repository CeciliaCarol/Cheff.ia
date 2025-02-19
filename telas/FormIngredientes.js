import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AppLayouts from '../componentes/AppLayouts';
import Input from '../componentes/Inputs';
import Buttons from '../componentes/Buttons';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

function FormIngredientes() {
  const [ingredientes, setIngredientes] = useState('');
  const [receita, setReceita] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleSubmit = async () => {
    if (!ingredientes.trim()) {
      alert('Por favor, insira pelo menos um ingrediente.');
      return;
    }

    setLoading(true);
    setReceita(null); // Limpa a resposta anterior
    try {
      const response = await axios.post('http://192.168.100.227:5000/gerar-receita', {
        ingredientes: ingredientes.split(',').map((item) => item.trim()),
      });

      console.log("Resposta da API:", response.data); // Debug
      setReceita(response.data); // Salva o retorno da API
    } catch (error) {
      console.error('Erro ao gerar receita:', error.response?.data || error.message);
      setReceita({ erro: 'Não foi possível gerar receita.' });
    }
    setLoading(false);
  };

  const handlegoBack = () => {
    navigation.goBack();
 };


  return (
    <AppLayouts hideNavbar={true}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity style={styles.backButton} onPress={handlegoBack}>
                 <Ionicons name="chevron-back" size={28} color="#fff" />
              </TouchableOpacity>
        <Text style={styles.title}>Gerar Receita</Text>
        <Input
          style={styles.input}
          value={ingredientes}
          onChangeText={setIngredientes}
          placeholder="Exemplo: frango, batata, cebola"
          placeholderTextColor="#999"
        />
        <Buttons
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
          title="Gerar Receita"
        />

        {/* Exibição do retorno da API */}
        {loading && <ActivityIndicator size="large" color="#000" />}
        {receita && receita.receitas && (
          <View style={styles.resultContainer}>
            <Text style={styles.receitaTitulo}>{receita.receitas[0].titulo}</Text>
            <Text>{receita.receitas[0].descricao}</Text>
          </View>
        )}
      </ScrollView> 
    </AppLayouts>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 20,
    left: 10,
    margin: 10,
    backgroundColor: "#F17166",
    width: 35,
    height: 35,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
},
  title: {
    fontSize: 32,
    textAlign:'center',
    margin:20,
    fontFamily: 'PlayfairDisplay-Regular',
    color: '#333',
    marginBottom: 30,
  },
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  button: {
    marginTop: 10,
  },
  resultContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  receitaTitulo: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default FormIngredientes;
