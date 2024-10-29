import { response } from "express";
import { prisma } from "../../prismaClient.js";
import DateUtilityService from "../../shared/services/DateUtility.service.js";

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

const crearContenedor = async (req, res = response) => {
  const { body } = req;
  try {
    const contenedor = await prisma.contenedor.create({
      data: {
        ...body,
        contenedor_activo: true,
        contenedor_fecha: DateUtilityService.obtenerFechaActual()
      }
    })

    return res.status(201).json({
      statusCode: 201,
      data: contenedor,
      message: 'Contenedor creado con exito'
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
  crearContenedor
}