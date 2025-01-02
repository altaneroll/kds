const db = require('../models/db'); // Veritabanı bağlantısını dahil edin

exports.getTop5_tablo = async (req, res) => {
    try {
        console.log("Top 5 tablo sorgusu çalıştırılıyor...");

        const query = `
            SELECT iller.il_id, iller.il_ad, havalimanlari.havalimani_id, havalimanlari.havalimani_ad,
                SUM(ichat_ucus.ucus_sayisi) AS ucus_sayisi, SUM(ichat_ucus.yolcu_sayisi) AS yolcu_sayisi, ichat_ucus.yil
            FROM ichat_ucus
            JOIN havalimanlari ON ichat_ucus.havalimani_id = havalimanlari.havalimani_id
            JOIN iller ON havalimanlari.il_id = iller.il_id
            WHERE ichat_ucus.yil = (SELECT MAX(ichat_ucus.yil) FROM ichat_ucus)
            GROUP BY iller.il_id, iller.il_ad, havalimanlari.havalimani_id, havalimanlari.havalimani_ad, ichat_ucus.yil
            ORDER BY ucus_sayisi DESC
            LIMIT 5;
        `;

        const [rows] = await db.execute(query);

        console.log("Top 5 tablo sorgusu sonucu:", rows);
        res.json(rows);
    } catch (error) {
        console.error('Top 5 Havalimanı verileri alınırken hata oluştu:', error);
        res.status(500).json({ error: 'Veriler alınırken bir hata oluştu.' });
    }
};

exports.getTop5_ucusgrafik = async (req, res) => {
    try {
        const query = `
            SELECT ichat_ucus.havalimani_ad, SUM(ichat_ucus.ucus_sayisi) AS toplam_ucus_sayisi
            FROM ichat_ucus
            WHERE ichat_ucus.yil = (SELECT MAX(ichat_ucus.yil) FROM ichat_ucus)
            GROUP BY ichat_ucus.havalimani_ad
            ORDER BY toplam_ucus_sayisi DESC
            LIMIT 5;
        `;

        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Top 5 uçuş grafiği sorgusunda hata:', error);
        res.status(500).json({ error: 'Veriler alınırken bir hata oluştu.' });
    }
};

exports.getTop5_yolcugrafik = async (req, res) => {
    try {
        const query = `
            SELECT ichat_ucus.havalimani_ad, SUM(ichat_ucus.yolcu_sayisi) AS toplam_yolcu_sayisi
            FROM ichat_ucus
            WHERE ichat_ucus.yil = (SELECT MAX(ichat_ucus.yil) FROM ichat_ucus)
            GROUP BY ichat_ucus.havalimani_ad
            ORDER BY toplam_yolcu_sayisi DESC
            LIMIT 5;
        `;

        const [rows] = await db.execute(query);
        res.json(rows);
    } catch (error) {
        console.error('Top 5 yolcu grafiği sorgusunda hata:', error);
        res.status(500).json({ error: 'Veriler alınırken bir hata oluştu.' });
    }
};
