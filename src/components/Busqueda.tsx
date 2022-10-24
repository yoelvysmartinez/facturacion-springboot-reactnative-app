import React, { useEffect, useState } from 'react'
import { colores } from '../theme/appTheme';
import { formStyles } from '../theme/formTheme';
import { Platform, TextInput } from 'react-native';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useIsFocused } from '@react-navigation/native';

interface Props {
    filtrarPorBusqueda: (busqueda: string) => void,
    placeholder: string
}

export const Busqueda = ({ filtrarPorBusqueda, placeholder }: Props) => {
    const [busqueda, setBusqueda] = useState('')

    const activa = useIsFocused()

    useEffect(() => {
      setBusqueda('')
    }, [activa])
    

    const deboncedValue = useDebouncedValue(busqueda)

    useEffect(() => {
        filtrarPorBusqueda(deboncedValue)

    }, [deboncedValue])


    return (
        <TextInput
            placeholder={placeholder}
            placeholderTextColor={colores.principalClaro}
            underlineColorAndroid={colores.principalClaro}
            style={[formStyles.input,
            (Platform.OS === 'ios') && formStyles.inputIos,
            { marginHorizontal: 20 }
            ]}
            onChangeText={setBusqueda}
            autoCapitalize='words'
            autoCorrect={false}
            value={busqueda}
        />
    )
}
