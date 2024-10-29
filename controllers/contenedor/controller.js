import { response } from "express";
import { prisma } from "../../prisma/prismaClient"

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


export default {
  obtenerContenedores
}