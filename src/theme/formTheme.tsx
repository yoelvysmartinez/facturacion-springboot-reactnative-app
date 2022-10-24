import { StyleSheet } from "react-native";
import { colores } from './appTheme';
import { inputFormularioFontSize, labelFormularioFontSize, textoBotonFormularioFontSize, tituloFormularioFontSize } from "./fuente";

 export const formStyles = StyleSheet.create({
    contenedorFormulario:{
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
        height: 500,
        marginBottom: 100
    },
     titulo: {
         fontSize: tituloFormularioFontSize,
         color: colores.principal,
         fontWeight: 'bold',
         marginTop: 20
     },
     label: {
         marginTop: 25,
         fontSize: labelFormularioFontSize,
         color: colores.principal,
         fontWeight: "bold"
     },
     input: {
         fontSize: inputFormularioFontSize,
         color: colores.principalClaro
     },
     inputIos: {
         borderBottomColor: colores.principalClaro,
         borderBottomWidth: 2,
         paddingBottom: 4
     },
     contenedorBoton: {
         alignItems: "center",
         marginTop: 15
     },
     boton: {
         marginTop: 30,
         paddingHorizontal: 20,
         paddingVertical: 5, 
         borderRadius: 100,
         backgroundColor: colores.principal
     },
     textoBoton:{
         fontSize: textoBotonFormularioFontSize,
         color: 'white',
         fontWeight: 'bold'
     },
    
 })