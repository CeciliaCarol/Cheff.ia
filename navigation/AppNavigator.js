// navigation/AppNavigator.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../telas/Home';
import Comments from '../telas/Comments';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={Home} 
          options={{ title: 'Receitas' }}
        />
        <Stack.Screen 
          name="Comments" 
          component={Comments} 
          options={{ title: 'Comentários' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;