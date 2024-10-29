import { format } from 'date-fns'

const obtenerFechaActual = () => {
  return format(new Date(), 'yyyy-MM-dd HH:mm:ss');
}


export default { obtenerFechaActual }