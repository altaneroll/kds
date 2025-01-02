const express = require('express');
const router = express.Router();
const ilanalizleriController = require('../controllers/ilanalizleriController');

// İllerin listesini al
router.get('/iller', ilanalizleriController.getIller);

// Seçilen ildeki havalimanlarını al
router.get('/havalimanlari/:il', ilanalizleriController.getHavalimanlari);

// Seçilen il ve havalimanına ait yılları al
router.get('/yillar/:il/:havalimani', ilanalizleriController.getYillar);

// Seçilen havalimanına ve yıla ait verileri al
router.get('/veriler/:havalimani/:yil', ilanalizleriController.getHavalimaniVerileri);

//Tüm yıllara ait verileri al (ichat_ucus ve tahminleme_veri tablolarından)
router.get('/cizgi_grafik_verileri', ilanalizleriController.getCizgiGrafigiVerileri);





module.exports = router;
