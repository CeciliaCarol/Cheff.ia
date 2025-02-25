import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Welcome from './telas/Welcome';
import Register from './telas/Register';
import Login from './telas/Login';
import Home from './telas/Home';  
import Add from './telas/Add';
import Edit from './telas/Edit';
import Receitas from './telas/Receitas';
import Detalhes from './telas/Detalhes';
import Favoritos from './telas/Favoritos'; 
import FormIngredientes from "./telas/FormIngredientes";
import Perfil from "./telas/Perfil";
import Comments from "./telas/Comments"; // Importe a tela de Comentários
import { ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';

const Stack = createStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fontes/Poppins-Regular.ttf'),
    'Poppins-SemiBold': require('./assets/fontes/Poppins-SemiBold.ttf'),
    'Poppins-Bold': require('./assets/fontes/Poppins-Bold.ttf'),
    'PlayfairDisplay-Regular': require('./assets/fontes/PlayfairDisplay-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{
        headerShown: false, 
      }} >
        <Stack.Screen name="Welcome" component={Welcome} 
          options={{
            headerTransparent: true,
            headerTintColor: 'transparent',
          }} 
        />
        <Stack.Screen name="Login" component={Login} 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Register" component={Register} 
          options={{headerShown: false}}
        />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Add" component={Add} 
          options={{
            headerTransparent: true,
            headerTintColor: '#000',
          }} 
        />
        <Stack.Screen name="Edit" component={Edit} 
          options={{
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />
        <Stack.Screen name="Receitas" component={Receitas} />
        <Stack.Screen name="Detalhes" component={Detalhes}  
          options={{
            headerTransparent: true,
            headerTintColor: '#000',
          }}
        />
        <Stack.Screen name="Favoritos" component={Favoritos} 
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="FormIngredientes" component={FormIngredientes} 
          options={{
            headerShown: false,
          }} 
        />
        <Stack.Screen name="Perfil" component={Perfil}
          options={{
            headerShown: false,
          }}
        />
        {/* Adicione a tela de Comentários */}
        <Stack.Screen name="Comments" component={Comments} 
          options={{
            title: 'Comentários', // Título da tela
            headerShown: true, // Mostra o cabeçalho
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}