const express = require('express');
const router = express.Router();
const worst5Controller = require('../controllers/worst5Controller');


// Tablo verileri
router.get('/veriler', worst5Controller.getWorst5_tablo);

// Uçuş grafiği verileri
router.get('/ucus-grafik', worst5Controller.getWorst5_ucusgrafik);

// Yolcu grafiği verileri
router.get('/yolcu-grafik', worst5Controller.getWorst5_yolcugrafik);

module.exports = router;

