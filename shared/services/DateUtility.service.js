import { format } from 'date-fns';

const obtenerFechaActual = () => {
  return format(new Date(), "yyyy-MM-dd'T'HH:mm:ss'Z'");
};

export default { obtenerFechaActual };
