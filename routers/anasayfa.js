const express = require('express');
const router = express.Router();
const anasayfaController = require('../controllers/anasayfaController');

// Grafik 1 verileri
router.get('/grafik1', anasayfaController.getGrafik1Data);

// Grafik 2 verileri
router.get('/grafik2', anasayfaController.getGrafik2Data);


// Grafik 3 verileri
router.get('/grafik3', anasayfaController.getGrafik3Data);


module.exports = router;






