import { DetalleNuevaFactura } from '../interfaces/interfacesApp';

export const calcularSubtotalDetalle = (detalle: DetalleNuevaFactura): number => {
        return detalle.cantidad * detalle.precioUnitario - detalle.descuento;
}

export const redondear = (valor: number, decimales: number = 2) => {
        if (decimales == 2) {
                return Math.round(valor * 100) / 100
        }
        
        const fraccion = Math.pow(10, decimales);
        return Math.round(valor * fraccion) / fraccion;
}

export const convertirFechaStr = (fecha: Date) => {
        try {
                let dia = `${(fecha.getDate())}`.padStart(2, '0');
                let mes = `${(fecha.getMonth() + 1)}`.padStart(2, '0');
                let anio = fecha.getFullYear();
                return `${dia}/${mes}/${anio}`
        } catch (error) {
                return ""
        }

}