const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const session = require('express-session');
// Router'ları dahil edin
const loginRouter = require('./routers/login'); // Login Router'ını dahil ettik
const anasayfaRouter = require('./routers/anasayfa');
const top5Router = require('./routers/top5');
const worst5Router = require('./routers/worst5');
const ilanalizleriRouter = require('./routers/ilanalizleri');
const tahminlemeRouter = require('./routers/tahminleme');

dotenv.config(); // .env dosyasındaki bilgileri yükle

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // Form verilerini almak için gerekli
app.use(cors());
app.use(express.static('public'));

// Varsayılan rota
app.get('/', (req, res) => {
    res.redirect('/login'); // Varsayılan olarak login sayfasına yönlendir
});

// Router'ları kullan
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));
app.use('/login', loginRouter); // Login Router'ını kullan
app.use('/anasayfa', anasayfaRouter);
app.use('/top5', top5Router);
app.use('/worst5', worst5Router);
app.use('/ilanalizleri', ilanalizleriRouter);
app.use('/tahminleme', tahminlemeRouter);


// Sayfa yükleme rotaları
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'login.html')); // Login sayfasını yükler
});
app.get('/anasayfa', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'anasayfa.html'));
});
app.get('/top5', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'top5.html'));
});
app.get('/worst5', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'worst5.html'));
});
app.get('/ilanalizleri', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'ilanalizleri.html'));
});
app.get('/tahminleme', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'tahminleme.html'));
});


// Genel hata yakalama middleware'i
app.use((err, req, res, next) => {
    console.error('Genel hata:', err.stack);
    res.status(500).send('Bir hata oluştu!');
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});

