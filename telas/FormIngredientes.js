import React, { useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import AppLayouts from '../componentes/AppLayouts';
import Input from '../componentes/Inputs';
import Buttons from '../componentes/Buttons';

function FormIngredientes() {
  const [ingredientes, setIngredientes] = useState('');
  const [receita, setReceita] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!ingredientes.trim()) {
      alert('Por favor, insira pelo menos um ingrediente.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.0.101:5000/gerar-receita', {
        ingredientes: ingredientes.split(',').map((item) => item.trim()),
      });

      console.log("Resposta da API:", response.data); // Debug
      setReceita(response.data.receitas || []);
    } catch (error) {
      console.error('Erro ao gerar receita:', error.response?.data || error.message);
      setReceita([{ titulo: 'Erro', descricao: 'Não foi possível gerar receita.' }]);
    }
    setLoading(false);
  };

  return (
    <AppLayouts hideNavbar={true}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
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
        {loading && <ActivityIndicator size="large" color="#f37e8f" />}
        {receita?.length > 0 && (
          <View style={styles.receitaContainer}>
            <Text style={styles.receitaTitle}>Receitas Encontradas:</Text>
            {receita.map((item, index) => (
              <View key={index} style={styles.receitaItem}>
                <Text style={styles.receitaNome}>{item.titulo}</Text>
                <Text>{item.descricao}</Text>
                <Text style={styles.subTitle}>Ingredientes:</Text>
                {item.ingredientes?.map((ing, i) => (
                  <Text key={i}>- {ing}</Text>
                ))}
                <Text style={styles.subTitle}>Modo de Preparo:</Text>
                {item.instrucoes?.map((inst, i) => (
                  <Text key={i}>{i + 1}. {inst}</Text>
                ))}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </AppLayouts>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  receitaContainer: {
    marginTop: 20,
    width: '100%',
  },
  receitaTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  receitaItem: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
  },
  receitaNome: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  subTitle: {
    fontWeight: 'bold',
    marginTop: 10,
  },
});

export default FormIngredientes;
