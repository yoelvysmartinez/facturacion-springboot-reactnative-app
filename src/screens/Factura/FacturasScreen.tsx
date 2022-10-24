import React, { useEffect, useState } from 'react'
import { Text, View, FlatList, ListRenderItemInfo, StyleSheet, TouchableOpacity } from 'react-native';
import { useFacturas } from '../../hooks/useFacturas';
import { CargandoSpinner } from '../../components/CargandoSpinner';
import { Factura, Detalle } from '../../interfaces/interfacesApp';
import { Tarjeta } from '../../components/Tarjeta';
import { colores } from '../../theme/appTheme';
import Icon from 'react-native-vector-icons/Ionicons';
import gasolineraApi from '../../api/gasolineraApi';
import { imprimirFactura } from '../../impresion/imprimirFactura';
import { notificacion } from '../../utils/notificacion';
import { DetalleFacturaModal } from '../../components/DetalleFacturaModal';
import procesarError from '../../api/procesarError';
import { StackScreenProps } from '@react-navigation/stack';
import { useIsFocused } from '@react-navigation/native';
import { convertirFechaStr } from '../../utils/calculos';
import { Busqueda } from '../../components/Busqueda';
import { HeaderBotonMenu } from '../../components/HeaderBotonMenu';

const detallesConsultados = new Map<number, Detalle[]>();
interface Props extends StackScreenProps<any, any> { }

