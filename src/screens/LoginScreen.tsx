import React, { useContext, useEffect, useRef, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, Text, TextInput, View, TouchableOpacity } from 'react-native'
import { Background } from '../components/Background';
import { Logo } from '../components/Logo';
import { loginStyles } from '../theme/loginTheme';
import { colores } from '../theme/appTheme';
import { useForm } from '../hooks/useForm';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthContext } from '../context/AuthContext';
import { CargandoSpinner } from '../components/CargandoSpinner';
import { notificacion } from '../utils/notificacion';

interface Props extends StackScreenProps<any, any> { }

export const LoginScreen = ({ navigation }: Props) => {

    const { iniciarSesion, mensajeError, borrarError } = useContext(AuthContext)

    const [enproceso, seteEnproceso] = useState(false)

    const { nombreUsuario, password, onChange } = useForm({
        nombreUsuario: '',
        password: ''
    })

    useEffect(() => {
        if (mensajeError.length === 0) return;
        notificacion(mensajeError);
        borrarError();

    }, [mensajeError])

    const refPassword = useRef<TextInput>();

    const login = async () => {
        Keyboard.dismiss();
        seteEnproceso(true)
        await iniciarSesion({ nombreUsuario, password });
        seteEnproceso(false)
    }
    return (
        <>
            <Background />
            {enproceso && <CargandoSpinner />}
            <KeyboardAvoidingView
                style={{
                    flex: 1
                }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={loginStyles.contenedorFormulario}>

                    <Logo />
                    <Text style={loginStyles.titulo}>Iniciar Sesion</Text>

                    <Text style={loginStyles.label}>Usuario:</Text>
                    <TextInput
                        placeholder='Ingrese su usuario'
                        placeholderTextColor={colores.principalClaro}
                        underlineColorAndroid={colores.principalClaro}
                        style={[loginStyles.input,
                        (Platform.OS === 'ios') && loginStyles.inputIos
                        ]}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={(value) => onChange(value, "nombreUsuario")}
                        onSubmitEditing={() => refPassword.current?.focus()}
                        value={nombreUsuario}
                    />

                    <Text style={loginStyles.label}>Contraseña:</Text>
                    <TextInput
                        placeholder='*****'
                        secureTextEntry
                        placeholderTextColor={colores.principalClaro}
                        underlineColorAndroid={colores.principalClaro}
                        style={[loginStyles.input,
                        (Platform.OS === 'ios') && loginStyles.inputIos
                        ]}
                        ref={refPassword as any}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={(value) => onChange(value, "password")}
                        value={password}
                    />

                    <View
                        style={loginStyles.contenedorBoton}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={loginStyles.boton}
                            onPress={login}
                        >
                            <Text style={loginStyles.textoBoton}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </>
    )
}
