const express = require('express');
const router = express.Router();
const controller = require('../controller/index.controller');

router.get('/',controller.index);
router.post('/login',controller.login);
router.post('/registro',controller.registro);
router.post('/listaCasas',controller.listadoCasas);
router.post('/casa',controller.casa);
router.post('/nuevoMes',controller.nuevoMes);
router.post('/nuevaCasa',controller.nuevaCasa);
router.post('/searchCasas',controller.searchCasas);
router.post('/compruebaCasa',controller.compruebaCasa);
router.post('/casaLogin',controller.casaLogin);
router.post('/compruebaUsers',controller.compruebaUsers);
router.post('/gastos',controller.gastos);
router.post('/resolver',controller.resolver);
router.post('/gastoNuevo',controller.gastoNuevo);
router.post('/borrarGasto',controller.borrarGasto);
router.post('/borrarCasa',controller.borrarCasa);

module.exports = router;