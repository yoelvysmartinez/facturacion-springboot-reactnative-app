import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UsuarioLogueado, DatosInicioSesion } from "../interfaces/interfacesApp";
import { authReducer, AuthState } from "./authReducer";
import gasolineraApi from '../api/gasolineraApi';
import procesarError from '../api/procesarError';


type AuthContextProps = {
    usuarioLogueado: UsuarioLogueado | null;
    mensajeError: string;
    estado: 'verificando' | 'logueado' | 'no-logueado';
    iniciarSesion: (dotos: DatosInicioSesion) => void;
    cerrarSesion: () => void;
    borrarError: () => void;
}

const authInicialState: AuthState = {
    estado: 'verificando',
    usuarioLogueado: null,
    mensajeError: ''

}


export const AuthContext = createContext({} as AuthContextProps);


export const AuthProvider = ({ children }: any) => {
    const [state, dispatch] = useReducer(authReducer, authInicialState);

    useEffect(() => {
        validarToken()
    }, [])

    const validarToken = async () => {
        const token = await AsyncStorage.getItem('token');
        if (!token) return dispatch({ type: 'errorInicioSesion' })

        try {
            const resp = await gasolineraApi.get<UsuarioLogueado>("/usuario/datos-usuario-logueado")
            dispatch({
                type: 'iniciarSesion',
                playload: resp.data
            })
        } catch (error) {
            dispatch({ type: 'errorInicioSesion' })
        }

    }
    const iniciarSesion = async (datos: DatosInicioSesion) => {
        try {
            const resp = await gasolineraApi.post<UsuarioLogueado>("/autenticacion/login", datos)
            dispatch({
                type: 'iniciarSesion',
                playload: resp.data
            })
            await AsyncStorage.setItem('token', resp.data.token);
        } catch (error) {
            const mensajeError = procesarError(error);
            dispatch({
                type: 'agregarError',
                playload: mensajeError
            })
        }


    };
    const cerrarSesion = () => {
        dispatch({
            type: 'cerrarSesion'
        })
         AsyncStorage.removeItem('token');
     };

    const borrarError = () => {
        dispatch({ type: 'borrarError' })
    };

    return (
        <AuthContext.Provider value={{
            ...state,
            iniciarSesion,
            cerrarSesion,
            borrarError
        }}>
            {children}
        </AuthContext.Provider>
    )

}