import { useState } from 'react';
import { DatoUsuario } from '../interfaces/interfacesApp';
import gasolineraApi from '../api/gasolineraApi';



export const useUsuarios = () => {

    const [cargando, setCargando] = useState(true)

    const [usuarios, setUsuarios] = useState<DatoUsuario[]>([]);

    const cargarUsuarios = async (busqueda: string) => {
        try {
            busqueda = busqueda.trim()
            const filtro = {
                busqueda
            }
            const resp = await gasolineraApi.post<DatoUsuario[]>('/usuario/buscar-usuarios', filtro)
            setUsuarios(resp.data)
        } catch (error) {

        }
        setCargando(false)
    }
    
    return {
        usuarios,
        cargando,
        cargarUsuarios
    }
}
