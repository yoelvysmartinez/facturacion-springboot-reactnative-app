import { UsuarioLogueado } from "../interfaces/interfacesApp";

export interface AuthState {
    usuarioLogueado: UsuarioLogueado | null;
    mensajeError: string;
    estado: 'verificando' | 'logueado' | 'no-logueado';
}

type AuthAction =
    | { type: 'iniciarSesion', playload:  UsuarioLogueado  }
    | { type: 'agregarError', playload: string }
    | { type: 'borrarError' }
    | { type: 'errorInicioSesion' }
    | { type: 'cerrarSesion' }
    | { type: 'cargando' }


export const authReducer = (state : AuthState, action: AuthAction) : AuthState => {
    switch (action.type) {
        case 'agregarError':
            return {
                ...state,
                usuarioLogueado: null,
                estado: "no-logueado",
                mensajeError: action.playload
            }
            
        case 'borrarError':
            return  {
                ...state,
                mensajeError: ''
            }
        case 'iniciarSesion':
            return {
                ...state,
                mensajeError: '',
                estado:  'logueado',
                usuarioLogueado: action.playload
            }
        case 'cerrarSesion':    
        case 'errorInicioSesion': 
            return {
                ...state,
                estado: "no-logueado",
                usuarioLogueado: null
            }
        default:
            return state;
    }
}