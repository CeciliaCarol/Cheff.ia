import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import axios from 'axios';
import AppLayouts from '../componentes/AppLayouts';

function FormIngredientes() {
  const [ingredientes, setIngredientes] = useState('');
  const [receita, setReceita] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Validação: Verifica se há ingredientes inseridos
    if (!ingredientes.trim()) {
      alert('Por favor, insira pelo menos um ingrediente.');
      return;
    }

    setLoading(true);
    try {
      // Faz a requisição para o servidor
      const response = await axios.post('http://192.168.0.101:5000/gerar-receita', {
        ingredientes: ingredientes.split(',').map((item) => item.trim()), // Separa e limpa os ingredientes
      });

      // Atualiza o estado com a receita gerada
      setReceita(response.data.receita);
    } catch (error) {
      console.error('Erro ao gerar receita:', error.response ? error.response.data : error.message);
      setReceita('Erro ao gerar receita. Verifique o console para mais detalhes.');
    }
    setLoading(false);
  };

  return (
    <AppLayouts>
      <Text style={styles.title}>Gerar Receita</Text>
      <TextInput
        style={styles.input}
        value={ingredientes}
        onChangeText={setIngredientes}
        placeholder="Exemplo: frango, batata, cebola"
        placeholderTextColor="#999"
      />
      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Gerando...' : 'Gerar Receita'}
        </Text>
      </TouchableOpacity>
      {loading && <ActivityIndicator size="large" color="#f37e8f" />}
      {receita && (
        <View style={styles.receitaContainer}>
          <Text style={styles.receitaTitle}>Receita Gerada:</Text>
          <Text style={styles.receita}>{receita}</Text>
        </View>
      )}
    </AppLayouts>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#f37e8f',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
    marginBottom: 20,
    color: '#333',
  },
  button: {
    backgroundColor: '#f37e8f',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
  receita: {
    fontSize: 16,
    color: '#555',
  },
});

export default FormIngredientes;