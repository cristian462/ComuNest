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

module.exports = router;