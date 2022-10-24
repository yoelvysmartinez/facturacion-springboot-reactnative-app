import React, { Dispatch, SetStateAction, useState } from 'react'
import { Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Detalle } from '../interfaces/interfacesApp';
import { colores } from '../theme/appTheme';
import Icon from 'react-native-vector-icons/Ionicons';

interface Props {
    visible: boolean,
    detallesFactura: Detalle[],
    setDetalleFacturaModalAbierto: Dispatch<SetStateAction<boolean>>
}


export const DetalleFacturaModal = ({ visible, detallesFactura, setDetalleFacturaModalAbierto }: Props) => {
    const cerrarModal = () => {
        setModalVisible(false)
        setDetalleFacturaModalAbierto(false)
    }

    const [modalVisible, setModalVisible] = useState(visible);
    return (
        <View style={styles.centeredView}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                    setDetalleFacturaModalAbierto(false)
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View>
                            <Text style={styles.tituloModal}>Detalles Factura</Text>
                        </View>
                        <View style={styles.contenedorTitulos}>
                            <Text style={styles.titulos}>Cantidad</Text>
                            <Text style={styles.titulos}>Precio</Text>
                            <Text style={styles.titulos}>Descuento</Text>
                            <Text style={styles.titulos}>SubTotal</Text>
                        </View>

                        {detallesFactura.map(d => {
                            return (
                                <View key={d.id} style={{
                                    marginBottom: 8
                                }}>
                                    <View>
                                        <Text style={{ fontWeight: 'bold', color: colores.principal, fontSize: 13}}>{d.nombreProducto}</Text>
                                    </View>
                                    <View style={styles.contenedorValores}>
                                        <Text style={styles.valores}>{d.cantidad}</Text>
                                        <Text style={styles.valores}>{d.precioUnitario}</Text>
                                        <Text style={styles.valores}>{d.descuento}</Text>
                                        <Text style={styles.valores}>{d.subtotal}</Text>
                                    </View>
                                </View>
                            )
                        })}

                        <View style={{
                            alignItems: 'center',
                            marginVertical: 5
                        }}>
                            <TouchableOpacity
                                onPress={cerrarModal}
                                style={styles.botonCerrar}
                            >
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon size={40} color={colores.principal} name="close-circle-outline" style={{ marginRight: 3 }} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
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
    contenedorTitulos: {
        backgroundColor: colores.principalOscuro,
        flexDirection: "row",
        borderRadius: 100,
        paddingVertical: 5
    },
    contenedorValores: {
        flexDirection: "row",
    },
    titulos: {
        flex: 1,
        marginRight: 10,
        fontSize: 13,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center'
    },
    valores: {
        flex: 1,
        marginRight: 10,
        fontSize: 13,
        fontWeight: 'bold',
        color: colores.principalClaro,
        textAlign: 'center'
    },
    botonCerrar: {
        width: 80,
        height: 40,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    }
});

