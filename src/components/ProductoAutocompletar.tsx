import React, { useEffect, useState } from 'react'
import { Platform, ScrollView, Text, TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import { formStyles } from '../theme/formTheme';
import { colores } from '../theme/appTheme';
import { Producto } from '../interfaces/interfacesApp';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { useProductos } from '../hooks/useProductos';

interface Props {
    seleccionarProducto: (producto: Producto) => void,
}

export const ProductoAutoCompletar = ({seleccionarProducto}: Props) => {

    const [busqueda, setBusqueda] = useState('')

    const deboncedValue = useDebouncedValue(busqueda)

    const { productos, cargarProductos } = useProductos()

    useEffect(() => {
        cargarProductos(deboncedValue)
        
    }, [deboncedValue])

    return (
        <View>
            <TextInput
                placeholder='Busque el producto a agregar'
                placeholderTextColor={colores.principalClaro}
                underlineColorAndroid={colores.principalClaro}
                style={[formStyles.input,
                (Platform.OS === 'ios') && formStyles.inputIos
                ]}
                onChangeText={setBusqueda}
                autoCapitalize='words'
                autoCorrect={false}
                value={busqueda}
            />
            {productos.length > 0 && <ScrollView style={styles.opcionesBusqueda}>
                <>
                    {productos.map(p => (
                        <TouchableOpacity key={p.codigoProducto}
                            onPress={() => {
                                setBusqueda('')
                                seleccionarProducto(p)
                            }}
                            style={{
                                height: 20,
                                margin: 8
                            }}>
                            <Text style={{ color: colores.principal, fontWeight: 'bold' }}>{p.nombreProducto}</Text>
                        </TouchableOpacity>
                    ))}

                </>
            </ScrollView>}

            
        </View>
    )
}

const styles = StyleSheet.create({
    opcionesBusqueda: {
        position: 'absolute',
        zIndex: 1,
        width: '100%',
        top: 45,
        maxHeight: '70%',
        backgroundColor: "white",
        borderRadius: 0,
        shadowColor: 'black',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 4,
        paddingHorizontal: 10,
        paddingBottom: 20
    },
    noExisteProducto: {
        fontSize: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    }
});
