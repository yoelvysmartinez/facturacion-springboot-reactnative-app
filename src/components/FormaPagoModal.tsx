import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Modal, StyleSheet, TouchableOpacity, View, Text, TextInput, Platform, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colores } from '../theme/appTheme';
import { FormasPagoNuevaFactura } from '../interfaces/interfacesApp';
import { useForm } from '../hooks/useForm';
import { formStyles } from '../theme/formTheme';
import { notificacion } from '../utils/notificacion';
import { CargandoSpinner } from './CargandoSpinner';
import { useFormaPago } from '../hooks/useFormaPago';
import { Picker } from '@react-native-picker/picker';
import { inputFormularioFontSize } from '../theme/fuente';

interface Props {
    visible: boolean,
    valorPendienteAsignarFormaPago: number,
    setFormaPagoModalAbierto: Dispatch<SetStateAction<boolean>>
    agregarFormaPago: (formaPago: FormasPagoNuevaFactura) => void
}

export const FormaPagoModal = ({ visible, valorPendienteAsignarFormaPago, setFormaPagoModalAbierto, agregarFormaPago }: Props) => {

    const formaPagoNuevaFacturaInicial: FormasPagoNuevaFactura = {
        codigo: "",
        descripcion: "",
        uid: new Date().getTime(),
        valor: valorPendienteAsignarFormaPago
    }
    const [modalVisible, setModalVisible] = useState(visible);

    const { form, setFormData, onChange } = useForm<FormasPagoNuevaFactura>(formaPagoNuevaFacturaInicial)

    const { cargando, catalogoFormasPago } = useFormaPago()

    useEffect(() => {
        if (catalogoFormasPago.length > 0) {
            const formaPagoDefecto = catalogoFormasPago[0]
            setFormData({
                ...form,
                codigo: formaPagoDefecto.codigo,
                descripcion: formaPagoDefecto.descripcion
            })
        }
    }, [catalogoFormasPago.length])


    const { codigo, descripcion, valor } = form

    const cerrarModal = () => {
        setModalVisible(false)
        setFormaPagoModalAbierto(false)
    }

    const seleccionarFormaPago = (codigo: string) => {
        const formaPagoSeleccionada = catalogoFormasPago.find(f => f.codigo === codigo)
        if(formaPagoSeleccionada){
            setFormData({
                ...form,
                codigo: formaPagoSeleccionada.codigo,
                descripcion: formaPagoSeleccionada.descripcion
            })
        }
    }

    const validarYAgregarFormaPago = () => {
        console.log(form)
        if (form.codigo.trim().length === 0) return notificacion("La forma de pago es obligatoria")
        if (valorPendienteAsignarFormaPago <= 0) return notificacion("No existe saldo por asignar forma de pago")
        if (form.valor <= 0) return notificacion("El valor debe ser mayor a 0")

        
        agregarFormaPago(form)
        setFormaPagoModalAbierto(false)
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
                        setFormaPagoModalAbierto(false)
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
                                <Text style={styles.tituloModal}>Agregar Forma Pago</Text>
                                <Picker
                                    selectedValue={codigo}
                                    onValueChange={seleccionarFormaPago} >
                                    {
                                        catalogoFormasPago.map(f => <Picker.Item
                                            style={{ fontSize: inputFormularioFontSize, color: colores.principal }}
                                            label={f.descripcion}
                                            value={f.codigo}
                                            key={f.codigo} />)
                                    }

                                </Picker>
                                <Text style={{
                                    ...formStyles.label,
                                    marginTop: 10
                                }}>Valor:</Text>
                                <TextInput
                                    placeholderTextColor={colores.principalClaro}
                                    underlineColorAndroid={colores.principalClaro}
                                    style={[formStyles.input,
                                    (Platform.OS === 'ios') && formStyles.inputIos
                                    ]}
                                    keyboardType="numeric"
                                    onChangeText={(value) => onChange(value, "valor")}
                                    value={valor.toString()}
                                />
                            </View>


                            <View style={{
                                alignItems: 'center',
                                marginVertical: 5
                            }}>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={formStyles.boton}
                                    onPress={validarYAgregarFormaPago}
                                >
                                    <Text style={formStyles.textoBoton}>Agregar Forma Pago</Text>
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