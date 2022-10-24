import React, { useEffect } from 'react'
import { ListRenderItemInfo, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CargandoSpinner } from '../../components/CargandoSpinner';
import { Tarjeta } from '../../components/Tarjeta';
import { colores } from '../../theme/appTheme';
import { DatoUsuario } from '../../interfaces/interfacesApp';
import { useUsuarios } from '../../hooks/useUsuarios';
import { StackScreenProps } from '@react-navigation/stack';
import { InformacionUsuario } from '../../components/InformacionUsuario';
import { useIsFocused } from '@react-navigation/native';
import { HeaderBotonMenu } from '../../components/HeaderBotonMenu';
import { Busqueda } from '../../components/Busqueda';


interface Props extends StackScreenProps<any, any> { }

export const UsuariosScreen = ({ navigation }: Props) => {
  const { cargando, usuarios, cargarUsuarios } = useUsuarios()
  const activa = useIsFocused()

  useEffect(() => {
    if (activa) {
      cargarUsuarios("")
    }
  }, [activa])

  useEffect(() => {
    navigation.setOptions({
        headerRight: () => (
          <HeaderBotonMenu onPress={() => navigation.navigate("NuevoUsuarioScreen")} iconName="add-circle-outline"/>   
        )
    }
    )
}, [])

  const datosUsuarios = ({ item }: ListRenderItemInfo<DatoUsuario>) => {
    return (
      <Tarjeta>
        <View style={styles.contenedor}>
          <InformacionUsuario item={item} />
          <View style={styles.botones}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CambiarPasswordScreen', item)}
            >
              <Icon
                size={30}
                name="key-outline"
                color={colores.principal}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('AsignarPtoEmisionScreen', item)}
            >
              <Icon
                size={30}
                name="funnel-outline"
                color={colores.principal}
              />
            </TouchableOpacity>
          </View>

        </View>
      </Tarjeta>
    )
  }

  return (
    <>
      {(cargando) && <CargandoSpinner />}
      <Busqueda filtrarPorBusqueda={cargarUsuarios} placeholder="Buscar Usuarios"/>
      <FlatList
        data={usuarios}
        renderItem={datosUsuarios}
        keyExtractor={() => new Date().getTime().toString() + Math.random().toString()}
      />
    </>
  )


}

const styles = StyleSheet.create({
  contenedor: {
    flexDirection: 'column'
  },
  botones: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  }
})



