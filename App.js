import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Register from './telas/Register';
import Login from './telas/Login';
import Home from './telas/Home';  // Importa a tela Home
import Add from './telas/Add';
import Edit from './telas/Edit';
import Receitas from './telas/Receitas';
import Detalhes from './telas/Detalhes';
import { ActivityIndicator } from 'react-native';
import { useFonts } from 'expo-font';


const Stack = createStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('./assets/fontes/Poppins-Regular.ttf'),
    'Poppins-Bold': require('./assets/fontes/Poppins-Bold.ttf'),
    'PlayfairDisplay-Regular': require('./assets/fontes/PlayfairDisplay-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register">
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name='Add' component={Add}/>
        <Stack.Screen name='Edit' component={Edit}/>
        <Stack.Screen name='Receitas' component={Receitas}/>
        <Stack.Screen name='Detalhes' component={Detalhes}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
