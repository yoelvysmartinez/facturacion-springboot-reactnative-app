import { useEffect, useState } from 'react';
import { CatalogoFormaPago } from '../interfaces/interfacesApp';
import gasolineraApi from '../api/gasolineraApi';



export const useFormaPago = () => {

    const [cargando, setCargando] = useState(true)

    const [catalogoFormasPago, setCatalogoFormasPago] = useState<CatalogoFormaPago[]>([]);

    useEffect(() => {
        cargarProductos()
    }, [])

    const cargarProductos = async () => {
        try {
            const resp = await gasolineraApi.get<CatalogoFormaPago[]>('/forma-pago')
            setCatalogoFormasPago(resp.data)
        } catch (error) {
            setCatalogoFormasPago([])
        }
        setCargando(false)
    }

    return {
        catalogoFormasPago,
        cargando
    }
}
