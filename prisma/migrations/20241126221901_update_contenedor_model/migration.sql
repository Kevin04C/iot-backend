-- CreateTable
CREATE TABLE `contenedor` (
    `contenedor_id` INTEGER NOT NULL AUTO_INCREMENT,
    `contenedor_identificador` VARCHAR(50) NOT NULL,
    `contenedor_peso` DECIMAL(14, 2) NULL,
    `contenedor_humedad` DECIMAL(14, 2) NULL,
    `contenedor_posicion` VARCHAR(50) NULL,
    `contenedor_fecha` DATETIME(0) NULL,
    `contenedor_imagenidentidicador` VARCHAR(255) NULL,
    `contenedor_imagen` VARCHAR(255) NULL,
    `contenedor_temperatura` DECIMAL(14, 2) NULL,
    `contenedor_activo` TINYINT NOT NULL,

    UNIQUE INDEX `contenedor_identidicador_UNIQUE`(`contenedor_identificador`),
    PRIMARY KEY (`contenedor_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
