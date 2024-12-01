import { request, response } from "express";
import { prisma } from "../../prismaClient.js";
import { ACTIVO, FOLDER_IMG_CONTENEDORES } from "../../shared/consts.js";
import CloudinaryService from "../../shared/services/Cloudinary.service.js";
import { unlink } from 'fs/promises'
import DateUtilityService from "../../shared/services/DateUtility.service.js";


const obtenerContenedores = async (req, res = response) => {
  try {
    const paginaActual = parseInt(req.query.paginaActual) || 1;
    const cantidadRegistros = parseInt(req.query.cantidadPorPagina) || 10;
    const contenedorIndetificador = req.query.contenedor_identificador || null;
    const contenedorActivo = req.query.contenedor_activo || null;

    let whereParams = {};

    if(contenedorIndetificador) {
      whereParams = {
        contenedor_identificador: {
          contains: contenedorIndetificador
        }
      }
    }

    if(contenedorActivo) {
      whereParams = {
        ...whereParams,
        contenedor_activo: {
          equals: Number(contenedorActivo)
        }
      }
    }


    const skip = (paginaActual - 1) * cantidadRegistros;
    const take = cantidadRegistros;

    const contenedores = await prisma.contenedor.findMany({
      where: whereParams,
      skip,
      take,
    });

    const totalContenedores = await prisma.contenedor.count({
      where: whereParams
    });

    const totalPaginas = Math.ceil(totalContenedores / cantidadRegistros); 

    return res.status(200).json({
      statusCode: 200,
      data: contenedores,
      pagination: {
        total: totalContenedores,
        paginaActual,
        totalPaginas,
        cantidadRegistros
      },
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
    if(req.file && req.file.path) {
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

    if(req.file && req.file.path) {
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

const actualizarContenedor = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const contenedor = await prisma.contenedor.findUnique({
      where: {
        contenedor_id: parseInt(id)
      }
    });

    if(!contenedor) {
      return res.status(404).json({
        statusCode: 404,
        message: 'Contenedor no encontrado'
      })
    }

    const contenedorUpdated = await prisma.contenedor.update({
      where: {
        contenedor_id: parseInt(id)
      },
      data: body
    })

    return res.status(200).json({
      statusCode: 200,
      data: contenedorUpdated,
      message: 'Contenedor actualizado con exito'
    })


  } catch (error) {
    console.log(error)
    return res.status(500).json({
      statusCode: 500,
      message: 'Internal server error'
    })
  }
}

export default {
  obtenerContenedores,
  crearContenedor,
  actualizarContenedor
}