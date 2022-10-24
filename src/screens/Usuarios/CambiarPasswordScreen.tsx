import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, Platform, TouchableOpacity } from 'react-native';
import { appStyle, colores } from '../../theme/appTheme';
import { StackScreenProps } from '@react-navigation/stack';
import { MenuLateralParams } from '../../navigator/MenuLateral';
import { DatoUsuario } from '../../interfaces/interfacesApp';
import { ContenedorFormulario } from '../../components/ContenedorFormulario';
import { InformacionUsuario } from '../../components/InformacionUsuario';
import { CargandoSpinner } from '../../components/CargandoSpinner';
import gasolineraApi from '../../api/gasolineraApi';
import { notificacion } from '../../utils/notificacion';
import procesarError from '../../api/procesarError';
import { formStyles } from '../../theme/formTheme';
import { HeaderBotonMenu } from '../../components/HeaderBotonMenu';

interface Props extends StackScreenProps<MenuLateralParams, 'CambiarPasswordScreen'> { }



export const CambiarPasswordScreen = ({ route, navigation }: Props) => {
    const datosUsuario: DatoUsuario = route.params
    const [guardando, setGuardando] = useState(false);
    const [nuevoPassword, setNuevoPassword] = useState("")

    const cambiarPassword = async () => {
        setGuardando(true)
        try {
            await gasolineraApi.post(`usuario/${datosUsuario.id}/cambiar-password`, { nuevoPassword })
            notificacion("Contraseña Actualizada")
            setGuardando(false)
            navigation.navigate("UsuariosScreen")
        } catch (error) {
            const mensajeError = procesarError(error);
            notificacion(mensajeError)
        }
        setGuardando(false)
    }

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderBotonMenu onPress={() => navigation.navigate("UsuariosScreen")} iconName="arrow-back-outline"/>
            )
        }
        )
    }, [])

    return (
        <>
            {(guardando) && <CargandoSpinner />}

            <ContenedorFormulario>
                <View style={{
                    alignItems: 'center'
                }}>
                    <InformacionUsuario item={datosUsuario} />
                </View>
                <View style={{
                    marginHorizontal: 20
                }}>
                    <Text style={formStyles.label}>Contraseña:</Text>
                    <TextInput
                        placeholder='*****'
                        secureTextEntry
                        placeholderTextColor={colores.principalClaro}
                        underlineColorAndroid={colores.principalClaro}
                        style={[formStyles.input,
                        (Platform.OS === 'ios') && formStyles.inputIos,
                        ]}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={setNuevoPassword}
                        value={nuevoPassword}
                    />
                </View>
                <View
                    style={formStyles.contenedorBoton}
                >
                    <TouchableOpacity
                        activeOpacity={0.8}
                        style={formStyles.boton}
                        onPress={cambiarPassword}
                    >
                        <Text style={formStyles.textoBoton}>GUARDAR</Text>
                    </TouchableOpacity>
                </View>
            </ContenedorFormulario>
        </>
    )
}
