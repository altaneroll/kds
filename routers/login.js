const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');
const path = require('path'); // BURADA path modülünü import edin


// Oturumdaki kullanıcı adını almak için rota
router.get('/getUser', (req, res) => {
    const username = req.session.username;
    if (username) {
        res.json({ username });
    } else {
        res.status(401).json({ error: "Kullanıcı giriş yapmamış!" });
    }
});

// Login doğrulama işlemi için POST rota
router.post('/authenticate', loginController.login);

module.exports = router;
