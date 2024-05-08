SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


CREATE DATABASE IF NOT EXISTS `comunest` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `comunest`;


CREATE TABLE usuario (
        id_user INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(30),
        email VARCHAR(40),
        pass VARCHAR(100),
        nivel TINYINT
);


CREATE TABLE casa (
        id_casa INT AUTO_INCREMENT PRIMARY KEY,
        pass VARCHAR(100),
        nombre VARCHAR(30)
);


CREATE TABLE casa_user (
        id_casa INT,
        id_user INT,
        FOREIGN KEY (id_user) REFERENCES usuario(id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_casa) REFERENCES casa(id_casa) ON DELETE CASCADE
);


CREATE TABLE mes (
        id_mes INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(30),
        id_casa INT,
        resuelto TINYINT,
        FOREIGN KEY (id_casa) REFERENCES casa(id_casa) ON DELETE CASCADE
);


CREATE TABLE gasto (
        id_gasto INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(30),
        descripcion VARCHAR(300),
        importe INT,
        id_user INT,
        id_casa INT,
        id_mes INT,
        FOREIGN KEY (id_user) REFERENCES usuario(id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_casa) REFERENCES casa(id_casa) ON DELETE CASCADE,
        FOREIGN KEY (id_mes) REFERENCES mes(id_mes) ON DELETE CASCADE
);


CREATE TABLE comentario (
        id_coment INT AUTO_INCREMENT PRIMARY KEY,
        id_user INT,
        id_casa INT,
        contenido VARCHAR(400),
        FOREIGN KEY (id_user) REFERENCES usuario(id_user) ON DELETE CASCADE,
        FOREIGN KEY (id_casa) REFERENCES casa(id_casa) ON DELETE CASCADE
);






INSERT INTO usuario (nombre, email, pass, foto_perfil, nivel)
VALUES ('Juan', 'juan@example.com', '123456', 'perfil_juan.jpg', 1),
       ('Maria', 'maria@example.com', 'password', 'perfil_maria.jpg', 1),
       ('Pedro', 'pedro@example.com', 'pass123', 'perfil_pedro.jpg', 1);

INSERT INTO casa (nombre)
VALUES ('Casa A'),
       ('Casa B'),
       ('Casa C');

INSERT INTO casa_user (id_casa, id_user)
VALUES (1, 1),
       (1, 2),
       (2, 3);

INSERT INTO mes (nombre, id_casa, total, resuelto)
VALUES ('Enero', 1, 1500, 0),
       ('Febrero', 1, 1200, 0),
       ('Marzo', 2, 1800, 1);

INSERT INTO gasto (nombre, descripcion, importe, id_user, id_casa, id_mes)
VALUES ('Comida', 'Compra mensual de alimentos', 300, 1, 1, 1),
       ('Alquiler', 'Pago del alquiler', 500, 2, 1, 1),
       ('Luz', 'Factura de luz', 100, 3, 2, 3);

