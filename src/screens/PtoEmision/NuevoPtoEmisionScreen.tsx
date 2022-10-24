import { StackScreenProps } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react'
import { Text, View, TextInput, Platform } from 'react-native';
import { PtoEmision } from '../../interfaces/interfacesApp';
import { useForm } from '../../hooks/useForm';
import { CargandoSpinner } from '../../components/CargandoSpinner';
import { ContenedorFormulario } from '../../components/ContenedorFormulario';
import { formStyles } from '../../theme/formTheme';
import { colores } from '../../theme/appTheme';
import { TouchableOpacity } from 'react-native-gesture-handler';
import gasolineraApi from '../../api/gasolineraApi';
import { notificacion } from '../../utils/notificacion';
import procesarError from '../../api/procesarError';
import { HeaderBotonMenu } from '../../components/HeaderBotonMenu';

interface Props extends StackScreenProps<any, any> { }
export const NuevoPtoEmisionScreen = ({ navigation }: Props) => {

    const ptoEmisionInicial: PtoEmision = {
        nombre: '',
        codEstablecimiento: '',
        codPtoEmision: '',
        secuencial: 1
    }

    const { form, onChange, setFormData } = useForm<PtoEmision>(ptoEmisionInicial)

    const [guardando, setGuardando] = useState(false);

    const { nombre, codEstablecimiento, codPtoEmision, secuencial } = form;

    const crearPtoEmision = async()=>{
        setGuardando(true)
        try {
            await gasolineraApi.post("/pto-emision", form)
            notificacion("Pto Emision Creado")
            setGuardando(false)
            setFormData(ptoEmisionInicial)
            navigation.navigate("PtosEmisionScreen")
        } catch (error) {
            const mensajeError = procesarError(error);
            notificacion(mensajeError)
        } 
        setGuardando(false)
    }

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderBotonMenu onPress={() => navigation.navigate("PtosEmisionScreen")} iconName="arrow-back-outline"/>
            )
        }
        )
    }, [])

    return (
        <>
            {(guardando) && <CargandoSpinner />}
            <ContenedorFormulario>
                <View style={formStyles.contenedorFormulario}>

                    <Text style={formStyles.label}>Nombre:</Text>
                    <TextInput
                        placeholder='Nombre del Pto Emision'
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

                    <Text style={formStyles.label}>Cod Establecimiento:</Text>
                    <TextInput
                        placeholder='Ejemplo 001'
                        placeholderTextColor={colores.principalClaro}
                        underlineColorAndroid={colores.principalClaro}
                        style={[formStyles.input,
                        (Platform.OS === 'ios') && formStyles.inputIos
                        ]}
                        maxLength={3}
                        keyboardType="numeric"
                        onChangeText={(value) => onChange(value, "codEstablecimiento")}
                        value={codEstablecimiento}
                    />

                    <Text style={formStyles.label}>Cod. Punto Emision:</Text>
                    <TextInput
                        placeholder='Ejemplo 001'
                        placeholderTextColor={colores.principalClaro}
                        underlineColorAndroid={colores.principalClaro}
                        style={[formStyles.input,
                        (Platform.OS === 'ios') && formStyles.inputIos
                        ]}
                        maxLength={3}
                        keyboardType="numeric"
                        onChangeText={(value) => onChange(value, "codPtoEmision")}
                        value={codPtoEmision}
                    />
                     <Text style={formStyles.label}>Secuencial:</Text>
                    <TextInput
                    
                        placeholder='Ingrese el numero secuencial'
                        placeholderTextColor={colores.principalClaro}
                        underlineColorAndroid={colores.principalClaro}
                        style={[formStyles.input,
                        (Platform.OS === 'ios') && formStyles.inputIos
                        ]}
                        maxLength={9}
                        keyboardType="numeric"
                        onChangeText={(value) => onChange(value, "secuencial")}
                        value={secuencial.toString()}
                    />
                    <View
                        style={formStyles.contenedorBoton}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={formStyles.boton}
                            onPress={crearPtoEmision}
                        >
                            <Text style={formStyles.textoBoton}>GUARDAR</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ContenedorFormulario>

        </>
    )
}
