// Kullanıcı adını al ve görüntüle
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
})

document.addEventListener("DOMContentLoaded", async function () {

    // Aktif bağlantıyı belirle
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => link.classList.remove("active"));
    navLinks.forEach(link => {
        if (link.getAttribute("href") === currentPath) {
            link.classList.add("active");
        }
    });

    try {
        // Tablo gövdesini seç
        const tableBody = document.getElementById('worst5-table');
        tableBody.innerHTML = ''; // Önceki satırları temizle

        // Veriyi API'den al
        const response = await fetch('/worst5/veriler');
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();

        // Gelen veriyi kontrol et ve tekrarı engelle
        const uniqueData = Array.from(new Map(data.map(item => [item.havalimani_id, item])).values());

        // Gelen veriyi tabloya yerleştir
        uniqueData.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.il_id}</td>
                <td>${item.il_ad}</td>
                <td>${item.havalimani_id}</td>
                <td>${item.havalimani_ad}</td>
                <td>${Number(item.ucus_sayisi).toLocaleString('tr-TR')}</td>
                <td>${Number(item.yolcu_sayisi).toLocaleString('tr-TR')}</td>
                <td>${item.yil}</td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Veri çekme hatası:', error);
        alert('Veriler alınırken bir hata oluştu.');
    }

});


    // Google Charts grafiklerini çiz
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(drawCharts);

    async function drawCharts() {
        try {
            // Uçuş Grafiği Verileri
            const ucusResponse = await fetch('/worst5/ucus-grafik');
            if (!ucusResponse.ok) throw new Error('Uçuş grafiği verileri alınamadı!');
            const ucusData = await ucusResponse.json();
            const ucusChartData = [['Havalimanı', 'Uçuş Sayısı']];
            ucusData.forEach(item => {
                ucusChartData.push([item.havalimani_ad, Number(item.toplam_ucus_sayisi)]);
            });

            const ucusChart = new google.visualization.ColumnChart(document.getElementById('ucusChart'));
            ucusChart.draw(google.visualization.arrayToDataTable(ucusChartData), {
                title: 'Uçuş Sayıları',
                hAxis: { title: 'Havalimanı' },
                vAxis: { title: 'Uçuş Sayısı' },
                legend: { position: 'none' },
            });

            // Yolcu Grafiği Verileri
            const yolcuResponse = await fetch('/worst5/yolcu-grafik');
            if (!yolcuResponse.ok) throw new Error('Yolcu grafiği verileri alınamadı!');
            const yolcuData = await yolcuResponse.json();
            const yolcuChartData = [['Havalimanı', 'Yolcu Sayısı']];
            yolcuData.forEach(item => {
                yolcuChartData.push([item.havalimani_ad, Number(item.toplam_yolcu_sayisi)]);
            });

            const yolcuChart = new google.visualization.PieChart(document.getElementById('yolcuChart'));
            yolcuChart.draw(google.visualization.arrayToDataTable(yolcuChartData), {
                title: 'Yolcu Sayıları',
                is3D: true,
            });
        } catch (error) {
            console.error('Grafik çizim hatası:', error);
        }
    }
