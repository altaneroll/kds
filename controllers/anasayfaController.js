const db = require('../models/db'); // Veritabanı bağlantısını dahil edin

exports.getGrafik1Data = async (req, res) => {
    try {
        const query = `
            SELECT ichat_ucus.yil, SUM(ichat_ucus.ucus_sayisi) AS toplam_ucus_sayisi 
            FROM ichat_ucus 
            WHERE ichat_ucus.yil
            GROUP BY ichat_ucus.yil 
            ORDER BY ichat_ucus.yil ASC;
        `;
        
        const [rows] = await db.execute(query);

        // Verileri formatlayarak gönderiyoruz
        const formattedData = rows.map(row => ({
            yil: row.yil,
            ucus_sayisi: row.toplam_ucus_sayisi
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Grafik 1 için veri alınırken bir hata oluştu:', error);
        res.status(500).json({ error: 'Veriler alınırken bir hata oluştu.' });
    }
};

exports.getGrafik2Data = async (req, res) => {
    try {
        const query = `
            SELECT ichat_ucus.yil, SUM(ichat_ucus.yolcu_sayisi) AS toplam_yolcu_sayisi 
            FROM ichat_ucus 
            WHERE ichat_ucus.yil
            GROUP BY ichat_ucus.yil 
            ORDER BY ichat_ucus.yil ASC;
        `;
        
        const [rows] = await db.execute(query);

        // Verileri formatlayarak gönderiyoruz
        const formattedData = rows.map(row => ({
            yil: row.yil,
            yolcu_sayisi: row.toplam_yolcu_sayisi
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Grafik 2 için veri alınırken bir hata oluştu:', error);
        res.status(500).json({ error: 'Veriler alınırken bir hata oluştu.' });
    }
};


exports.getGrafik3Data = async (req, res) => {
    try {
        const query = `
            SELECT yil, 
                   SUM(CASE WHEN hat_ad = 'iç Hat' THEN ucus_sayisi ELSE 0 END) AS toplam_ichat_ucus,
                   SUM(CASE WHEN hat_ad = 'dış Hat' THEN ucus_sayisi ELSE 0 END) AS toplam_dishat_ucus
            FROM tr_toplam_ucus
            WHERE yil IN (2019, 2020, 2021, 2022, 2023)
            GROUP BY yil
            ORDER BY yil ASC;
        `;

        const [rows] = await db.execute(query);

        const formattedData = rows.map(row => ({
            yil: row.yil,
            ichat_ucus: row.toplam_ichat_ucus,
            dishat_ucus: row.toplam_dishat_ucus
        }));

        res.json(formattedData);
    } catch (error) {
        console.error('Grafik 3 için veri alınırken bir hata oluştu:', error);
        res.status(500).json({ error: 'Veriler alınırken bir hata oluştu.' });
    }
};


