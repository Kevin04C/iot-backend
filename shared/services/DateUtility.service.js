import { format } from 'date-fns';

const obtenerFechaActual = () => {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
};

const obtenerFechaCorta = () => {
  const fechaActual = new Date();
  const fechaFormateada = format(fechaActual, 'yyyy-MM-dd'); // Solo la fecha
  return fechaFormateada;
}

export default { 
  obtenerFechaActual,
  obtenerFechaCorta
};
