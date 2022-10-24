import React, { useContext } from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { AuthContext } from '../context/AuthContext';
import { CargandoScreen } from '../screens/CargandoScreen';
import { MenuLateral } from './MenuLateral';

const Stack = createStackNavigator();

export const InicioNavigator = () => {

  const { estado } = useContext(AuthContext)

  if(estado === 'verificando')
    return <CargandoScreen />

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: 'white'
        }
      }}

    >
      {
        (estado === 'logueado')
          ? <Stack.Screen name="MenuLateral" component={MenuLateral} />
          : <Stack.Screen name="LoginScreen" component={LoginScreen} />
      }
    </Stack.Navigator>
  )
}
