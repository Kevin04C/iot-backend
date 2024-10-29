import { request, response } from "express";
import { prisma } from "../../prismaClient.js";

const obtenerContenedores = async (req, res = response) => {
  try {
    const contenedores = await prisma.contenedor.findMany();
    return res.status(200).json({
      statusCode: 200,
      data: contenedores,
      message: 'Contenedores'
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
  const { body } = req;
  try {

    

    // const contenedor = await prisma.contenedor.create({
    //   data: {
    //     ...body,
    //     contenedor_activo: true,
    //   }
    // })

    const contenedorData = {
      contendor_nombre: req.file,
      contenedor_activo: true
    }

    return res.status(201).json({
      statusCode: 201,
      data: contenedorData,
      message: 'Contenedor creado con exito'
    })
  } catch (err) {
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