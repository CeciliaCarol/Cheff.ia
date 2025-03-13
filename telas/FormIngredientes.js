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

      if (response.data.receitas && response.data.receitas[0]) {
        setReceita({ receitas: response.data.receitas });
      } else {
        setReceita({ erro: 'Nenhuma receita encontrada.' });
      }
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
        {receita && receita.erro && (
          <Text style={styles.errorText}>{receita.erro}</Text>
        )}
        {receita && receita.receitas && receita.receitas[0] && (
          <View style={styles.resultContainer}>
            <Text style={styles.receitaTitulo}>{receita.receitas[0].titulo}</Text>

            {/* Exibe os ingredientes */}
            {receita.receitas[0].ingredientes.length > 0 && (
              <>
                <Text style={styles.subtitulo}>Ingredientes:</Text>
                {receita.receitas[0].ingredientes.map((ingrediente, index) => (
                  <Text key={index} style={styles.texto}>
                    - {ingrediente}
                  </Text>
                ))}
              </>
            )}

            {/* Exibe o modo de preparo */}
            {receita.receitas[0].modoPreparo.length > 0 && (
              <>
                <Text style={styles.subtitulo}>Modo de Preparo:</Text>
                {receita.receitas[0].modoPreparo.map((passo, index) => (
                  <Text key={index} style={styles.texto}>
                    {index + 1}. {passo}
                  </Text>
                ))}
              </>
            )}
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
    textAlign: 'center',
    margin: 20,
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
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  texto: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FormIngredientes;