export const FacturasScreen = ({ navigation }: Props) => {
    const { cargando, facturas, cargarFacturas } = useFacturas()
    const [imprimiendo, setImprimiendo] = useState(false)
    const [cargandoDetalle, setCargandoDetalle] = useState(false)
    const [detalleFacturaModalAbierto, setDetalleFacturaModalAbierto] = useState(false)
    const [detallesFactura, setDetallesFactura] = useState([] as Detalle[])
    const activa = useIsFocused()

    useEffect(() => {
        if (activa) {
            cargarFacturas("")
        }
    }, [activa])

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderBotonMenu onPress={() => navigation.navigate("NuevaFacturaScreen")} iconName="add-circle-outline"/>
            )
        }
        )
    }, [])


    const imprimir = async (id: number) => {
        setImprimiendo(true)
        try {
            const factura = await informacionFacturaPorId(id)
            if (factura !== null) {
                const respuesta: any = await imprimirFactura(factura)
                notificacion(respuesta)
            }
        } catch (error) {
            const mensajeError = procesarError(error)
            notificacion(mensajeError)
        }

        setImprimiendo(false)

    }

    const informacionFacturaPorId = async (id: number) => {
        const resp = await gasolineraApi.get<Factura>(`/factura/${id}`);

        return resp.data;
    }

    const detalleFactura = async (id: number) => {
        let detalles = detallesConsultados.get(id)
        if (detalles) {
            setDetallesFactura(detalles);
            setDetalleFacturaModalAbierto(true)
            return;
        }

        try {
            setCargandoDetalle(true)
            const factura = await informacionFacturaPorId(id)
            detalles = factura.detalles;
            detallesConsultados.set(id, detalles)
            setDetallesFactura(detalles)
            setCargandoDetalle(false)
            setDetalleFacturaModalAbierto(true)

        } catch (error) {
            const mensajeError = procesarError(error)
            setCargandoDetalle(false)
            notificacion(mensajeError)

        }
    }
    const datosFactura = ({ item }: ListRenderItemInfo<Factura>) => {
        return (
            <Tarjeta>
                <TouchableOpacity style={{
                    position: 'absolute',
                    right: 0,
                    top: -10,
                    height: 50,
                    width: 50,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 100,
                    zIndex: 1
                }}
                    onPress={() => imprimir(item.id)}
                >
                    <Icon size={35} color={colores.principal} name="print-outline" />
                </TouchableOpacity>
                <Text style={styles.numeroFactura}>{`${item.establecimiento}-${item.ptoEmision}-${item.secuencial}`}</Text>

                <View style={styles.contenedor}>
                    <View style={styles.datosFactura}>
                        <View>
                            <Text style={styles.cliente}>{item.nombreCompletoCliente}</Text>
                        </View>
                        <View style={styles.fila}>
                            <Icon size={18} color={colores.principalClaro} name="person-circle-outline" style={{ marginRight: 3 }} />
                            <Text style={styles.cliente}>{item.identificacion}</Text>
                        </View>
                        <View style={styles.fila}>
                            <Icon size={18} color={colores.principalClaro} name="car-sport-outline" style={{ marginRight: 3 }} />
                            <Text style={styles.cliente}>{item.placa ? item.placa : ''}</Text>
                        </View>
                        <View style={styles.fila}>
                            <Icon size={18} color={colores.principalClaro} name="home-outline" style={{ marginRight: 3 }} />
                            <Text style={styles.cliente}>{item.direccion}</Text>
                        </View>
                        <View style={styles.fila}>
                            <Icon size={18} color={colores.principalClaro} name="mail-outline" style={{ marginRight: 3 }} />
                            <Text style={styles.cliente}>{item.email}</Text>
                        </View>
                        <View style={styles.fila}>
                            <Icon size={18} color={colores.principalClaro} name="calendar-outline" style={{ marginRight: 3 }} />
                            <Text style={styles.cliente}>{convertirFechaStr(new Date(item.fechaEmision))}</Text>
                        </View>
                    </View>
                    <View style={styles.totales}>
                        <View style={styles.fila}>
                            <Text style={styles.titulosTotales}>Descuento</Text>
                            <Text style={styles.valores}>{item.totalDescuento}</Text>
                        </View>
                        <View style={styles.fila}>
                            <Text style={styles.titulosTotales}>SubTotal 12%</Text>
                            <Text style={styles.valores}>{item.subtotal12}</Text>
                        </View>
                        <View style={styles.fila}>
                            <Text style={styles.titulosTotales}>SubTotal 0%</Text>
                            <Text style={styles.valores}>{item.subtotal0}</Text>
                        </View>
                        <View style={styles.fila}>
                            <Text style={styles.titulosTotales}>SubTotal</Text>
                            <Text style={styles.valores}>{item.totalSinImpuestos}</Text>
                        </View>
                        <View style={styles.fila}>
                            <Text style={styles.titulosTotales}>Iva</Text>
                            <Text style={styles.valores}>{item.totalIva}</Text>
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
                            }} >{item.total}</Text>
                        </View>
                    </View>
                </View>
                <View style={{
                    alignItems: 'center'
                }}>
                    <TouchableOpacity
                        onPress={() => detalleFactura(item.id)}
                        style={styles.botonDetalles}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Icon size={30} color={colores.principal} name="list-outline" style={{ marginRight: 3 }} />
                        </View>
                    </TouchableOpacity>
                </View>
            </Tarjeta >
        )
    }
    return (
        <View>

            {(cargando || imprimiendo || cargandoDetalle) && <CargandoSpinner />}
            {(detalleFacturaModalAbierto && !imprimiendo) && <DetalleFacturaModal detallesFactura={detallesFactura} visible={detalleFacturaModalAbierto} setDetalleFacturaModalAbierto={setDetalleFacturaModalAbierto} />}

            <Busqueda filtrarPorBusqueda={cargarFacturas} placeholder="Buscar Factura"/>
            <FlatList
                data={facturas}
                renderItem={datosFactura}
                style={{ marginBottom: 60 }}
                keyExtractor={() => new Date().getTime().toString() + Math.random().toString()}
            />
        </View>
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
        marginVertical: 10,
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
        textAlign: 'right',
        flex: 1,
        fontWeight: 'bold',
        color: colores.principalClaro
    },
    botonDetalles: {
        width: 60,
        height: 30,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    }

})
