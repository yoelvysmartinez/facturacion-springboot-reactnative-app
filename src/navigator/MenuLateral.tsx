import React, { useContext } from 'react'
import { TouchableOpacity, useWindowDimensions, View, Text } from 'react-native';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { menuLateralStyle } from '../theme/menuLateralTheme';
import { UsuariosScreen } from '../screens/Usuarios/UsuariosScreen';
import { NuevoPtoEmisionScreen } from '../screens/PtoEmision/NuevoPtoEmisionScreen';
import { CambiarPasswordScreen } from '../screens/Usuarios/CambiarPasswordScreen';
import { PtosEmisionScreen } from '../screens/PtoEmision/PtosEmisionScreen';
import { AsignarPtoEmisionScreen } from '../screens/PtoEmision/AsignarPtoEmisionScreen';
import { NuevoUsuarioScreen } from '../screens/Usuarios/NuevoUsuarioScreen';
import { Logo } from '../components/Logo';
import { AuthContext } from '../context/AuthContext';
import { ItemMenuLateral } from '../components/ItemMenuLateral';
import { colores } from '../theme/appTheme';
import { DatoUsuario } from '../interfaces/interfacesApp';
import { FacturasScreen } from '../screens/Factura/FacturasScreen';
import { NuevaFacturaScreen } from '../screens/Factura/NuevaFacturaScreen';

export type MenuLateralParams = {
  FacturasScreen: undefined,
  UsuariosScreen: undefined,
  NuevoUsuarioScreen: undefined,
  CambiarPasswordScreen: DatoUsuario,
  PtosEmisionScreen: undefined,
  NuevoPtoEmisionScreen: undefined,
  AsignarPtoEmisionScreen: DatoUsuario,
  NuevaFacturaScreen: undefined
}

const Drawer = createDrawerNavigator<MenuLateralParams>();

export const MenuLateral = () => {
  const { width } = useWindowDimensions()

  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: width >= 768 ? 'permanent' : 'front', //768
        headerShown: true,  // Oculta la hamburguesa 
        headerStyle: {
          backgroundColor: colores.principal,
        },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
      drawerContent={(props) => <MenuInterno {...props} />}
    >
      <Drawer.Screen name="FacturasScreen" component={FacturasScreen} options={{ title: "Facturas" }} />
      <Drawer.Screen name="NuevaFacturaScreen" component={NuevaFacturaScreen} options={{ title: "Nueva Factura" }} />

      <Drawer.Screen name="UsuariosScreen" component={UsuariosScreen} options={{ title: "Usuarios" }} />
      <Drawer.Screen name="NuevoUsuarioScreen" component={NuevoUsuarioScreen} options={{ title: "Nuevo Usuario" }} />
      <Drawer.Screen name="CambiarPasswordScreen" component={CambiarPasswordScreen} options={{ title: "Cambiar Contraseña" }} />

      <Drawer.Screen name="PtosEmisionScreen" component={PtosEmisionScreen} options={{ title: "Puntos Emisión" }} />
      <Drawer.Screen name="NuevoPtoEmisionScreen" component={NuevoPtoEmisionScreen} options={{ title: "Nuevo Punto Emisión" }} />
      <Drawer.Screen name="AsignarPtoEmisionScreen" component={AsignarPtoEmisionScreen} options={{ title: "Asignar Punto Emisión" }} />
    </Drawer.Navigator>
  )
}


const MenuInterno = ({ navigation }: DrawerContentComponentProps) => {
  const { cerrarSesion, usuarioLogueado } = useContext(AuthContext)

  return (
    <DrawerContentScrollView contentContainerStyle={{ flex: 1 }}>
      <View style={{ flex: 1 }}>
        <View style={menuLateralStyle.logoContainer}>
          <Logo />
        </View>

        <View style={menuLateralStyle.menuContainer}>
          <ItemMenuLateral navigation={navigation} nombreIcono='cash-outline' nombrePantalla='FacturasScreen' nombreMenu='Facturas' />
          {usuarioLogueado?.rol === "ADMINISTRADOR" &&
            <>
              <ItemMenuLateral navigation={navigation} nombreIcono='people-outline' nombrePantalla='UsuariosScreen' nombreMenu='Usuarios' />
              <ItemMenuLateral navigation={navigation} nombreIcono='clipboard-outline' nombrePantalla='PtosEmisionScreen' nombreMenu='Puntos Emisión' />
            </>
          }
        </View>

        <View style={menuLateralStyle.cerrarSesionContainer}>
          <Text style={menuLateralStyle.usuarioLogueado}>{usuarioLogueado?.nombre} {usuarioLogueado?.apellidos}</Text>
          <TouchableOpacity
            style={menuLateralStyle.menuCerrarSesionBoton}
            onPress={cerrarSesion}
          >
            <Icon name='log-out-outline' size={20} color='white' />
            <Text style={menuLateralStyle.menuCerrarSesion}> Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </DrawerContentScrollView>
  )
}
