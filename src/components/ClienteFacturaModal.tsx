import React, { Dispatch, SetStateAction, useState } from 'react'
import { Modal, StyleSheet, TouchableOpacity, View, Text, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colores } from '../theme/appTheme';
import { ClienteNuevaFactura, Filtro } from '../interfaces/interfacesApp';
import { useForm } from '../hooks/useForm';
import { formStyles } from '../theme/formTheme';
import gasolineraApi from '../api/gasolineraApi';
import procesarError from '../api/procesarError';
import { notificacion } from '../utils/notificacion';
import { CargandoSpinner } from './CargandoSpinner';

interface Props {
    visible: boolean,
    setClienteModalAbierto: Dispatch<SetStateAction<boolean>>
    agregarCliente: (cliente: ClienteNuevaFactura) => void
}

export const ClienteFacturaModal = ({ visible, setClienteModalAbierto, agregarCliente }: Props) => {

    const clienteNuevaFacturaInicial: ClienteNuevaFactura = {
        nombreCompletoCliente: "",
        identificacion: "",
        direccion: "",
        placa: "",
        email: ""
    }
    const [modalVisible, setModalVisible] = useState(visible);

    const { form, setFormData, onChange } = useForm<ClienteNuevaFactura>(clienteNuevaFacturaInicial)

    const [cargando, setCargando] = useState(false)

    const { nombreCompletoCliente, identificacion, direccion, placa, email } = form

    const cerrarModal = () => {
        setModalVisible(false)
        setClienteModalAbierto(false)
    }

    const validarYAgregarClienteFactura = () => {

        if (nombreCompletoCliente.trim().length === 0) return notificacion("El nombre del cliente es obligatorio")
        if (identificacion.trim().length === 0) return notificacion("El número de identificación es obligatorio")
        if (direccion.trim().length === 0) return notificacion("La direccion del cliente es obligatorio")

        if (identificacion.trim().length > 13) return notificacion("La longitud maxima de la identificacion es 13")

        agregarCliente(form)
        setClienteModalAbierto(false)
    }

    const buscarPorIdentificacion = async () => {
        try {
            const filtro: Filtro = {
                busqueda: identificacion
            }
            setCargando(true)
            const resp = await gasolineraApi.post<ClienteNuevaFactura[]>(`/cliente/buscar-clientes`, filtro)
            if (resp.data && resp.data.length > 0) {
                setFormData(resp.data[0])
                setCargando(false)
                return;
            }
        } catch (error) {
            const mensajeError = procesarError(error)
            notificacion(mensajeError)
        }
        setCargando(false)
        setFormData({
            ...clienteNuevaFacturaInicial,
            identificacion
        })
    }


    return (
        <>
            {(cargando) && <CargandoSpinner />}
            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                        setClienteModalAbierto(false)
                    }}
                >
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <TouchableOpacity style={{
                                position: 'absolute',
                                right: 0,
                                top: -5,
                                height: 50,
                                width: 50,
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 100,
                                zIndex: 1
                            }}
                                onPress={cerrarModal}
                            >
                                <Icon size={30} color={colores.principal} name="close-outline" />
                            </TouchableOpacity>
                            <View>
                                <Text style={styles.tituloModal}>Agregar Cliente</Text>
                            </View>
                            <View style={styles.fila}>
                                <Icon size={25} color={colores.principalClaro} name="person-circle-outline"
                                    style={styles.icono} />
                                <TextInput
                                    placeholder='Identificacion Cliente'
                                    placeholderTextColor={colores.principalClaro}
                                    underlineColorAndroid={colores.principalClaro}
                                    style={[formStyles.input,
                                    (Platform.OS === 'ios') && formStyles.inputIos,
                                    { flex: 1 }
                                    ]}
                                    onChangeText={(value) => onChange(value, "identificacion")}
                                    autoCapitalize='none'
                                    autoCorrect={false}
                                    value={identificacion}
                                    maxLength={13}
                                    onBlur={buscarPorIdentificacion}
                                />
                            </View>
                            <View style={styles.fila}>
                                <Icon size={25} color={colores.principalClaro} name="text-outline"
                                    style={styles.icono} />
                                <TextInput
                                    placeholder='Nombres y Apellidos'
                                    placeholderTextColor={colores.principalClaro}
                                    underlineColorAndroid={colores.principalClaro}
                                    style={[formStyles.input,
                                    (Platform.OS === 'ios') && formStyles.inputIos,
                                    { flex: 1 }
                                    ]}
                                    onChangeText={(value) => onChange(value, "nombreCompletoCliente")}
                                    autoCapitalize='words'
                                    autoCorrect={true}
                                    value={nombreCompletoCliente}
                                />
                            </View>
                            <View style={styles.fila}>
                                <Icon size={25} color={colores.principalClaro} name="home-outline"
                                    style={styles.icono} />
                                <TextInput
                                    placeholder='Direccion'
                                    placeholderTextColor={colores.principalClaro}
                                    underlineColorAndroid={colores.principalClaro}
                                    style={[formStyles.input,
                                    (Platform.OS === 'ios') && formStyles.inputIos,
                                    { flex: 1 }
                                    ]}
                                    onChangeText={(value) => onChange(value, "direccion")}
                                    autoCapitalize='words'
                                    autoCorrect={false}
                                    value={direccion}
                                />
                            </View>
                            <View style={styles.fila}>
                                <Icon size={25} color={colores.principalClaro} name="car-sport-outline"
                                    style={styles.icono} />
                                <TextInput
                                    placeholder='Placa'
                                    placeholderTextColor={colores.principalClaro}
                                    underlineColorAndroid={colores.principalClaro}
                                    style={[formStyles.input,
                                    (Platform.OS === 'ios') && formStyles.inputIos,
                                    { flex: 1 }
                                    ]}
                                    onChangeText={(value) => onChange(value, "placa")}
                                    autoCapitalize='words'
                                    autoCorrect={false}
                                    value={placa}
                                />
                            </View>
                            <View style={styles.fila}>
                                <Icon size={25} color={colores.principalClaro} name="mail-outline"
                                    style={styles.icono} />
                                <TextInput
                                    placeholder='Email'
                                    placeholderTextColor={colores.principalClaro}
                                    underlineColorAndroid={colores.principalClaro}
                                    style={[formStyles.input,
                                    (Platform.OS === 'ios') && formStyles.inputIos,
                                    { flex: 1 }
                                    ]}
                                    onChangeText={(value) => onChange(value, "email")}
                                    autoCapitalize='none'
                                    keyboardType='email-address'
                                    autoCorrect={false}
                                    value={email}
                                />
                            </View>
                            <View style={{
                                alignItems: 'center',
                                marginVertical: 5
                            }}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={formStyles.boton}
                                    onPress={validarYAgregarClienteFactura}
                                >
                                    <Text style={formStyles.textoBoton}>Agregar Cliente</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colores.principalOscuro
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        width: '90%',
        borderRadius: 20,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    tituloModal: {
        textAlign: 'center',
        marginBottom: 5,
        fontSize: 20,
        fontWeight: 'bold',
        color: colores.principal
    },
    fila: {
        flexDirection: 'row',
    },
    icono: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        marginBottom: 10

    },
    botonAgregarCliente: {
        width: 80,
        height: 40,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    }
});