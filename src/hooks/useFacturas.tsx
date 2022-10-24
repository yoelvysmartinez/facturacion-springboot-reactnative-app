import { useEffect, useState } from 'react';
import { Factura } from '../interfaces/interfacesApp';
import gasolineraApi from '../api/gasolineraApi';



export const useFacturas = () => {

    const [cargando, setCargando] = useState(true)

    const [facturas, setFacturas] = useState<Factura[]>([]);

    const cargarFacturas = async (busqueda: string) => {
        try {
            busqueda = busqueda.trim()
            const filtro = {
                busqueda
            }
            const resp = await gasolineraApi.post<Factura[]>('/factura/buscar-facturas', filtro)
            setFacturas(resp.data)
        } catch (error) {

        }
        setCargando(false)
    }

    return {
        facturas,
        cargando,
        cargarFacturas
    }
}
