import { useEffect, useState } from 'react';
import { PtoEmision } from '../interfaces/interfacesApp';
import gasolineraApi from '../api/gasolineraApi';



export const usePtosEmision = () => {

    const [cargando, setCargando] = useState(true)

    const [ptosEmision, setPtosEmision] = useState<PtoEmision[]>([]);


    const cargarPtosEmision = async () => {
        try {
            const resp = await gasolineraApi.get<PtoEmision[]>('/pto-emision')
            setPtosEmision(resp.data)
        } catch (error) {

        }
        setCargando(false)
    }
    
    return {
        ptosEmision,
        cargando,
        cargarPtosEmision
    }
}
