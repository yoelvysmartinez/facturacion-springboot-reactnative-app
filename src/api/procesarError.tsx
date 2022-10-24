import { AxiosResponse } from "axios";

const procesarError = (error: any): string => {
    console.log(error)
    if (error.response) {
        const response: AxiosResponse = error.response;
        if (response.data && response.data.mensaje)
            return response.data.mensaje;
        if (response.status === 403)
            return 'No tiene permiso para realizar la accion'
        if (response.status === 401)
            return 'Datos de acceso incorrectos, inicie sesion nuevamente'
        if (response.status === 400)
            return 'Solicitud Incorrecta. Error en la informacion enviada'
        if (response.status === 404)
            return 'URL no existe'
    }
    return 'Error de comunicacion';

}

export default procesarError