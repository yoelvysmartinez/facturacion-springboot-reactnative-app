import React from 'react'
import { ActivityIndicator, View } from 'react-native';
import { colores } from '../theme/appTheme';

export const CargandoScreen = () => {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignContent: 'center'
            }}
        >
            <ActivityIndicator
                size={50}
                color={colores.principal}
            >

            </ActivityIndicator>
        </View>
    )
}
