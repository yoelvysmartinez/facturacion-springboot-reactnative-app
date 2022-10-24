import React from 'react'
import Spinner from 'react-native-loading-spinner-overlay';
import { colores } from '../theme/appTheme';



export const CargandoSpinner = () => {
  return (
    <Spinner
      visible={true}
      textContent={'Cargando...'}
      textStyle={{
        color: colores.principal
      }}
    />
  )
}
