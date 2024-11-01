import { Router } from 'express'
import ContenedorController from '../../controllers/contenedor/controller.js'
import uplaod from '../../config/multer.js';

const router = Router()

router.get("/", ContenedorController.obtenerContenedores);
router.post("/", uplaod.single('contenedor_imagen'), ContenedorController.crearContenedor);

export default router;