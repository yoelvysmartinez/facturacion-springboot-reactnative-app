import { StyleSheet } from "react-native";
import { colores } from './appTheme';

 export const loginStyles = StyleSheet.create({
    contenedorFormulario:{
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: 'center',
        height: 600,
        marginBottom: 100
    },
     titulo: {
         fontSize: 30,
         color: colores.principal,
         fontWeight: 'bold',
         marginTop: 20
     },
     label: {
         marginTop: 25,
         fontSize: 15,
         color: colores.principal,
         fontWeight: "bold"
     },
     input: {
         fontSize: 15,
         color: colores.principalClaro
     },
     inputIos: {
         borderBottomColor: colores.principalClaro,
         borderBottomWidth: 2,
         paddingBottom: 4
     },
     contenedorBoton: {
         alignItems: "center",
         marginTop: 50
     },
     boton: {
         borderWidth: 2,
         paddingHorizontal: 20,
         paddingVertical: 5, 
         borderRadius: 100,
         borderColor: colores.principal
     },
     textoBoton:{
         fontSize: 18,
         color: colores.principal
     }
 })
