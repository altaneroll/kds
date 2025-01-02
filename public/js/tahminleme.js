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
    



document.addEventListener('DOMContentLoaded', () => {

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
        const expanded = languageButton.getAttribute('aria-expanded') === 'true' || false;
        languageButton.setAttribute('aria-expanded', !expanded);
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
        languageButton.setAttribute('aria-expanded', 'false');
    };

    document.querySelectorAll('#languageDropdown a').forEach(item => {
        item.addEventListener('click', (event) => {
            event.preventDefault();
            const lang = event.target.textContent.trim();
            setLanguage(lang === 'TR' ? 'tr' : 'en');
        });
    });

    const ilSelect = document.getElementById('il-secimi');
    const havalimaniSelect = document.getElementById('havalimani-secimi');
    const yilSelect = document.getElementById('yil-secimi'); // Yeni Yıl Select
    const grafiklerContainer = document.getElementById('grafikler');

    // Google Charts Loader
    google.charts.load('current', { packages: ['corechart'] });

    // İl listesini yükle
    async function loadIller() {
        try {
            const response = await fetch('/tahminleme/iller');
            if (!response.ok) throw new Error('İl yükleme hatası');
            const iller = await response.json();
            ilSelect.innerHTML = '<option value="">İl Seçiniz</option>';
            iller.forEach(il => {
                const option = document.createElement('option');
                option.value = il.il_ad;
                option.textContent = il.il_ad;
                ilSelect.appendChild(option);
            });
        } catch (error) {
            console.error('İl yükleme hatası:', error);
            grafiklerContainer.innerHTML = '<p>İl yüklenirken bir hata oluştu.</p>';
        }
    }

    loadIller();

    // Havalimanı ve Yıl Seçimini Temizleme Fonksiyonu
    function clearSelections() {
        havalimaniSelect.innerHTML = '<option value="">Havalimanı seçin</option>';
        yilSelect.innerHTML = '<option value="">Yıl seçiniz</option>';
        grafiklerContainer.innerHTML = '';
    }

    // Yılları Yükleme Fonksiyonu
    async function loadYillar(il, havalimani) {
        try {
            const response = await fetch(`/tahminleme/yillar/${encodeURIComponent(il)}/${encodeURIComponent(havalimani)}`);
            if (!response.ok) throw new Error('Yıl yükleme hatası');
            const yillar = await response.json();
            yilSelect.innerHTML = '<option value="">Yıl seçiniz</option>';
            yillar.forEach(yil => {
                const option = document.createElement('option');
                option.value = yil.yil;
                option.textContent = yil.yil;
                yilSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Yıl yükleme hatası:', error);
            grafiklerContainer.innerHTML = '<p>Yıl yüklenirken bir hata oluştu.</p>';
        }
    }

    // Havalimanı seçildiğinde yılları yükle
    havalimaniSelect.addEventListener('change', () => {
        const secilenIl = ilSelect.value;
        const secilenHavalimani = havalimaniSelect.value;

        if (!secilenIl || !secilenHavalimani) {
            yilSelect.innerHTML = '<option value="">Yıl seçiniz</option>';
            grafiklerContainer.innerHTML = '';
            return;
        }

        loadYillar(secilenIl, secilenHavalimani);
        grafiklerContainer.innerHTML = '';
    });

    // İl seçildiğinde havalimanlarını yükle ve diğer seçimleri temizle
    ilSelect.addEventListener('change', () => {
        const secilenIl = ilSelect.value;
        if (!secilenIl) {
            clearSelections();
            return;
        }

        fetch(`/tahminleme/havalimanlari/${encodeURIComponent(secilenIl)}`)
            .then(response => {
                if (!response.ok) throw new Error('Havalimanı yükleme hatası');
                return response.json();
            })
            .then(havalimanlari => {
                havalimaniSelect.innerHTML = '<option value="">Havalimanı Seçiniz</option>';
                havalimanlari.forEach(havalimani => {
                    const option = document.createElement('option');
                    option.value = havalimani.havalimani_ad;
                    option.textContent = havalimani.havalimani_ad;
                    havalimaniSelect.appendChild(option);
                });
                yilSelect.innerHTML = '<option value="">Yıl seçiniz</option>'; // Yılları temizle
                grafiklerContainer.innerHTML = '';
            })
            .catch(error => {
                console.error('Havalimanı yükleme hatası:', error);
                grafiklerContainer.innerHTML = '<p>Havalimanı yüklenirken bir hata oluştu.</p>';
            });
    });

    // Yıl seçildiğinde grafikleri yükle
    yilSelect.addEventListener('change', () => {
        const secilenHavalimani = havalimaniSelect.value;
        const secilenYil = yilSelect.value;

        if (!secilenHavalimani || !secilenYil) {
            grafiklerContainer.innerHTML = '<p>Lütfen havalimanı ve yıl seçiniz.</p>';
            return;
        }

        fetch(`/tahminleme/veriler/${encodeURIComponent(secilenHavalimani)}/${encodeURIComponent(secilenYil)}`)
            .then(response => {
                if (!response.ok) throw new Error('Veri yükleme hatası');
                return response.json();
            })
            .then(data => {
                console.log('Veri:', data); // Gelen veriyi konsola yazdır
                grafiklerContainer.innerHTML = ''; // Önceki grafikleri temizle
                google.charts.setOnLoadCallback(() => {
                    drawMonthlyChart(data);
                    drawSeasonalChart(data); // Mevsimsel grafiği çiz
                    drawSeasonalPieChart(data); // Yeni pasta grafiği çiz
                    drawLineChart();
                });
            })
            .catch(error => {
                console.error('Veri yükleme hatası:', error);
                grafiklerContainer.innerHTML = '<p>Veriler yüklenirken bir hata oluştu.</p>';
            });
    });

    // Grafik Container Oluşturma Fonksiyonu
    function createChartContainer() {
        const chartContainer = document.createElement('div');
        chartContainer.style.width = '100%';
        chartContainer.style.height = '400px';
        chartContainer.style.marginBottom = '40px'; 
        grafiklerContainer.appendChild(chartContainer);
        return chartContainer;

        
    }

    // Aylık uçuş grafiği
    function drawMonthlyChart(data) {
        if (!data || data.length === 0) {
            grafiklerContainer.innerHTML += '<p>Veri bulunamadı.</p>';
            return;
        }

        const yil = parseInt(yilSelect.value, 10);
        if (isNaN(yil)) {
            grafiklerContainer.innerHTML += '<p>Geçersiz yıl seçimi.</p>';
            return;
        }

        const aylikVeri = data
            .filter(d => d.yil === yil)
            .map(d => [d.ay, Number(d.tahmin_ucus_sayi)]);


        if (aylikVeri.length === 0) {
            grafiklerContainer.innerHTML += '<p>Seçilen yıla ait veri bulunamadı.</p>';
            return;
        }

        console.log('Aylık Veri:', aylikVeri); // Aylık veriyi konsola yazdır

        // En fazla ve en az uçuş sayısını bul
        const maxUcus = Math.max(...aylikVeri.map(d => d[1]));
        const minUcus = Math.min(...aylikVeri.map(d => d[1]));

        // En fazla uçuş sayısına sahip ayları bul
        const enFazlaUcusAylar = aylikVeri
            .filter(d => d[1] === maxUcus)
            .map(d => d[0]); // Ay isimlerini al

        // En az uçuş sayısına sahip ayları bul
        const enDusukUcusAylar = aylikVeri
            .filter(d => d[1] === minUcus)
            .map(d => d[0]); // Ay isimlerini al

        // Veri tablosunu oluştururken stil sütunu ekle
        const dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', 'Ay');
        dataTable.addColumn('number', 'Uçuş Sayısı');
        dataTable.addColumn({ type: 'string', role: 'style' }); // Stil sütunu

        aylikVeri.forEach(([ay, ucusSayisi]) => {
            let style = null;
            if (enFazlaUcusAylar.includes(ay)) {
                // En fazla uçuş sayısına sahip aylar için mavi kenarlar ve daha kalın çizgiler
                style = 'stroke-color: blue; stroke-width: 4';
            }
            if (enDusukUcusAylar.includes(ay)) {
                // En az uçuş sayısına sahip aylar için kırmızı kenarlar ve daha kalın çizgiler
                // Eğer bir ay hem en fazla hem en az uçuş sayısına sahipse, kırmızı öncelikli olsun
                style = 'stroke-color: red; stroke-width: 4';
            }

            // Ay isminin geçerli olup olmadığını kontrol et
            let ayIsmi;

            if (typeof ay === 'string') {
                // Ay ismi olarak string geliyorsa, doğrudan kullan
                ayIsmi = ay;
            } else {
                ayIsmi = null;
            }

            if (!ayIsmi) {
                console.error(`Geçersiz ay değeri: ${ay}`);
                dataTable.addRow([
                    'Bilinmeyen', // Geçersiz ay için placeholder
                    ucusSayisi,
                    style
                ]);
            } else {
                dataTable.addRow([
                    ayIsmi, // Ay ismini doğrudan kullan
                    ucusSayisi,
                    style
                ]);
            }
        });

        const options = {
            title: `İç Hat Aylık Uçuş Tahmin Grafiği (${yil})`,
            legend: { position: 'rigth'},
            colors: ['#1b9e77'], // Genel sütun rengi
            hAxis: { 
                title: 'Ay',
                slantedText: false, // Metinlerin düz gösterilmesi
                textStyle: { fontSize: 16}, // Daha küçük font boyutu
            },
            vAxis: { title: 'Uçuş Sayısı' },
            bar: { groupWidth: '75%' },
            animation: {
                startup: true,
                duration: 1000,
                easing: 'out'
            }
        };

        

        const chartContainer = createChartContainer();
        const chart = new google.visualization.ColumnChart(chartContainer);
        chart.draw(dataTable, options);

        // Raporu oluştur ve ekle (chartContainer'ı da geç)
        createReport(yil, maxUcus, minUcus, enFazlaUcusAylar, enDusukUcusAylar, chartContainer);
    }

    // Mevsim bazlı uçuş grafiği
    function drawSeasonalChart(data) {
        if (!data || data.length === 0) {
            grafiklerContainer.innerHTML += '<p>Veri bulunamadı.</p>';
            return;
        }

        const yil = parseInt(yilSelect.value, 10);
        if (isNaN(yil)) {
            grafiklerContainer.innerHTML += '<p>Geçersiz yıl seçimi.</p>';
            return;
        }

        // Mevsim verilerini hazırlama
        const mevsimler = ['Kış', 'İlkbahar', 'Yaz', 'Sonbahar'];
        const mevsimVeri = mevsimler.map(mevsim => {
            const toplam = data.filter(d => d.yil === yil && d.mevsim === mevsim).reduce((sum, d) => sum + d.tahmin_ucus_sayi, 0);
            return { mevsim, toplam };
        });

        // Toplam uçuş sayısını hesapla
        const toplamUcus = mevsimVeri.reduce((sum, m) => sum + m.toplam, 0);

        // En fazla ve en az uçuş yapılan mevsimleri bul
        const maxUcus = Math.max(...mevsimVeri.map(m => m.toplam));
        const minUcus = Math.min(...mevsimVeri.map(m => m.toplam));

        const enFazlaUcusMevsimler = mevsimVeri
            .filter(m => m.toplam === maxUcus)
            .map(m => m.mevsim);

        const enDusukUcusMevsimler = mevsimVeri
            .filter(m => m.toplam === minUcus)
            .map(m => m.mevsim);

        // Veri tablosunu oluştururken stil sütunu ekle
        const dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', 'Mevsim');
        dataTable.addColumn('number', 'Uçuş Sayısı');
        dataTable.addColumn({ type: 'string', role: 'style' }); // Stil sütunu

        mevsimVeri.forEach(({ mevsim, toplam }) => {
            let style = null;
            if (enFazlaUcusMevsimler.includes(mevsim)) {
                // En fazla uçuş sayısına sahip mevsimler için mavi kenarlar ve daha kalın çizgiler
                style = 'stroke-color: blue; stroke-width: 4';
            }
            if (enDusukUcusMevsimler.includes(mevsim)) {
                style = 'stroke-color: red; stroke-width: 4';
            }

            dataTable.addRow([
                mevsim,
                toplam,
                style
            ]);
        });

        const options = {
            title: `İç Hat Mevsimsel Uçuş Tahmin Grafiği (${yil})`,
            legend: { position: 'none' }, // Legend'ı kaldır
            colors: ['#ccff00'], 
            hAxis: { 
                title: 'Mevsim',
                textStyle: { fontSize: 16 }, // Daha küçük font boyutu
            },
            vAxis: { title: 'Uçuş Sayısı' },
            bar: { groupWidth: '50%' }, // Daha dar sütun genişliği
            animation: {
                startup: true,
                duration: 1000,
                easing: 'out'
            }
        };

        const chartContainer = createChartContainer();
        const chart = new google.visualization.ColumnChart(chartContainer);
        chart.draw(dataTable, options);

        // Mevsimsel raporu oluştur ve ekle
        createSeasonalReport(yil, maxUcus, minUcus, enFazlaUcusMevsimler, enDusukUcusMevsimler, chartContainer);
    }

    // Yeni Pasta Grafik Fonksiyonu: Mevsim Bazlı Yolcu Sayısı
    function drawSeasonalPieChart(data) {
        if (!data || data.length === 0) {
            grafiklerContainer.innerHTML += '<p>Yolcu verisi bulunamadı.</p>';
            return;
        }

        const yil = parseInt(yilSelect.value, 10);
        if (isNaN(yil)) {
            grafiklerContainer.innerHTML += '<p>Geçersiz yıl seçimi.</p>';
            return;
        }

        // Mevsim bazlı yolcu verilerini hazırlama
        const mevsimler = ['Kış', 'İlkbahar', 'Yaz', 'Sonbahar'];
        const mevsimYolcuVeri = mevsimler.map(mevsim => {
            const toplamYolcu = data
                .filter(d => d.yil === yil && d.mevsim === mevsim)
                .reduce((sum, d) => sum + (Number(d.tahmin_yolcu_sayi) || 0), 0);
            return { mevsim, toplamYolcu };
        });

        // Toplam yolcu sayısını hesapla
        const toplamYolcu = mevsimYolcuVeri.reduce((sum, m) => sum + m.toplamYolcu, 0);

        if (toplamYolcu === 0) {
            grafiklerContainer.innerHTML += '<p>Seçilen yıl için yolcu verisi bulunamadı.</p>';
            return;
        }

        // Veri tablosunu oluştur
        const dataTable = new google.visualization.DataTable();
        dataTable.addColumn('string', 'Mevsim');
        dataTable.addColumn('number', 'Yolcu Sayısı');

        mevsimYolcuVeri.forEach(({ mevsim, toplamYolcu }) => {
            // Etiketlere yolcu sayılarını ekle
            const label = `${mevsim} (${toplamYolcu})`;
            dataTable.addRow([label, toplamYolcu]);
        });

        const options = {
            title: `İç Hat Mevsimsel Tahmini Yolcu Dağılımı (${yil})`,
            pieHole: 0.4, // Pasta grafiğin içini boşaltmak için (doughnut görünümü)
            legend: { position: 'right', alignment: 'center' },
            chartArea: { width: '80%', height: '80%' },
            slices: {
                0: { color: '#1b9e77' }, // Kış
                1: { color: '#d95f02' }, // İlkbahar
                2: { color: '#7570b3' }, // Yaz
                3: { color: '#e7298a' }  // Sonbahar
            },
            animation: {
                startup: true,
                duration: 1000,
                easing: 'out'
            },
            tooltip: { trigger: 'focus' } // Tooltip'ları etkinleştir
        };

        const chartContainer = createChartContainer();
        const chart = new google.visualization.PieChart(chartContainer);
        chart.draw(dataTable, options);

        // Raporu oluştur ve ekle
        createSeasonalPieReport(yil, mevsimYolcuVeri, chartContainer);
    }


    // Çizgi Grafiği: 2019-2025 Yıllık Uçuş Verileri
    function drawLineChart() {
    fetch('/tahminleme/cizgi_grafik_verileri') // Backend'den veri çek
        .then(response => response.json())
        .then(data => {
            if (!data || data.length === 0) {
                console.error('Çizgi grafiği için veri bulunamadı.');
                grafiklerContainer.innerHTML += '<p>Veri bulunamadı.</p>';
                return;
            }
            data.sort((a, b) => a.yil - b.yil);

            // Google Charts için veri hazırlama
            const chartData = new google.visualization.DataTable();
            chartData.addColumn('string', 'Yıl');
            chartData.addColumn('number', 'Toplam Uçuş Sayısı');
            chartData.addColumn({ type: 'string', role: 'style' }); // Stil sütunu eklendi

            data.forEach(item => {
                // Yıl aralığına göre stil belirle
                const style = (item.yil >= 2019 && item.yil <= 2023) ? 'stroke-color:rgb(0 ,0 ,238); stroke-width: 3;' : 'stroke-color:rgb(238 ,18 ,137); stroke-width: 3;';
                chartData.addRow([String(item.yil), Number(item.toplam_ucus_sayisi), style]);
            });

            // Grafik seçenekleri
            const options = {
                title: 'Geçmiş ve Gelecek yıllara ait Gerçek ve Tahmini Uçuş Sayıları (2019-2025)',
                hAxis: { title: 'Yıl' },
                vAxis: { title: 'Toplam Uçuş Sayısı' },
                curveType: 'function', // Eğri çizgi
                legend: { position: 'bottom' },
                series: {
                    0: { color: '#0000ee' }, // Mavi: 2019-2023
                    1: { color: '#9b59b6' }  // Mor: 2024-2025
                },
                animation: {
                    startup: true,
                    duration: 1000,
                    easing: 'out'
                }
            };

            // Grafik çizimi için container oluştur
            const chartContainer = createChartContainer();
            const chart = new google.visualization.LineChart(chartContainer);
            chart.draw(chartData, options);

            // Raporu oluştur
            createLineChartReport(data, chartContainer);
        })
        .catch(error => {
            console.error('Çizgi grafiği verisini çekerken hata oluştu:', error);
            grafiklerContainer.innerHTML += '<p>Çizgi grafiği yüklenirken hata oluştu.</p>';
        });
}




// Rapor oluşturma fonksiyonu
function createLineChartReport(data, chartContainer) {
    const maxData = data.reduce((max, item) => (item.toplam_ucus_sayisi > max.toplam_ucus_sayisi ? item : max), data[0]);
    const minData = data.reduce((min, item) => (item.toplam_ucus_sayisi < min.toplam_ucus_sayisi ? item : min), data[0]);

    const raporContainer = document.createElement('div');
    raporContainer.className = 'grafikRaporu';

    const raporBaslik = document.createElement('h4');
    raporBaslik.textContent = 'Yıllık Uçuş Grafiği Raporu';
    raporContainer.appendChild(raporBaslik);

    const raporListesi = document.createElement('ul');

    const maxItem = document.createElement('li');
    maxItem.textContent = `${maxData.yil} yılı, en fazla uçuş sayısına sahip yıl (${maxData.toplam_ucus_sayisi} uçuş).`;
    raporListesi.appendChild(maxItem);

    const minItem = document.createElement('li');
    minItem.textContent = `${minData.yil} yılı, en az uçuş sayısına sahip yıl ${minData.toplam_ucus_sayisi} uçuş.`;
    raporListesi.appendChild(minItem);

    const bilgiItem = document.createElement('li');
    bilgiItem.textContent = '2019-2023 verileri gerçek uçuş sayılarıdır. 2024-2025 verileri tahminî uçuş sayılarıdır.';
    raporListesi.appendChild(bilgiItem);

    raporContainer.appendChild(raporListesi);
    chartContainer.appendChild(raporContainer);
}




    // Rapor Oluşturma Fonksiyonu
    function createReport(yil, maxUcus, minUcus, enFazlaUcusAylar, enDusukUcusAylar, chartContainer) {
        // Önceki raporu temizle
        const existingReport = chartContainer.querySelector('.grafikRaporu');
        if (existingReport) {
            existingReport.remove();
        }

        // Rapor container'ını oluştur
        const raporContainer = document.createElement('div');
        raporContainer.className = 'grafikRaporu'; // CSS sınıfını kullan

        // Rapor başlığını ekle
        const raporBaslik = document.createElement('h4');
        raporBaslik.textContent = 'Grafik Raporu';
        raporContainer.appendChild(raporBaslik);

        // Rapor içeriğini <ul> içinde oluştur
        const raporListesi = document.createElement('ul');

        // 1. Madde: En fazla uçuş yapılan aylar
        const raporMadde1 = document.createElement('li');
        const aylarIsimleriStr1 = enFazlaUcusAylar.join(', ');
        raporMadde1.textContent = `${yil} yılında en fazla uçuşun ${maxUcus} uçuş ile ${aylarIsimleriStr1} ayında gerçekleşmesi tahminlenmektedir.`;
        raporListesi.appendChild(raporMadde1);

        // 2. Madde: En az uçuş yapılan aylar
        const raporMadde2 = document.createElement('li');
        const aylarIsimleriStr2 = enDusukUcusAylar.join(', ');
        raporMadde2.textContent = `${yil} yılında en az uçuşun ${minUcus} uçuş ile ${aylarIsimleriStr2} ayında gerçekleşmesi tahminlenmektedir.`;
        raporListesi.appendChild(raporMadde2);

        // 3. Madde: Gelecek uçuş planlaması için öneri
        const raporMadde3 = document.createElement('li');
        raporMadde3.textContent = `${yil} yılı uçuş seferleri planlaması, ${aylarIsimleriStr1} ve ${aylarIsimleriStr2} ayları dikkate alınarak yapılmalıdır.`;
        raporListesi.appendChild(raporMadde3);

        // <ul>'u rapor container'ına ekle
        raporContainer.appendChild(raporListesi);

        // Raporu grafiğin bulunduğu container'a ekle
        chartContainer.appendChild(raporContainer);
    }

    // Mevsimsel Rapor Oluşturma Fonksiyonu
    function createSeasonalReport(yil, maxUcus, minUcus, enFazlaUcusMevsimler, enDusukUcusMevsimler, chartContainer) {
        // Önceki mevsimsel raporu temizle
        const existingReport = chartContainer.querySelector('.mevsimselRaporu');
        if (existingReport) {
            existingReport.remove();
        }

        // Rapor container'ını oluştur
        const raporContainer = document.createElement('div');
        raporContainer.className = 'mevsimselRaporu'; // CSS sınıfını kullan

        // Rapor başlığını ekle
        const raporBaslik = document.createElement('h4');
        raporBaslik.textContent = 'Mevsimsel Grafik Raporu';
        raporContainer.appendChild(raporBaslik);

        // Rapor içeriğini <ul> içinde oluştur
        const raporListesi = document.createElement('ul');

        // 1. Madde: En fazla uçuş yapılan mevsimler
        const raporMadde1 = document.createElement('li');
        const mevsimlerIsimleriStr1 = enFazlaUcusMevsimler.join(', ');
        raporMadde1.textContent = `${yil} yılında en fazla uçuşun ${maxUcus} uçuş ile ${mevsimlerIsimleriStr1} mevsiminde gerçekleşeceği tahminlenmektedir.`;
        raporListesi.appendChild(raporMadde1);

        // 2. Madde: En az uçuş yapılan mevsimler
        const raporMadde2 = document.createElement('li');
        const mevsimlerIsimleriStr2 = enDusukUcusMevsimler.join(', ');
        raporMadde2.textContent = `${yil} yılında en az uçuş ${minUcus} uçuş ile ${mevsimlerIsimleriStr2} mevsiminde gerçekleşeceği tahminlenmektedir.`;
        raporListesi.appendChild(raporMadde2);

        // 3. Madde: Gelecek uçuş planlaması için öneri
        const raporMadde3 = document.createElement('li');
        raporMadde3.textContent = `${yil} yılı uçuş seferleri planlaması, ${mevsimlerIsimleriStr1} ve ${mevsimlerIsimleriStr2} mevsimleri dikkate alınarak yapılmalıdır.`;
        raporListesi.appendChild(raporMadde3);

        // <ul>'u rapor container'ına ekle
        raporContainer.appendChild(raporListesi);

        // Raporu grafiğin bulunduğu container'a ekle
        chartContainer.appendChild(raporContainer);
    }

    // Yeni Pasta Grafik Raporu Oluşturma Fonksiyonu
    function createSeasonalPieReport(yil, mevsimYolcuVeri, chartContainer) {

        const secilenHavalimani = havalimaniSelect.value; // Seçilen havalimanı adını al
        // Önceki raporu temizle
        const existingReport = chartContainer.querySelector('.mevsimselPastaRaporu');
        if (existingReport) {
            existingReport.remove();
        }

        // Rapor container'ını oluştur
        const raporContainer = document.createElement('div');
        raporContainer.className = 'mevsimselPastaRaporu'; // CSS sınıfını kullan

        // Rapor başlığını ekle
        const raporBaslik = document.createElement('h4');
        raporBaslik.textContent = 'Mevsimsel Pasta Grafik Raporu';
        raporContainer.appendChild(raporBaslik);

        // Rapor içeriğini <ul> içinde oluştur
        const raporListesi = document.createElement('ul');

        // En fazla ve en az yolcu sayısına sahip mevsimler
        const sortedMevsimler = mevsimYolcuVeri.slice().sort((a, b) => b.toplamYolcu - a.toplamYolcu);
        const enFazlaYolcuMevsim = sortedMevsimler[0];
        const enAzYolcuMevsim = sortedMevsimler[sortedMevsimler.length - 1];

        // 1. Madde: En fazla yolcu yapılan mevsim
        const raporMadde1 = document.createElement('li');
        raporMadde1.textContent = `${yil} yılı analiz ve tahminlemeleri doğrultusunda ${secilenHavalimani} havalimanının ${enFazlaYolcuMevsim.toplamYolcu} yolcu ile en yüksek ziyaretçisinin ${enFazlaYolcuMevsim.mevsim} mevsiminde olması tahmin edilmektedir.`;
        raporListesi.appendChild(raporMadde1);

        // 2. Madde: En az yolcu yapılan mevsim
        const raporMadde2 = document.createElement('li');
        raporMadde2.textContent = `${yil} yılı analiz ve tahminlemeleri doğrultusunda ${secilenHavalimani} havalimanının ${enAzYolcuMevsim.toplamYolcu} yolcu ile en az ziyaretçisinin ${enAzYolcuMevsim.mevsim} mevsiminde olması tahmin edilmektedir.`;
        raporListesi.appendChild(raporMadde2);

        // 3. Madde: Gelecek yolcu planlaması için öneri
        const raporMadde3 = document.createElement('li');
        raporMadde3.textContent = `${yil} yılı uçuş seferleri ve yolcu planlaması, ${enFazlaYolcuMevsim.mevsim} ve ${enAzYolcuMevsim.mevsim} mevsimleri dikkate alınarak yapılmalıdır.`;
        raporListesi.appendChild(raporMadde3);

        // <ul>'u rapor container'ına ekle
        raporContainer.appendChild(raporListesi);

        // Raporu grafiğin bulunduğu container'a ekle
        chartContainer.appendChild(raporContainer);
        
    }

    // Yıllık grafik raporu
    function createLineChartReport(data, chartContainer) {
        const maxData = data.reduce((max, item) => (item.toplam_ucus_sayisi > max.toplam_ucus_sayisi ? item : max), data[0]);
        const minData = data.reduce((min, item) => (item.toplam_ucus_sayisi < min.toplam_ucus_sayisi ? item : min), data[0]);

        const raporContainer = document.createElement('div');
        raporContainer.className = 'grafikRaporu';

        const raporBaslik = document.createElement('h4');
        raporBaslik.textContent = 'Yıllık Uçuş Grafiği Raporu';
        raporContainer.appendChild(raporBaslik);

        const raporListesi = document.createElement('ul');

        const minItem = document.createElement('li');
        minItem.textContent = `${maxData.yil} Yılında ${maxData.toplam_ucus_sayisi} uçuş ile en yüksek uçuş sayısına ulaşılacağı tahmin edilmektedir.`;
        raporListesi.appendChild(minItem);

        const maxItem = document.createElement('li');
        maxItem.textContent = `${minData.yil} Yılında ise ${minData.toplam_ucus_sayisi} uçuş ile en düşük uçuş sayısı gerçekleşmiştir.`;
        raporListesi.appendChild(maxItem);

        const bilgiItem = document.createElement('li');
        bilgiItem.textContent =`Özel sefer planlamaları çerçevesinde grafikteki tüm yıllar, özellikle ${maxData.yil} ve ${minData.yil} verileri dikkate alınmalıdır.` ;
        raporListesi.appendChild(bilgiItem,maxData.yil,minData.yil);

        raporContainer.appendChild(raporListesi);
        chartContainer.appendChild(raporContainer);
    }


    
});
