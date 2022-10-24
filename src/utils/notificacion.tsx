import Toast from "react-native-simple-toast";
export const notificacion = (
  mensaje: string,
  duration = Toast.LONG,
  gravity = Toast.BOTTOM
) => {
  Toast.showWithGravity(
    mensaje ,
    duration,
    gravity
  );
};