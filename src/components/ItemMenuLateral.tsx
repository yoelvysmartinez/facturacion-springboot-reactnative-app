import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { colores } from '../theme/appTheme';
import { menuLateralStyle } from '../theme/menuLateralTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import { Text } from 'react-native';
import { DrawerNavigationHelpers } from '@react-navigation/drawer/lib/typescript/src/types';

interface Props {
  navigation: DrawerNavigationHelpers;
  nombreIcono: string;
  nombrePantalla: string;
  nombreMenu: string;
}


export const ItemMenuLateral = ({ navigation, nombreIcono, nombrePantalla, nombreMenu }: Props) => {
  const colorIcono = colores.principal
  
  const tamIcono = 20
  return (
    <TouchableOpacity
      style={menuLateralStyle.menuBoton}
      onPress={() => navigation.navigate(nombrePantalla)}
    >
      <Icon name={nombreIcono} size={tamIcono} color={colorIcono} />
      <Text style={menuLateralStyle.menuText}> {nombreMenu}</Text>
    </TouchableOpacity>
  )
}
