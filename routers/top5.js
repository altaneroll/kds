const express = require('express');
const router = express.Router();
const top5Controller = require('../controllers/top5Controller');

// Tablo verileri
router.get('/veriler', top5Controller.getTop5_tablo);

// Uçuş grafiği verileri
router.get('/ucus-grafik', top5Controller.getTop5_ucusgrafik);

// Yolcu grafiği verileri
router.get('/yolcu-grafik', top5Controller.getTop5_yolcugrafik);

module.exports = router;


