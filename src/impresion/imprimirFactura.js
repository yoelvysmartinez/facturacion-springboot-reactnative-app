import {
    BluetoothManager,
    BluetoothEscposPrinter,
    BluetoothTscPrinter,
} from "tp-react-native-bluetooth-printer";
import { convertirFechaStr } from "../utils/calculos";

export const imprimirFactura = async (factura) => {
    const ubicarValores = (cant, precio, subtotal) => {
        let cadena = cant.toString()
        while (cadena.length < 11) {
            cadena = cadena + " ";
        }
        cadena = cadena + precio.toString()
        while (cadena.length < 24) {
            cadena = cadena + " ";
        }
        cadena = cadena + subtotal.toString()
        return cadena;
    }
    const habilitadoBluetooth = await BluetoothManager.isBluetoothEnabled();

    if (!habilitadoBluetooth) {
        return "No se encuentra habilitado el Bluetooth";
    }

    const dispositivosConectados = await BluetoothManager.enableBluetooth();

    if (!dispositivosConectados || dispositivosConectados.length === 0) {
        return "No existen dispositivos conectados, agregue la impresora al telefono"
    }

    for (var i = 0; i < dispositivosConectados.length; i++) {
        try {
            let dispositivo = JSON.parse(dispositivosConectados[i]);
            if (dispositivo.name === "BlueTooth Printer") {
                try {
                    await BluetoothManager.connect(dispositivo.address);
                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                    await BluetoothEscposPrinter.setBlob(0);
                    await BluetoothEscposPrinter.printText("ESTACION SAN ROQUE\n\r", {
                        codepage: 0,
                        widthtimes: 1,
                        heigthtimes: 1,
                        fonttype: 1,
                    });
                    await BluetoothEscposPrinter.printText("DIANA ALVEAR BARZALLO\n\r", {
                        codepage: 0,
                        widthtimes: 1,
                        heigthtimes: 1,
                        fonttype: 1,
                    });
                    await BluetoothEscposPrinter.printText("RUC: 0200236479001\n\r", {});
                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
                    await BluetoothEscposPrinter.printText(`Factura Nro: ${factura.establecimiento}-${factura.ptoEmision}-${factura.secuencial}\n\r`, {});
                    await BluetoothEscposPrinter.printText(`Fecha Emision: ${convertirFechaStr(new Date(factura.fechaEmision))}\n\r`, {});
                    await BluetoothEscposPrinter.printText(`SR.: ${factura.nombreCompletoCliente} \n\r`, {});
                    await BluetoothEscposPrinter.printText(`RUC/C.C: ${factura.identificacion}\n\r`, {});
                    await BluetoothEscposPrinter.printText(`PLACA NRO: ${factura.placa ? factura.placa : ''}\n\r`, {});

                    await BluetoothEscposPrinter.printText(
                        "--------------------------------\n\r",
                        {}
                    );
                    await BluetoothEscposPrinter.printText("CANT       P.UNIT       SIN IVA\n\r", {});
                    try {
                        const detalles = factura.detalles;
                        if (detalles && detalles.length > 0) {
                            for (let i = 0; i < detalles.length; i++) {
                                const detalle = detalles[i];
                                await BluetoothEscposPrinter.printText(`${ubicarValores(detalle.cantidad, detalle.precioUnitario, detalle.subtotal)}\n\r`, {});
                                await BluetoothEscposPrinter.printText(`${detalle.nombreProducto}\n\r`, {});
                            }
                        }
                    } catch (error) {
                        console.log(error)
                    }

                    await BluetoothEscposPrinter.printText("\n\r", {});
                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.CENTER);
                    await BluetoothEscposPrinter.printText(`TOTAL: ${factura.total}\n\r\n\r`, {
                        codepage: 0,
                        widthtimes: 1,
                        heigthtimes: 1,
                        fonttype: 1,
                    });

                    await BluetoothEscposPrinter.printText("Documento sin valor tributario\n\r", {});
                    await BluetoothEscposPrinter.printText("Descargue su factura en:\n\r", {});
                    await BluetoothEscposPrinter.printText("http://esrocoil.com\n\r", {});
                    await BluetoothEscposPrinter.printText("Usuario y clave es su numero de C.C / R.U.C.\n\r\n\r\n\r", {});
                    await BluetoothEscposPrinter.printerAlign(BluetoothEscposPrinter.ALIGN.LEFT);
                    return "Impresion Exitosa"
                } catch (error) {
                    return "Sin conexion a la impresora: " + dispositivo.name;
                }


            }
        } catch (error) {
            return "Error parseando nombre dispositivo"
        }
    }

    return "No existe impresora BlueTooth conectada con nombre BlueTooth Printer"

}

