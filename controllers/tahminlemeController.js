const db = require('../models/db'); // Veritabanı bağlantısını dahil edin

// İllerin listesini döndürür
exports.getIller = async (req, res) => {
    try {
        const [results] = await db.query('SELECT DISTINCT il_ad FROM iller ORDER BY il_ad ASC');
        res.json(results);
    } catch (err) {
        console.error('Veritabanı hatası:', err);
        res.status(500).json({ error: 'Veritabanı hatası', details: err.message });
    }
};

// Seçilen ildeki havalimanlarını döndürür
exports.getHavalimanlari = async (req, res) => {
    const { il } = req.params;
    if (!il || typeof il !== 'string') {
        return res.status(400).json({ error: 'Geçersiz il parametresi' });
    }
    try {
        const [results] = await db.query(`
            SELECT havalimani_ad 
            FROM havalimanlari 
            INNER JOIN iller ON iller.il_id = havalimanlari.il_id 
            WHERE iller.il_ad = ?
            ORDER BY havalimani_ad ASC
        `, [il]);
        res.json(results);
    } catch (err) {
        console.error('Veritabanı hatası:', err);
        res.status(500).json({ error: 'Veritabanı hatası', details: err.message });
    }
};

// Seçilen il ve havalimanına ait yılları döndürür
exports.getYillar = async (req, res) => {
    const { il, havalimani } = req.params;
    if (!il || typeof il !== 'string' || !havalimani || typeof havalimani !== 'string') {
        return res.status(400).json({ error: 'Geçersiz il veya havalimanı parametresi' });
    }
    try {
        const [results] = await db.query(`
            SELECT DISTINCT tahminleme_veri.yil
            FROM tahminleme_veri
            INNER JOIN havalimanlari ON tahminleme_veri.havalimani_id = havalimanlari.havalimani_id
            INNER JOIN iller ON havalimanlari.il_id = iller.il_id
            WHERE iller.il_ad = ? AND havalimanlari.havalimani_ad = ?
            ORDER BY tahminleme_veri.yil ASC
        `, [il, havalimani]);
        res.json(results);
    } catch (err) {
        console.error('Veritabanı hatası:', err);
        res.status(500).json({ error: 'Veritabanı hatası', details: err.message });
    }
};

// Seçilen havalimanına ve yıla ait verileri döndürür
exports.getHavalimaniVerileri = async (req, res) => {
    const { havalimani, yil } = req.params;
    const parsedYil = parseInt(yil, 10);
    if (!havalimani || typeof havalimani !== 'string' || isNaN(parsedYil)) {
        return res.status(400).json({ error: 'Geçersiz havalimanı veya yıl parametresi' });
    }
    try {
        const [results] = await db.query(`
            SELECT tahminleme_veri.*, iller.il_ad
            FROM tahminleme_veri
            INNER JOIN havalimanlari ON tahminleme_veri.havalimani_id = havalimanlari.havalimani_id
            INNER JOIN iller ON havalimanlari.il_id = iller.il_id
            WHERE havalimanlari.havalimani_ad = ? AND tahminleme_veri.yil = ?
        `, [havalimani, parsedYil]);
        res.json(results);
    } catch (err) {
        console.error('Veritabanı hatası:', err);
        res.status(500).json({ error: 'Veritabanı hatası', details: err.message });
    }
};

// Tüm yıllara ait verileri vere Çizgi Grafik
exports.getCizgiGrafigiVerileri = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT yil, SUM(ucus_sayisi) AS toplam_ucus_sayisi
            FROM ichat_ucus
            WHERE yil BETWEEN 2019 AND 2023
            GROUP BY yil

            UNION ALL

            SELECT yil, SUM(tahmin_ucus_sayi) AS toplam_ucus_sayisi
            FROM tahminleme_veri
            WHERE yil BETWEEN 2024 AND 2025
            GROUP BY yil

            ORDER BY yil;

        `);
        res.json(results);
    } catch (err) {
        console.error('Çizgi grafiği verilerini çekerken hata oluştu:', err);
        res.status(500).json({ error: 'Veri çekme hatası', details: err.message });
    }
};
