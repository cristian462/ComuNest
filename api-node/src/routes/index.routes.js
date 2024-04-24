const express = require('express');
const router = express.Router();
const controller = require('../controller/index.controller');

router.get('/',controller.index);
router.post('/login',controller.login);
router.post('/registro',controller.registro);
router.post('/listaCasas',controller.listadoCasas);
router.get('/consultar',controller.consultar);
router.get('/consultar1',controller.consultar1);

module.exports = router;