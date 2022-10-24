
import React, { useContext, useEffect, useState } from 'react'
import { StackScreenProps } from '@react-navigation/stack'
import { Text, View, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { CargandoSpinner } from '../../components/CargandoSpinner';
import { NuevaFactura, TotalesNuevaFactura, ClienteNuevaFactura, DetalleNuevaFactura, FormasPagoNuevaFactura } from '../../interfaces/interfacesApp';
import DatePicker from 'react-native-date-picker'
import { useForm } from '../../hooks/useForm';
import { colores } from '../../theme/appTheme';
import { Tarjeta } from '../../components/Tarjeta';
import { ClienteFacturaModal } from '../../components/ClienteFacturaModal';
import { AuthContext } from '../../context/AuthContext';
import { ProductoFacturaModal } from '../../components/ProductoFacturaModal';
import { calcularSubtotalDetalle, redondear, convertirFechaStr } from '../../utils/calculos';
import { FormaPagoModal } from '../../components/FormaPagoModal';
import { formStyles } from '../../theme/formTheme';
import { ScrollView } from 'react-native-gesture-handler';
import { notificacion } from '../../utils/notificacion';
import gasolineraApi from '../../api/gasolineraApi';
import procesarError from '../../api/procesarError';
import { HeaderBotonMenu } from '../../components/HeaderBotonMenu';


interface Props extends StackScreenProps<any, any> { }

export const NuevaFacturaScreen = ({ navigation }: Props) => {
    const { usuarioLogueado } = useContext(AuthContext)


    const facturaInicial: NuevaFactura = {
        fechaEmision: new Date(),
        nombreCompletoCliente: "",
        identificacion: "",
        direccion: "",
        email: "",
        placa: "",
        detalles: [],
        formasPago: []
    }

    const totalesInicial: TotalesNuevaFactura = {
        totalSinImpuestos: 0.00,
        subtotal12: 0.00,
        subtotal0: 0.00,
        totalIva: 0.00,
        totalDescuento: 0.00,
        total: 0.00
    }
    const [totales, setTotales] = useState<TotalesNuevaFactura>(totalesInicial)
    const { form, onChange, setFormData } = useForm<NuevaFactura>(facturaInicial)
    const [clienteModalAbierto, setClienteModalAbierto] = useState(false)
    const [productoModalAbierto, setProductoModalAbierto] = useState(false)
    const [formaPagoModalAbierto, setFormaPagoModalAbierto] = useState(false)


    const { fechaEmision, nombreCompletoCliente, identificacion, direccion, email, placa, detalles, formasPago } = form
    const { totalSinImpuestos, subtotal12, subtotal0, totalIva, totalDescuento, total } = totales

    const [fechaEmisionCalendario, setFechaEmisionCalendario] = useState(form.fechaEmision)
    const [calendarioAbierto, setCalendarioAbierto] = useState(false)

    useEffect(() => {
        if (usuarioLogueado?.ptoEmisionId === null) {
            Alert.alert("PTO EMISION NO ASIGNADO", `El usuario ${usuarioLogueado.nombreUsuario.toUpperCase()} no pude crear factura sin un Pto Emision asignado`)
        }

    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <HeaderBotonMenu onPress={() => navigation.navigate("FacturasScreen")} iconName="arrow-back-outline" />
            )
        }
        )
    }, [])

    useEffect(() => {
        calcularTotales()
    }, [detalles.length])

    const [guardando, setGuardando] = useState(false);

    const seleccionarFechaEmision = (fechaSeleccionada: Date) => {
        setFechaEmisionCalendario(fechaSeleccionada)
        setFormData({
            ...form,
            fechaEmision: fechaSeleccionada
        })
    }

    const buscarCliente = () => {
        setClienteModalAbierto(true)
    }

    const nuevoDetalle = () => {
        setProductoModalAbierto(true)
    }

    const nuevaFormaPago = () => {
        setFormaPagoModalAbierto(true)
    }
    const agregarCliente = (cliente: ClienteNuevaFactura) => {
        setFormData({
            ...form,
            ...cliente,
        })
    }

    const agregarDetalle = (producto: DetalleNuevaFactura) => {
        setFormData({
            ...form,
            detalles: [...form.detalles, producto]
        })
    }

    const eliminarDetalle = (uid: number) => {

        setFormData({
            ...form,
            detalles: detalles.filter(d => d.uid !== uid)
        })
    }

    const agregarFormaPago = (formaPago: FormasPagoNuevaFactura) => {
        setFormData({
            ...form,
            formasPago: [...form.formasPago, formaPago]
        })
    }

    const eliminarFormaPago = (uid: number) => {

        setFormData({
            ...form,
            formasPago: formasPago.filter(d => d.uid !== uid)
        })
    }

    const calcularTotales = () => {
        let totalSinImpuestos = 0.00;
        let subtotal12 = 0.00;
        let subtotal0 = 0.00;
        let totalIva = 0.00;
        let totalDescuento = 0.00;
        let total = 0.00;
        let porcentajeIva = 0.00;

        detalles.map(d => {
            const subTotalDetalle = calcularSubtotalDetalle(d);
            totalSinImpuestos += subTotalDetalle;
            totalDescuento += Number(d.descuento);
            if (d.porcentajeIva > 0) {
                porcentajeIva = d.porcentajeIva;
                subtotal12 += subTotalDetalle;
            } else {
                subtotal0 += subTotalDetalle;
            }
        })

        totalIva = subtotal12 * porcentajeIva / 100;
        total = totalSinImpuestos + totalIva;

        totalSinImpuestos = redondear(totalSinImpuestos)
        subtotal12 = redondear(subtotal12)
        subtotal0 = redondear(subtotal0)

        totalDescuento = redondear(totalDescuento)
        total = redondear(total)
        totalIva = redondear(total - subtotal12)

        setTotales({
            ...totales,
            totalSinImpuestos,
            subtotal12,
            subtotal0,
            totalIva,
            totalDescuento,
            total
        })

        setFormData({
            ...form,
            ...totales
        })
    }


    const calcularValorPendienteAsignarFormaPago = (): number => {

        const valorAsignadoFormaPago = calcularValorAsignadoFormaPago();

        const valorPendienteAsignarFormaPago = total - valorAsignadoFormaPago;

        if (valorPendienteAsignarFormaPago < 0)
            return 0.00;

        return redondear(valorPendienteAsignarFormaPago);
    }

    const calcularValorAsignadoFormaPago = (): number => {
        let valorAsignadoFormaPago = 0.00;
        formasPago.map(f => {
            valorAsignadoFormaPago += Number(f.valor);
        })

        return redondear(valorAsignadoFormaPago)
    }

    const guardarFactura = async () => {
        if (usuarioLogueado?.ptoEmisionId === null) {
            notificacion(`El usuario ${usuarioLogueado.nombreUsuario.toUpperCase()} no pude crear factura sin un Pto Emision asignado`)
            return;
        }

        if (!nombreCompletoCliente || nombreCompletoCliente.length === 0) {
            notificacion("La factura debe tener asignado un cliente")
            return;
        }

        if (detalles.length === 0) {
            notificacion("La factura debe tener al menos un producto")
            return;
        }

        if (total < 0) {
            notificacion("El valor de la factura tiene que ser mayor a 0")
            return;
        }

        const valorAsignadoFormaPago = calcularValorAsignadoFormaPago()

        if (valorAsignadoFormaPago > total) {
            notificacion("El valor asignado en forma de pagos es mayor al total de la factura")
            return;
        }

        const valorPendienteAsignarFormaPago = calcularValorPendienteAsignarFormaPago()

        if (valorPendienteAsignarFormaPago !== 0) {
            notificacion(`Debe asignar una forma de pago al valor pendiente ${valorPendienteAsignarFormaPago}`)
            return;
        }

        setGuardando(true)
        try {
            await gasolineraApi.post("/factura", form)
            notificacion("Factura Guardada")
            setGuardando(false)
            setFormData(facturaInicial)
            navigation.navigate("FacturasScreen")
        } catch (error) {
            const mensajeError = procesarError(error);
            notificacion(mensajeError)
        }
        setGuardando(false)

    }

    return (
        <>
            {(guardando) && <CargandoSpinner />}
            {clienteModalAbierto && <ClienteFacturaModal visible={clienteModalAbierto} setClienteModalAbierto={setClienteModalAbierto} agregarCliente={agregarCliente} />}
            {productoModalAbierto && <ProductoFacturaModal visible={productoModalAbierto} setProductoModalAbierto={setProductoModalAbierto} agregarDetalle={agregarDetalle} />}
            {formaPagoModalAbierto && <FormaPagoModal visible={formaPagoModalAbierto} setFormaPagoModalAbierto={setFormaPagoModalAbierto} agregarFormaPago={agregarFormaPago} valorPendienteAsignarFormaPago={calcularValorPendienteAsignarFormaPago()} />}
            <View>
                <Tarjeta>
                    <ScrollView>
                        <View style={{ alignItems: 'center' }}>
                            <TouchableOpacity
                                onPress={buscarCliente}
                            >
                                <Icon size={30} color={colores.principal} name="person-add-outline" style={{ marginRight: 3 }} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.fechaEmisionContenedor}>
                            <Text style={styles.fechaEmisionTexto}>{convertirFechaStr(fechaEmisionCalendario)}</Text>
                            <TouchableOpacity
                                onPress={() => setCalendarioAbierto(true)}
                            >
                                <Icon size={25} color={colores.principal} name="calendar-outline" />
                            </TouchableOpacity>
                        </View>
                        <DatePicker
                            modal
                            maximumDate={new Date()}
                            mode='date'
                            title='Seleccionar Fecha Emision'
                            confirmText='Seleccionar'
                            cancelText='Cancelar'
                            open={calendarioAbierto}
                            date={fechaEmisionCalendario}
                            locale={'es'}
                            onConfirm={(date) => {
                                setCalendarioAbierto(false)
                                seleccionarFechaEmision(date)
                            }}
                            onCancel={() => {
                                setCalendarioAbierto(false)
                            }}
                        />
                        <View style={styles.contenedor}>
                            <View style={styles.datosFactura}>
                                <View>
                                    <Text style={styles.cliente}>{nombreCompletoCliente}</Text>
                                </View>
                                <View style={styles.fila}>
                                    <Icon size={18} color={colores.principalClaro} name="person-circle-outline" style={{ marginRight: 3 }} />
                                    <Text style={styles.cliente}>{identificacion}</Text>
                                </View>
                                <View style={styles.fila}>
                                    <Icon size={18} color={colores.principalClaro} name="car-sport-outline" style={{ marginRight: 3 }} />
                                    <Text style={styles.cliente}>{placa ? placa : ''}</Text>
                                </View>
                                <View style={styles.fila}>
                                    <Icon size={18} color={colores.principalClaro} name="home-outline" style={{ marginRight: 3 }} />
                                    <Text style={styles.cliente}>{direccion}</Text>
                                </View>
                                <View style={styles.fila}>
                                    <Icon size={18} color={colores.principalClaro} name="mail-outline" style={{ marginRight: 3 }} />
                                    <Text style={styles.cliente}>{email}</Text>
                                </View>
                            </View>
                            <View style={styles.totales}>
                                <View style={styles.fila}>
                                    <Text style={styles.titulosTotales}>Descuento</Text>
                                    <Text style={styles.valores}>{totalDescuento.toFixed(2)}</Text>
                                </View>
                                <View style={styles.fila}>
                                    <Text style={styles.titulosTotales}>SubTotal 12%</Text>
                                    <Text style={styles.valores}>{subtotal12.toFixed(2)}</Text>
                                </View>
                                <View style={styles.fila}>
                                    <Text style={styles.titulosTotales}>SubTotal 0%</Text>
                                    <Text style={styles.valores}>{subtotal0.toFixed(2)}</Text>
                                </View>
                                <View style={styles.fila}>
                                    <Text style={styles.titulosTotales}>SubTotal</Text>
                                    <Text style={styles.valores}>{totalSinImpuestos.toFixed(2)}</Text>
                                </View>
                                <View style={styles.fila}>
                                    <Text style={styles.titulosTotales}>Iva</Text>
                                    <Text style={styles.valores}>{totalIva.toFixed(2)}</Text>
                                </View>
                                <View style={styles.fila}>
                                    <Text style={{
                                        ...styles.titulosTotales,
                                        fontSize: 18,
                                        color: colores.principal
                                    }}>Total</Text>
                                    <Text style={{
                                        ...styles.valores,
                                        fontSize: 18,
                                        color: colores.principal
                                    }} >{total.toFixed(2)}</Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={nuevoDetalle}
                                >
                                    <Icon size={30} color={colores.principal} name="cart-outline" style={{ marginRight: 3 }} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.contenedorTitulosDetalles}>
                                <Text style={styles.titulosDetalles}>Cantidad</Text>
                                <Text style={styles.titulosDetalles}>Precio</Text>
                                <Text style={styles.titulosDetalles}>Descuento</Text>
                                <Text style={styles.titulosDetalles}>SubTotal</Text>
                                <View style={{ width: 20 }}></View>
                            </View>
                            {detalles.map(d => {
                                return (
                                    <View key={d.uid} style={{
                                        marginBottom: 8
                                    }}>
                                        <View>
                                            <Text style={{ fontWeight: 'bold', color: colores.principal, fontSize: 13 }}>{d.nombreProducto}</Text>
                                        </View>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={styles.valores}>{d.cantidad}</Text>
                                            <Text style={styles.valores}>{d.precioUnitario}</Text>
                                            <Text style={styles.valores}>{d.descuento}</Text>
                                            <Text style={styles.valores}>{calcularSubtotalDetalle(d).toFixed(2)}</Text>
                                            <TouchableOpacity
                                                onPress={() => eliminarDetalle(d.uid)}
                                            >
                                                <Icon name='trash' size={20} color='red' />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={nuevaFormaPago}
                                >
                                    <Icon size={30} color={colores.principal} name="cash-outline" style={{ marginRight: 3 }} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.contenedorTitulosDetalles}>
                                <Text style={styles.titulosDetalles}>Forma Pago</Text>
                                <Text style={styles.titulosDetalles}>Valor</Text>
                                <View style={{ width: 20 }}></View>
                            </View>
                            {formasPago.map(f => {
                                return (
                                    <View key={f.uid} style={{
                                        marginBottom: 8
                                    }}>
                                        <View style={{ flexDirection: "row" }}>
                                            <Text style={styles.valores}>{f.descripcion}</Text>
                                            <Text style={styles.valores}>{f.valor}</Text>
                                            <TouchableOpacity
                                                onPress={() => eliminarFormaPago(f.uid)}
                                            >
                                                <Icon name='trash' size={20} color='red' />
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                )
                            })}
                        </View>
                        <View
                            style={{ ...formStyles.contenedorBoton }}
                        >
                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={{ ...formStyles.boton, marginTop: 0 }}
                                onPress={guardarFactura}
                            >
                                <Text style={formStyles.textoBoton}>GUARDAR</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </Tarjeta>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    numeroFactura: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
        color: colores.principal
    },
    cliente: {
        fontSize: 13,
        color: colores.principal
    },
    contenedor: {
        marginVertical: 5,
        flexDirection: 'row'
    },
    datosFactura: {
        flex: 5,
    },
    totales: {
        flex: 5,
    },
    fila: {
        flexDirection: 'row',
        marginTop: 5
    },
    titulosTotales: {
        fontWeight: 'bold',
        fontSize: 13,
        textAlign: 'right',
        color: colores.principalOscuro,
        flex: 1
    },
    valores: {
        fontSize: 13,
        textAlign: 'center',
        flex: 1,
        fontWeight: 'bold',
        color: colores.principalClaro
    },
    contenedorTitulosDetalles: {
        backgroundColor: colores.principalOscuro,
        flexDirection: "row",
        borderRadius: 100,
        paddingVertical: 3,
        marginBottom: 5
    },
    contenedorValoresDetalles: {
        flexDirection: "row",
    },
    tituloSeccionDetalle: {
        textAlign: 'center',
        marginBottom: 5,
        fontSize: 15,
        fontWeight: 'bold',
        color: colores.principal
    },
    titulosDetalles: {
        flex: 1,
        marginRight: 10,
        fontSize: 12,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    valoresDetalles: {
        flex: 1,
        marginRight: 10,
        fontSize: 12,
        fontWeight: 'bold',
        color: colores.principalClaro,
        textAlign: 'center'
    },
    fechaEmisionContenedor: {
        flexDirection: 'row'
    },
    fechaEmisionTexto: {
        fontSize: 18,
        color: colores.principal,
        fontWeight: 'bold',
        marginRight: 10
    }

})
