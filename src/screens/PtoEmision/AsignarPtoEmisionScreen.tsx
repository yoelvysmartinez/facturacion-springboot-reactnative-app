import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native';
import { MenuLateralParams } from '../../navigator/MenuLateral';
import { DatoUsuario } from '../../interfaces/interfacesApp';
import { ContenedorFormulario } from '../../components/ContenedorFormulario';
import { InformacionUsuario } from '../../components/InformacionUsuario';
import { usePtosEmision } from '../../hooks/usePtosEmision';
import { CargandoSpinner } from '../../components/CargandoSpinner';
import { Picker } from '@react-native-picker/picker';
import { inputFormularioFontSize } from '../../theme/fuente';
import { colores } from '../../theme/appTheme';
import { formStyles } from '../../theme/formTheme';
import gasolineraApi from '../../api/gasolineraApi';
import { notificacion } from '../../utils/notificacion';
import procesarError from '../../api/procesarError';
import { HeaderBotonMenu } from '../../components/HeaderBotonMenu';

interface Props extends StackScreenProps<MenuLateralParams, 'AsignarPtoEmisionScreen'> { }

export const AsignarPtoEmisionScreen = ({ route, navigation }: Props) => {
    const [guardando, setGuardando] = useState(false);
    const { cargando, ptosEmision, cargarPtosEmision } = usePtosEmision();

    useEffect(() => {
        cargarPtosEmision()
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderBotonMenu onPress={() => navigation.navigate("UsuariosScreen")} iconName="arrow-back-outline"/>
            )
        }
        )
    }, [])

    const datosUsuario: DatoUsuario = route.params
    const [ptoEmisionSeleccionado, setPtoEmisionSeleccionado] = useState(datosUsuario.ptoEmision ? datosUsuario.ptoEmision.id : 0)

    const asignarPtoEmision = async () => {
        setGuardando(true)
        try {
            await gasolineraApi.post(`usuario/${datosUsuario.id}/asignar-pto-emision/${ptoEmisionSeleccionado}`)
            notificacion("Pto Emision Asigando")
            setGuardando(false)
            navigation.navigate("UsuariosScreen")
        } catch (error) {
            const mensajeError = procesarError(error);
            notificacion(mensajeError)
        }
        setGuardando(false)
    }

    return (
        <>
            {(guardando || cargando) && <CargandoSpinner />}
            <ContenedorFormulario>
                <View style={{
                    alignItems: 'center'
                }}>
                    <InformacionUsuario item={datosUsuario} />
                </View>
                <Picker
                    selectedValue={ptoEmisionSeleccionado}
                    onValueChange={setPtoEmisionSeleccionado} >
                    {
                        ptosEmision.map(p => <Picker.Item
                            style={{ fontSize: inputFormularioFontSize, color: colores.principal }}
                            label={`(${p.codEstablecimiento}-${p.codPtoEmision}) ${p.nombre}`}
                            value={p.id}
                            key={p.id} />)
                    }

                </Picker>
                <View
                    style={formStyles.contenedorBoton}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={formStyles.boton}
                        onPress={asignarPtoEmision}
                    >
                        <Text style={formStyles.textoBoton}>GUARDAR</Text>
                    </TouchableOpacity>
                </View>
            </ContenedorFormulario>
        </>
    )
}
