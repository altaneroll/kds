document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // Formun varsayılan davranışını engeller

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;



        try {
            const response = await fetch('/login/authenticate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const result = await response.json();

            if (result.success) {
                // Kullanıcı adını localStorage'a kaydet
                localStorage.removeItem('username'); // Eski kullanıcı adı silinir
                localStorage.setItem('username', username); // Yeni kullanıcı adı kaydedilir

                // Başarı mesajını göster ve yönlendir
                alert(result.message);
                window.location.href = result.redirectUrl; // Anasayfaya yönlendirme
            } else {
                // Hata mesajını göster
                alert(result.message);
            }
        } catch (error) {
            console.error('Login işlemi sırasında hata:', error);
            alert('Bir hata oluştu! Lütfen tekrar deneyin.');
        }
    });
});
