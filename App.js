import 'react-native-gesture-handler'
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { LogBox, StatusBar, View } from 'react-native';
import Routes from './src/routes';
import AuthProvider from './src/contexts/auth';

LogBox.ignoreAllLogs(true)

function App(){
  return(
    <NavigationContainer>
      <AuthProvider>
        <StatusBar backgroundColor="#131313" barStyle="light-content"/>
        <Routes />
      </AuthProvider>
    </NavigationContainer>
  )
}

export default App;