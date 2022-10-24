import 'react-native-gesture-handler';
import React, { useEffect } from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { InicioNavigator } from './src/navigator/InicioNavigator';
import { AuthProvider } from './src/context/AuthContext';
import SplashScreen from 'react-native-splash-screen';

const AppState = ({ children }: any) => {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}

const App = () => {

  useEffect(() => {
    SplashScreen.hide();
  }, [])

  return (
    <NavigationContainer>
      <AppState>
        <InicioNavigator />
      </AppState>
    </NavigationContainer>
  )
}

export default App;
