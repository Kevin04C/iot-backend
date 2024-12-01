import { request, response } from "express";
import { prisma } from "../../prismaClient.js";
import { ACTIVO, FOLDER_IMG_CONTENEDORES } from "../../shared/consts.js";
import CloudinaryService from "../../shared/services/Cloudinary.service.js";
import { unlink } from "fs/promises";
import DateUtilityService from "../../shared/services/DateUtility.service.js";
import { UtilityService } from "../../shared/services/Utility,service.js";

const obtenerContenedores = async (req, res = response) => {
  try {
    const paginaActual = parseInt(req.query.paginaActual) || 1;
    const cantidadRegistros = parseInt(req.query.cantidadPorPagina) || 10;
    const contenedorIndetificador = req.query.contenedor_identificador || null;
    const contenedorActivo = req.query.contenedor_activo || null;

    UtilityService.logs.push("Pagina actual: " + paginaActual);
    UtilityService.logs.push("Cantidad registros: " + cantidadRegistros);

    let whereParams = {};

    if (contenedorIndetificador) {
      whereParams = {
        contenedor_identificador: {
          contains: contenedorIndetificador,
        },
      };
    }

    if (contenedorActivo) {
      whereParams = {
        ...whereParams,
        contenedor_activo: {
          equals: Number(contenedorActivo),
        },
      };
    }

    const skip = (paginaActual - 1) * cantidadRegistros;
    const take = cantidadRegistros;

    const contenedores = await prisma.contenedor.findMany({
      where: whereParams,
      skip,
      take,
    });

    const totalContenedores = await prisma.contenedor.count({
      where: whereParams,
    });

    const totalPaginas = Math.ceil(totalContenedores / cantidadRegistros);

    return res.status(200).json({
      statusCode: 200,
      data: contenedores,
      pagination: {
        total: totalContenedores,
        paginaActual,
        totalPaginas,
        cantidadRegistros,
      },
      logs: UtilityService.logs,
      message: null,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

const crearContenedor = async (req = request, res = response) => {
  const body = req.body;
  try {
    console.log(body);
    const identificador = body.contenedor_identificador;

    const contenedorExistente = await prisma.contenedor.findFirst({
      where: {
        contenedor_identificador: identificador,
      },
    });

    if (contenedorExistente) {
      return res.status(400).json({
        statusCode: 400,
        message: `El contenedor con identificador ${identificador} ya existe`,
      });
    }

    /** Los datos de la img cuando se insertan */
    let url = null;
    let public_id = null;

    /** Si viene una img la agrego */
    if (req.file && req.file.path) {
      const { url, public_id } = await CloudinaryService.uploadFile({
        file: req.file.path,
        folder: FOLDER_IMG_CONTENEDORES,
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
      contenedor_fecha: DateUtilityService.obtenerFechaActual(),
    };

    if (req.file && req.file.path) {
      dataContendor.contenedor_imagen = url;
      dataContendor.contenedor_imagenidentidicador = public_id;
    }

    const contenedorCreated = await prisma.contenedor.create({
      data: dataContendor,
    });

    return res.status(201).json({
      statusCode: 201,
      data: contenedorCreated,
      message: "Contenedor creado con exito",
    });
  } catch (err) {
    console.log(err);

    if (err instanceof Error) {
      return res.status(400).json({
        statusCode: 400,
        message: err.message,
      });
    }
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

const actualizarContenedor = async (req = request, res = response) => {
  try {
    const { id } = req.params;
    const body = req.body;

    const contenedor = await prisma.contenedor.findUnique({
      where: {
        contenedor_id: parseInt(id),
      },
    });

    if (!contenedor) {
      return res.status(404).json({
        statusCode: 404,
        message: "Contenedor no encontrado",
      });
    }

    const contenedorUpdated = await prisma.contenedor.update({
      where: {
        contenedor_id: parseInt(id),
      },
      data: body,
    });

    return res.status(200).json({
      statusCode: 200,
      data: contenedorUpdated,
      message: "Contenedor actualizado con exito",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

const obtenerInformacionDashboard = async (req = request, res = response) => {
  try {
    const fechaActual = DateUtilityService.obtenerFechaCorta();
    const fechaInicio = `${fechaActual} 00:00:00`;
    const fechaFin = `${fechaActual} 23:59:59`;

    let contenedoresPorHora = {
      labels: [],
      values: []
    };

    let objRetorno = {};

    const result = await prisma.$queryRaw`SELECT 
    LPAD(horas.hora, 2, '0') AS hora,
    COUNT(contenedor.contenedor_id) AS total
    FROM 
        (SELECT 0 AS hora UNION ALL
        SELECT 1 UNION ALL
        SELECT 2 UNION ALL
        SELECT 3 UNION ALL
        SELECT 4 UNION ALL
        SELECT 5 UNION ALL
        SELECT 6 UNION ALL
        SELECT 7 UNION ALL
        SELECT 8 UNION ALL
        SELECT 9 UNION ALL
        SELECT 10 UNION ALL
        SELECT 11 UNION ALL
        SELECT 12 UNION ALL
        SELECT 13 UNION ALL
        SELECT 14 UNION ALL
        SELECT 15 UNION ALL
        SELECT 16 UNION ALL
        SELECT 17 UNION ALL
        SELECT 18 UNION ALL
        SELECT 19 UNION ALL
        SELECT 20 UNION ALL
        SELECT 21 UNION ALL
        SELECT 22 UNION ALL
        SELECT 23) AS horas
    LEFT JOIN contenedor 
        ON HOUR(contenedor.contenedor_fecha) = horas.hora 
        AND contenedor.contenedor_fecha BETWEEN ${fechaInicio} AND ${fechaFin}
    GROUP BY horas.hora
    ORDER BY horas.hora`;

    const serializedResult = JSON.parse(JSON.stringify(result, serializeBigInt));

    serializedResult.forEach((registro) => {
      contenedoresPorHora.labels.push(registro.hora);
      contenedoresPorHora.values.push(registro.total);      
    });

    objRetorno.contenedoresPorHora = contenedoresPorHora;

    return res.status(200).json({
      statusCode: 200,
      data: objRetorno,
      message: "Información obtenida con éxito",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
    });
  }
};


const serializeBigInt = (key, value) => {
  if (typeof value === 'bigint') {
    return value.toString();
  }
  return value;
};

export default {
  obtenerContenedores,
  crearContenedor,
  actualizarContenedor,
  obtenerInformacionDashboard,
};
