const express = require('express');
const router = express.Router();
const controller = require('../controller/index.controller')

router.get('/',controller.index);
router.get('/usuario',controller.usuarios);
router.get('/consultar',controller.consultar);
router.get('/consultar1',controller.consultar1);

module.exports = router;