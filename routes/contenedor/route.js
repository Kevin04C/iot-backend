import { Router } from 'express'
import ContenedorController from '../../controllers/contenedor/controller.js'

const router = Router()


router.get("/", ContenedorController.obtenerContenedores);

export default router;