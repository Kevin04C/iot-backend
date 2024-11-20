import { request, response } from "express";
import { prisma } from "../../prismaClient.js";
import { ACTIVO, FOLDER_IMG_CONTENEDORES } from "../../shared/consts.js";
import CloudinaryService from "../../shared/services/Cloudinary.service.js";
import { unlink } from 'fs/promises'
import DateUtilityService from "../../shared/services/DateUtility.service.js";


const obtenerContenedores = async (req, res = response) => {
  try {
    const contenedores = await prisma.contenedor.findMany();
    return res.status(200).json({
      statusCode: 200,
      data: contenedores,
      message: null
    })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
}

const crearContenedor = async (req = request, res = response) => {
  const body = req.body;
  try {
    console.log(body);
    const identificador = body.contenedor_identificador;

    const contenedorExistente = await prisma.contenedor.findFirst({
      where: {
        contenedor_identificador: identificador
      }
    });

    if(contenedorExistente) {
      return res.status(400).json({
        statusCode: 400,
        message: `El contenedor con identificador ${identificador} ya existe`
      })
    }

    /** Los datos de la img cuando se insertan */
    let url = null;
    let public_id = null;

    /** Si viene una img la agrego */
    if(req.file.path) {
      const { url, public_id } = await CloudinaryService.uploadFile({
        file: req.file.path,
        folder: FOLDER_IMG_CONTENEDORES
      });
  
      url = url;
      public_id = public_id;

      unlink(req.file.path);
    }


    const dataContendor = {
      ...body,
        contenedor_activo: ACTIVO,
        // contenedor_imagen: url,
        // contenedor_imagenidentidicador: public_id,
        contenedor_fecha: DateUtilityService.obtenerFechaActual()
    }

    if(req.file.path) {
      dataContendor.contenedor_imagen = url;
      dataContendor.contenedor_imagenidentidicador = public_id;
    }

    const contenedorCreated = await prisma.contenedor.create({
      data: dataContendor
    })

    return res.status(201).json({
      statusCode: 201,
      data: contenedorCreated,
      message: 'Contenedor creado con exito'
    })
  } catch (err) {
    console.log(err);

    if(err instanceof Error) {
      return res.status(400).json({
        statusCode: 400,
        message: err.message
      })
    }
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
}


export default {
  obtenerContenedores,
  crearContenedor
}