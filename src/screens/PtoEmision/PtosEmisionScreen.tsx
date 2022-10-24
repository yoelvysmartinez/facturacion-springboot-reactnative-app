
import React, { useEffect } from 'react'
import { ListRenderItemInfo, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CargandoSpinner } from '../../components/CargandoSpinner';
import { usePtosEmision } from '../../hooks/usePtosEmision';
import { Tarjeta } from '../../components/Tarjeta';
import { colores } from '../../theme/appTheme';
import { labelFormularioFontSize } from '../../theme/fuente';
import { FlatList } from 'react-native-gesture-handler';
import { PtoEmision } from '../../interfaces/interfacesApp';
import { StackScreenProps } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import { HeaderBotonMenu } from '../../components/HeaderBotonMenu';

interface Props extends StackScreenProps<any, any> { }

export const PtosEmisionScreen = ({ navigation }: Props) => {
    const { cargando, ptosEmision, cargarPtosEmision } = usePtosEmision()

    const activa = useIsFocused()
    useEffect(() => {
        if (activa) {
            cargarPtosEmision()
        }
    }, [activa])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderBotonMenu onPress={() => navigation.navigate("NuevoPtoEmisionScreen")} iconName="add-circle-outline"/>
            )
        }
        )
    }, [])

    return (
        <>
            {(cargando) && <CargandoSpinner />}
            <FlatList
                data={ptosEmision}
                renderItem={datosPtoEmision}
                keyExtractor={() => new Date().getTime().toString() + Math.random().toString()}
            />
        </>
    )


}

const datosPtoEmision = ({ item }: ListRenderItemInfo<PtoEmision>) => {
    return (
        <Tarjeta>
            <View style={styles.contenedor}>
                <Text style={styles.titulo}>{item.nombre}</Text>
                <View style={styles.contendorCodigo}>
                    <View style={styles.contendorDatosCodigo}>
                        <Text style={styles.textoCodigo}>Establecimiento</Text>
                        <Text style={styles.textoCodigo}>Pto Emision</Text>
                        <Text style={styles.textoCodigo}>Secuencial</Text>
                    </View>
                    <View style={styles.contendorDatosCodigo}>
                        <Text style={styles.textoCodigo}>{item.codEstablecimiento}</Text>
                        <Text style={styles.textoCodigo}>{item.codPtoEmision}</Text>
                        <Text style={styles.textoCodigo}>{item.secuencial}</Text>
                    </View>
                </View>

            </View>
        </Tarjeta>
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
        flexDirection: 'column',
        flex: 1
    },
    contendorDatosCodigo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5

    },
    textoCodigo: {
        color: colores.principalClaro,
        fontSize: labelFormularioFontSize,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1
    }
})


