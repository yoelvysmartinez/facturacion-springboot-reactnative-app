import { Dimensions, StyleSheet } from "react-native";
import { colores } from './appTheme';
import { menuFontSize } from './fuente';

export const menuLateralStyle = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: 'blue'
    },
    logo: {
        width: 150,
        height: 150,
        borderRadius: 100
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 10,
        flex: 20
    },
    menuContainer: {
        marginVertical: 30,
        marginHorizontal: 20,
        flex: 70
    },
    menuBoton: {
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    menuText: {
        fontSize: menuFontSize,
        color: colores.principal,
        fontWeight: 'bold'
    },
    cerrarSesionContainer:{
        flex: 15,
        backgroundColor: colores.principal,
        alignItems: 'center',
        justifyContent: 'center'
    },
    menuCerrarSesionBoton: {
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    menuCerrarSesion: {
        fontSize: menuFontSize,
        color: 'white',
        fontWeight: 'bold'
    },
    usuarioLogueado:{
        fontSize: 15,
        fontWeight: "bold",
        color: "white",
        marginTop: 10
    }
})