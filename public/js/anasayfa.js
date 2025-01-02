document.addEventListener("DOMContentLoaded", async function () {
    try {
        // Kullanıcı adını almak için API çağrısı yap
        const response = await fetch('/login/getUser');
        if (!response.ok) throw new Error("Kullanıcı bilgisi alınamadı!");

        const data = await response.json();
        const username = data.username; // API'den dönen kullanıcı adı

        // Kullanıcı adını ilgili alanlara yazdır
        const displayUsername = document.getElementById("displayUsername");
        const usernameDisplay = document.getElementById("usernameDisplay");

        // DOM elemanlarının varlığını kontrol et
        if (!displayUsername) console.error("displayUsername id'li element bulunamadı.");
        if (!usernameDisplay) console.error("usernameDisplay id'li element bulunamadı.");

        if (displayUsername) displayUsername.textContent = username;
        if (usernameDisplay) usernameDisplay.textContent = username;
    } catch (error) {
        console.error("Kullanıcı adı alınırken hata oluştu:", error);
    }

    
});
   
    
    
    document.addEventListener("DOMContentLoaded", function () {
                
        // ASİDE LİNKLERİN AKTİF DURUMA GETİRİLMESİ
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll(".nav-link");

        // Tüm bağlantılardan 'active' sınıfını kaldır
        navLinks.forEach(link => link.classList.remove("active"));

        // Şu anki sayfaya uygun bağlantıya 'active' sınıfını ekle
        navLinks.forEach(link => {
            if (link.getAttribute("href") === currentPath) {
                link.classList.add("active");
            }
        });

        // Fullscreen butonu işlevselliği
        const fullscreenButton = document.getElementById('fullscreen-btn');
        fullscreenButton.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen()
                .catch(err => console.log(`Full-screen mode hatası: ${err.message}`));
            } else {
                document.exitFullscreen();
            }
        });

        // Dil değiştirme işlevi
        const languageButton = document.querySelector('.language-button');
        const dropdown = document.getElementById('languageDropdown');

        languageButton.addEventListener('click', () => {
            dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
        });

        const setLanguage = (lang) => {
            const elements = document.querySelectorAll('[data-lang]');
            elements.forEach(element => {
                if (element.getAttribute('data-lang') === lang) {
                    element.style.display = 'block';
                } else {
                    element.style.display = 'none';
                }
            });

            languageButton.innerHTML = lang === 'tr'
                ? '🌐 TR <span class="dropdown-icon">&nbsp;ᐁ</span>'
                : '🌐 ENG <span class="dropdown-icon">&nbsp;ᐁ</span>';
            dropdown.style.display = 'none'; // Dropdown'ı kapat
        };

        document.querySelectorAll('#languageDropdown a').forEach(item => {
            item.addEventListener('click', (event) => {
                event.preventDefault();
                const lang = event.target.textContent.trim();
                setLanguage(lang === 'TR' ? 'tr' : 'en');
            });
        });

        // Google Charts kütüphanesi yükleniyor
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(drawCharts);

        async function drawCharts() {
            try {
                // Grafik 1: İçhat Uçuş Sayıları
                const grafik1Response = await fetch('/anasayfa/grafik1');
                const grafik1DataRaw = await grafik1Response.json();
                const grafik1Data = [['Yıl', 'Uçuş Sayısı']];
                grafik1DataRaw.forEach(item => {
                    grafik1Data.push([
                        String(item.yil), // Yıl
                        Number(item.ucus_sayisi) // Uçuş sayısı
                    ]);
                });

                const grafik1Chart = new google.visualization.ColumnChart(document.getElementById('ucus_grafik'));
                grafik1Chart.draw(google.visualization.arrayToDataTable(grafik1Data), {
                    title: 'Yıllık İçhat Uçuş Sayıları',
                    hAxis: { title: 'Yıl', format: '####' },
                    vAxis: { title: 'Uçuş Sayısı' },
                    height: 400
                });

                // Grafik 2: İçhat Yolcu Sayıları
                const grafik2Response = await fetch('/anasayfa/grafik2');
                const grafik2DataRaw = await grafik2Response.json();
                const grafik2Data = [['Yıl', 'Yolcu Sayısı']];
                grafik2DataRaw.forEach(item => {
                    grafik2Data.push([
                        String(item.yil),
                        Number(item.yolcu_sayisi)
                    ]);
                });

                const grafik2Chart = new google.visualization.LineChart(document.getElementById('yolcu_grafik'));
                grafik2Chart.draw(google.visualization.arrayToDataTable(grafik2Data), {
                    title: 'Yıllık İçhat Yolcu Sayıları',
                    hAxis: { title: 'Yıl', format: '####' },
                    vAxis: { title: 'Yolcu Sayısı' },
                    height: 400
                });

                // Grafik 3: İç ve Dış Hat Uçuş Sayıları
                const grafik3Response = await fetch('/anasayfa/grafik3');
                const grafik3DataRaw = await grafik3Response.json();
                const grafik3Data = [['Yıl', 'İç Hat', 'Dış Hat']];
                grafik3DataRaw.forEach(item => {
                    grafik3Data.push([
                        String(item.yil),
                        Number(item.ichat_ucus),
                        Number(item.dishat_ucus)
                    ]);
                });

                const grafik3Chart = new google.visualization.LineChart(document.getElementById('dis_ucus_grafik'));
                grafik3Chart.draw(google.visualization.arrayToDataTable(grafik3Data), {
                    title: 'Yıllık İç ve Dış Hat Uçuş Sayıları',
                    hAxis: { title: 'Yıl', format: '####' },
                    vAxis: { title: 'Uçuş Sayısı' },
                    height: 400,
                    series: {
                        0: { color: 'blue' },
                        1: { color: 'red' }
                    }
                });
            } catch (error) {
                console.error('Grafiklerin yüklenmesi sırasında bir hata oluştu:', error);
         }
        }
    });