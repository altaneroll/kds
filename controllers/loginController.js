exports.login = (req, res) => {
    const { username, password } = req.body;

    // Sabit kullanıcı adı ve şifre kontrolü
    if ((username === "Altan EROL" && password === "123") ||
        (username === "Vahap TECİM" && password === "456")) {
        
        // Kullanıcı adını session'a kaydet
        req.session.username = username;

        // Başarılı giriş sonrası Anasayfa'ya yönlendirme
        return res.redirect('/anasayfa');
    } else {
        // Hatalı giriş durumunda hata mesajı döndür
        res.status(401).send('Hatalı kullanıcı adı veya şifre!');
    }
};
