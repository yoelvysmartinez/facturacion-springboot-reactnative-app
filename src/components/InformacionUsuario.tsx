import React from 'react'
import { Text, View, StyleSheet } from 'react-native';
import { DatoUsuario } from '../interfaces/interfacesApp';
import { colores } from '../theme/appTheme';
import { labelFormularioFontSize } from '../theme/fuente';
 
interface Props {
    item: DatoUsuario
}

export const InformacionUsuario = ({item} : Props) => {
  return (
      <>
    <Text style={styles.titulo}>{`${item.nombre.toUpperCase()} ${item.apellido.toUpperCase()}`}</Text>
          <View style={styles.contendorCodigo}>
            <View style={styles.contenedorTitulo}>
              <Text style={styles.textoTitulo}>Nombre Usuario</Text>
              <Text style={styles.textoTitulo}>Rol</Text>
              <Text style={styles.textoTitulo}>Nombre Pto Emisión</Text>
              <Text style={styles.textoTitulo}>Establecimiento</Text>
              <Text style={styles.textoTitulo}>Pto Emisión</Text>
              <Text style={styles.textoTitulo}>Secuencial</Text>
            </View>
            <View style={styles.contenedorValores}>
              <Text style={styles.textoValores}>{item.nombreUsuario}</Text>
              <Text style={styles.textoValores}>{item.rol.nombreRol}</Text>
              <Text style={styles.textoValores}>{item.ptoEmision?.nombre}</Text>
              <Text style={styles.textoValores}>{item.ptoEmision?.codEstablecimiento}</Text>
              <Text style={styles.textoValores}>{item.ptoEmision?.codPtoEmision}</Text>
              <Text style={styles.textoValores}>{item.ptoEmision?.secuencial}</Text>
            </View>
          </View>
          </>
  )
}


const styles = StyleSheet.create({
    contenedor: {
      flexDirection: 'column'
    },
    titulo: {
      color: colores.principal,
      fontSize: labelFormularioFontSize,
      fontWeight: 'bold',
      flex: 1
    },
    contendorCodigo: {
      flexDirection: 'row',
      flex: 1,
      marginVertical: 10,
      marginLeft: 20
    },
    contenedorTitulo: {
      flex: 1
    },
    contenedorValores: {
      flex: 1,
    },
    textoTitulo: {
      color: colores.principalOscuro,
      fontSize: labelFormularioFontSize,
      fontWeight: 'bold',
      flex: 1,
      marginBottom: 5
    },
    textoValores: {
      color: colores.principalClaro,
      fontSize: labelFormularioFontSize,
      marginBottom: 5,
      flex: 1
    },
    botones: {
      flexDirection: 'row',
      justifyContent: 'space-around',
    }
  })