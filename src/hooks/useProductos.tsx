import { useEffect, useState } from 'react';
import { Producto, Filtro } from '../interfaces/interfacesApp';
import gasolineraApi from '../api/gasolineraApi';



export const useProductos = () => {

    const [cargando, setCargando] = useState(true)

    const [productos, setProductos] = useState<Producto[]>([]);

    const cargarProductos = async (busqueda: string) => {
        try {
            busqueda = busqueda.trim()
            const filtro = {
                busqueda
            }
            if(busqueda.length == 0)
            {
                setProductos([])
                return;
            }
            const resp = await gasolineraApi.post<Producto[]>('/producto/buscar-productos', filtro)
            setProductos(resp.data)
        } catch (error) {

        }
        setCargando(false)
    }

    return {
        productos,
        cargando,
        cargarProductos
    }
}
