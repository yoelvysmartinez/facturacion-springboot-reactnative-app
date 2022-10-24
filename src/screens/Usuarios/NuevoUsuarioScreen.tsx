import React, { useEffect, useState } from 'react'
import {  Platform, Text, TextInput, View } from 'react-native';
import { colores } from '../../theme/appTheme';
import { useForm } from '../../hooks/useForm';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { formStyles } from '../../theme/formTheme';
import { CargandoSpinner } from '../../components/CargandoSpinner';
import { Picker } from '@react-native-picker/picker';
import { usePtosEmision } from '../../hooks/usePtosEmision';
import { NuevoUsuario } from '../../interfaces/interfacesApp';
import { ContenedorFormulario } from '../../components/ContenedorFormulario';
import { inputFormularioFontSize } from '../../theme/fuente';
import gasolineraApi from '../../api/gasolineraApi';
import procesarError from '../../api/procesarError';
import { StackScreenProps } from '@react-navigation/stack';
import { notificacion } from '../../utils/notificacion';
import { HeaderBotonMenu } from '../../components/HeaderBotonMenu';

interface Props extends StackScreenProps<any, any> { }

export const NuevoUsuarioScreen = ({ navigation }: Props) => {
    const usuarioInicial: NuevoUsuario = {
        nombre: '',
        apellido: '',
        nombreUsuario: '',
        password: '',
        ptoEmisionId: 0
    }
    const { form, onChange, setFormData } = useForm<NuevoUsuario>(usuarioInicial)

    const [guardando, setGuardando] = useState(false);
    const { cargando, ptosEmision, cargarPtosEmision } = usePtosEmision()

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

    const { nombre, apellido, nombreUsuario, password, ptoEmisionId } = form;
    const crearUsuario = async () => {
        setGuardando(true)
        try {
            await gasolineraApi.post("/usuario", form)
            notificacion("Usuario Creado")
            setGuardando(false)
            setFormData(usuarioInicial)
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
                <View style={formStyles.contenedorFormulario}>

                    <Text style={formStyles.label}>Nombre:</Text>
                    <TextInput
                        placeholder='Ingrese el nombre'
                        placeholderTextColor={colores.principalClaro}
                        underlineColorAndroid={colores.principalClaro}
                        style={[formStyles.input,
                        (Platform.OS === 'ios') && formStyles.inputIos
                        ]}
                        onChangeText={(value) => onChange(value, "nombre")}
                        autoCapitalize='words'
                        autoCorrect={false}
                        value={nombre}
                    />

                    <Text style={formStyles.label}>Apellidos:</Text>
                    <TextInput
                        placeholder='Ingrese los apellidos'
                        placeholderTextColor={colores.principalClaro}
                        underlineColorAndroid={colores.principalClaro}
                        style={[formStyles.input,
                        (Platform.OS === 'ios') && formStyles.inputIos
                        ]}
                        autoCapitalize='words'
                        autoCorrect={false}
                        onChangeText={(value) => onChange(value, "apellido")}
                        value={apellido}
                    />

                    <Text style={formStyles.label}>Usuario:</Text>
                    <TextInput
                        placeholder='Ingrese su usuario'
                        placeholderTextColor={colores.principalClaro}
                        underlineColorAndroid={colores.principalClaro}
                        style={[formStyles.input,
                        (Platform.OS === 'ios') && formStyles.inputIos
                        ]}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={(value) => onChange(value, "nombreUsuario")}
                        value={nombreUsuario}
                    />

                    <Text style={formStyles.label}>Contraseña:</Text>
                    <TextInput
                        placeholder='*****'
                        secureTextEntry
                        placeholderTextColor={colores.principalClaro}
                        underlineColorAndroid={colores.principalClaro}
                        style={[formStyles.input,
                        (Platform.OS === 'ios') && formStyles.inputIos
                        ]}
                        autoCapitalize='none'
                        autoCorrect={false}
                        onChangeText={(value) => onChange(value, "password")}
                        value={password}
                    />
                    <Text style={formStyles.label}>Punto Emision:</Text>

                    <Picker
                        selectedValue={ptoEmisionId}
                        onValueChange={(value) => onChange(value, "ptoEmisionId")}>
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
                            onPress={crearUsuario}
                        >
                            <Text style={formStyles.textoBoton}>GUARDAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ContenedorFormulario>

        </>
    )
}

