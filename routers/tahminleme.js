const express = require('express');
const router = express.Router();
const tahminlemeController = require('../controllers/tahminlemeController');

// İllerin listesini al
router.get('/iller', tahminlemeController.getIller);

// Seçilen ildeki havalimanlarını al
router.get('/havalimanlari/:il', tahminlemeController.getHavalimanlari);

// Seçilen il ve havalimanına ait yılları al
router.get('/yillar/:il/:havalimani', tahminlemeController.getYillar);

// Seçilen havalimanına ve yıla ait verileri al
router.get('/veriler/:havalimani/:yil', tahminlemeController.getHavalimaniVerileri);

//Tüm yıllara ait verileri al (ichat_ucus ve tahminleme_veri tablolarından)
router.get('/cizgi_grafik_verileri', tahminlemeController.getCizgiGrafigiVerileri);



module.exports = router;
