import React from 'react'
import { Dimensions, View } from 'react-native'
import { colores } from '../theme/appTheme';

export const Background = () => {

  const {height, width} = Dimensions.get('window');
  return (
   <View
    style={{
        position: 'absolute',
        backgroundColor: colores.fondo,
        width,
        top: height *0.20,
        height: height *1.90,
        transform: [
          {
            rotate: '-70deg'
          }
        ]

    }}
   ></View>
  )
}
