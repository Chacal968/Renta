const express = require('express');
const router = express.Router();
const misControles = require('../controllers/misControles');
const { fileLoader } = require('ejs');
router.get('/', misControles.inicio); // llama al método 'list' creado en el controlador 
router.get('/solicitud', misControles.listarAutos); // llama al método 'list' creado en el controlador 
router.post('/add', misControles.save);  // insertar una fila en la BD
router.post('/get-polotur', misControles.PoblarPolosTur);

module.exports = router;