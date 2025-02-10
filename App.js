import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Register from './telas/Register';
import Login from './telas/Login';
import Home from './telas/Home';  
import Add from './telas/Add';
import Edit from './telas/Edit';
import Receitas from './telas/Receitas';
import Detalhes from './telas/Detalhes';
import Favoritos from './telas/Favoritos'; 
import FormIngredientes from "./telas/FormIngredientes";
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
      <Stack.Navigator initialRouteName="Register" screenOptions={{
        headerStyle: {
          backgroundColor: '#f37e8f',
          elevation: 0,
        },
        headerTintColor: '#fff',
        headerTitle: '', 
      }} >
        <Stack.Screen name="Login" component={Login} options={{headerShown: true}} />
        <Stack.Screen name="Register" component={Register} options={{headerShown: false}}/>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Add" component={Add} 
        options={{
          headerTransparent: true,
          headerTintColor: '#000',
        }} />
        <Stack.Screen name="Edit" component={Edit} 
        options={{
          headerTransparent: true,
          headerTintColor: '#000',
        }}
        />
        <Stack.Screen name="Receitas" component={Receitas} 
        options={{
          headerTransparent: true,
          headerTintColor: '#000',
        }}
        />
        <Stack.Screen name="Detalhes" component={Detalhes}  
        options={{
            headerTransparent: true,
            headerTintColor: '#000',
        }}
        />
        <Stack.Screen name="Favoritos" component={Favoritos} 
        options={{
          headerTransparent: true,
          headerTintColor: '#000',
        }}
        />
        {/* Adicione a tela FormIngredientes no Stack Navigator */}
        <Stack.Screen name="FormIngredientes" component={FormIngredientes} 
          options={{
            headerTransparent: true,
            headerTintColor: '#000',
          }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
