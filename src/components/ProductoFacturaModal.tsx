import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Modal, StyleSheet, TextInput, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colores } from '../theme/appTheme';
import { useForm } from '../hooks/useForm';
import { DetalleNuevaFactura, Producto } from '../interfaces/interfacesApp';
import { ProductoAutoCompletar } from './ProductoAutocompletar';
import { formStyles } from '../theme/formTheme';
import { notificacion } from '../utils/notificacion';
import { calcularSubtotalDetalle, redondear } from '../utils/calculos';
import { useProductos } from '../hooks/useProductos';
import gasolineraApi from '../api/gasolineraApi';

interface Props {
    visible: boolean,
    setProductoModalAbierto: Dispatch<SetStateAction<boolean>>
    agregarDetalle: (prducto: DetalleNuevaFactura) => void
}


export const ProductoFacturaModal = ({ visible, setProductoModalAbierto, agregarDetalle }: Props) => {


    const [modalVisible, setModalVisible] = useState(visible);



    const detalleInicial: DetalleNuevaFactura = {
        uid: new Date().getTime(),
        cantidad: 0.00,
        valorAVender: 0.00,
        codigoProducto: "",
        nombreProducto: "",
        porcentajeIva: 0.00,
        descuento: 0.00,
        precioUnitario: 0.00

    }
    const { form, onChange, setFormData } = useForm<DetalleNuevaFactura>(detalleInicial)

    const { cantidad, descuento, nombreProducto, porcentajeIva, precioUnitario, valorAVender } = form;

    useEffect(() => {
        let cantidadAVender = 0.00;
        try {
            if (precioUnitario > 0) {
                let valorAVenderSinIva = porcentajeIva > 0 ? valorAVender / 1.12 : valorAVender
                cantidadAVender = valorAVenderSinIva / precioUnitario
                cantidadAVender = redondear(cantidadAVender, 4)
            }
        } catch (error) {

        }

        setFormData({
            ...form,
            cantidad: cantidadAVender
        })

    }, [valorAVender])


    const seleccionarProducto = (producto: Producto) => {
        setFormData({
            ...form,
            ...producto
        })
    }


    const seleccionarProductoComun = async (nombrePorducto: string) => {
        const resp = await gasolineraApi.post<Producto[]>('/producto/buscar-productos', { busqueda: nombrePorducto })
        try {
            if (resp.data.length === 0) {
                notificacion(`No existe el producto con nomnbre ${nombrePorducto}`)
            }
            seleccionarProducto(resp.data[0])
        } catch (error) {

        }

    }

    const cerrarModal = () => {
        setModalVisible(false)
        setProductoModalAbierto(false)
    }

    const validarYAgregarProducto = () => {
        if (nombreProducto.trim().length === 0) return notificacion("Debe elegir un producto")
        if (cantidad === 0) return notificacion("La cantidad debe ser mayor a 0")

        const subtotalDetalle = calcularSubtotalDetalle(form);
        if (Number.isNaN(subtotalDetalle)) return notificacion("La cantidad, descuento debe ser un entero o decimal")

        if (subtotalDetalle < 0) return notificacion("El subtotal no puede ser menor a 0")


        form.descuento = Number(descuento)
        form.cantidad = Number(cantidad)
        setModalVisible(false)
        setProductoModalAbierto(false)

        agregarDetalle(form)
    }


    return (
        <>

            <View style={styles.centeredView}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                        setProductoModalAbierto(false)
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
                                <Text style={styles.tituloModal}>Agregar Producto</Text>
                                <ProductoAutoCompletar seleccionarProducto={seleccionarProducto} />
                                <View style={styles.productosComunes}>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.botonProductoComun}
                                        onPress={() => seleccionarProductoComun("SUPER")}
                                    >
                                        <Text style={styles.textoBotonPorductoComun}>S</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.botonProductoComun}
                                        onPress={() => seleccionarProductoComun("EXTRA")}
                                    >
                                        <Text style={styles.textoBotonPorductoComun}>E</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        activeOpacity={0.8}
                                        style={styles.botonProductoComun}
                                        onPress={() => seleccionarProductoComun("DIESEL PREMIUM")}
                                    >
                                        <Text style={styles.textoBotonPorductoComun}>D</Text>
                                    </TouchableOpacity>
                                </View>
                                <Text style={{
                                    ...formStyles.label,
                                    marginTop: 3,
                                    marginBottom: 0
                                }}>Valor Solicitado:</Text>
                                <TextInput
                                    placeholderTextColor={colores.principalClaro}
                                    underlineColorAndroid={colores.principalClaro}
                                    style={[formStyles.input,
                                    (Platform.OS === 'ios') && formStyles.inputIos
                                    ]}
                                    keyboardType="numeric"
                                    onChangeText={(value) => onChange(value, "valorAVender")}
                                    value={valorAVender === 0 ? '' : valorAVender.toString()}
                                />

                                <View style={styles.filaDatoProducto}>
                                    <View style={styles.contenedorTitulo}>
                                        <Text style={styles.tituloDatoProducto}>Producto</Text>
                                    </View>
                                    <View style={styles.contenedorValor}>
                                        <Text style={styles.valoroDatoProducto}>{nombreProducto}</Text>
                                    </View>
                                </View>
                                <View style={styles.filaDatoProducto}>
                                    <View style={styles.contenedorTitulo}>
                                        <Text style={styles.tituloDatoProducto}>Precio Unitario</Text>
                                    </View>
                                    <View style={styles.contenedorValor}>
                                        <Text style={styles.valoroDatoProducto}>{precioUnitario}</Text>
                                    </View>
                                </View>
                                <View style={styles.filaDatoProducto}>
                                    <View style={styles.contenedorTitulo}>
                                        <Text style={styles.tituloDatoProducto}>Iva</Text>
                                    </View>
                                    <View style={styles.contenedorValor}>
                                        <Text style={styles.valoroDatoProducto}>{porcentajeIva}%</Text>
                                    </View>
                                </View>

                                <Text style={{
                                    ...formStyles.label,
                                    marginTop: 10
                                }}>Cantidad:</Text>
                                <TextInput
                                    placeholderTextColor={colores.principalClaro}
                                    underlineColorAndroid={colores.principalClaro}
                                    style={[formStyles.input,
                                    (Platform.OS === 'ios') && formStyles.inputIos
                                    ]}
                                    keyboardType="numeric"
                                    onChangeText={(value) => onChange(value, "cantidad")}
                                    value={cantidad === 0 ? '' : cantidad.toString()}
                                />
                                <Text style={{
                                    ...formStyles.label,
                                    marginTop: 10
                                }}>Descuento:</Text>
                                <TextInput
                                    placeholderTextColor={colores.principalClaro}
                                    underlineColorAndroid={colores.principalClaro}
                                    style={[formStyles.input,
                                    (Platform.OS === 'ios') && formStyles.inputIos
                                    ]}
                                    keyboardType="numeric"
                                    onChangeText={(value) => onChange(value, "descuento")}
                                    value={descuento.toString()}
                                />
                            </View>
                            <View style={{
                                alignItems: 'center',
                                marginVertical: 5,
                                flex: 1,
                                justifyContent: 'center'
                            }}>
                                <Text
                                    style={styles.subtotal}
                                >SubTotal SIN IVA</Text>
                                <Text
                                    style={styles.subtotal}
                                >{calcularSubtotalDetalle(form).toFixed(2)}</Text>
                                <TouchableOpacity
                                    activeOpacity={0.8}
                                    style={formStyles.boton}
                                    onPress={validarYAgregarProducto}
                                >
                                    <Text style={formStyles.textoBoton}>Agregar Detalle</Text>
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
        height: '95%',
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
    productosComunes: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    botonProductoComun: {
        paddingHorizontal: 20,
        paddingVertical: 5,
        borderRadius: 100,
        backgroundColor: colores.principal
    },
    textoBotonPorductoComun: {
        fontSize: 30,
        color: 'white',
        fontWeight: 'bold'
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
    },
    filaDatoProducto: {
        flexDirection: 'row'
    },
    contenedorTitulo: {
        flex: 4
    },
    contenedorValor: {
        flex: 6
    },
    tituloDatoProducto: {
        fontSize: 13,
        fontWeight: 'bold',
        color: colores.principal
    },
    valoroDatoProducto: {
        fontSize: 13,
        color: colores.principalClaro
    },
    subtotal: {
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colores.principal
    }
});