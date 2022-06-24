// Uygulama ilk defa mı kullanılıyor yoksa kurulum önceden yapılmış mı
function installControle() {
    return localStorage.getItem('MX_APP_CONFIG') === null ? false : true;
}

function create(options) {
    /*
    Örnek kullanım:
    create({
        el: 'div',

        class: '', // Elementimize eklemek istediğimiz classlar.
        class: [
            'class-1',
            'class-2'
        ], // Elementimize eklemek istediğimiz classlar.

        parent: '', // Hangi elementin içerisine eklenecek -> querySelector()
        content: '', // İçerik ekleyebiliriz. (Html destekler)
    });
    */
    let createElement = document.createElement(options.el ?? 'div');
    let classes = options.class !== undefined ? (typeof(options.class === 'object') ? options.class : options.class.split(' ')) : '';
    createElement.classList.add(...classes);
    createElement.innerHTML = options.content ?? null;
    document.querySelector(options.parent).append(createElement);
    return createElement;
}

// create({
//     el: 'span',
//     class: [
//         'deneme',
//         'deneme-text'
//     ],
//     parent: '#app',
//     content: 'İçerik',
// })

// Uygulama ayarlarını kontrol etme
function mxApp(controle) {
    let app = document.querySelector('#app');
    if (controle) {
        app.style.justifyContent = 'center';
    } else {


        // NAV
        let nav = document.createElement('nav');

        let navDiv1 = document.createElement('div');
        let settingsButton = document.createElement('button');
        settingsButton.setAttribute('tabindex', '3');
        settingsButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9.11011V14.8801C3 17.0001 3 17.0001 5 18.3501L10.5 21.5301C11.33 22.0101 12.68 22.0101 13.5 21.5301L19 18.3501C21 17.0001 21 17.0001 21 14.8901V9.11011C21 7.00011 21 7.00011 19 5.65011L13.5 2.47011C12.68 1.99011 11.33 1.99011 10.5 2.47011L5 5.65011C3 7.00011 3 7.00011 3 9.11011Z"stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z"stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>`;

        navDiv1.append(settingsButton);

        let navDiv2 = document.createElement('div');

        let navDiv3 = document.createElement('div');
        let weather = document.createElement('div');
        let weatherHeader = document.createElement('div');
        let weatherIcon = document.createElement('div');
        let derege = document.createElement('div');
        let weatherDerege = document.createElement('div');
        let weatherUnit = document.createElement('div');
        let location = document.createElement('div');
        weather.classList.add('weather');
        weatherHeader.classList.add('weather-header');
        weatherIcon.classList.add('weather-icon');
        derege.classList.add('derege');
        weatherDerege.classList.add('weather-derege');
        weatherUnit.classList.add('weather-unit');
        location.classList.add('location');

        location.innerHTML = `Mersin TR`;
        weatherDerege.innerHTML = `27&deg;`;
        weatherUnit.innerHTML = `C`;

        derege.append(weatherDerege);
        derege.append(weatherUnit);

        weatherIcon.style.backgroundImage = `url("data:image/png;base64,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")`

        weatherHeader.append(weatherIcon);
        weatherHeader.append(derege);

        weather.append(weatherHeader);
        weather.append(location);

        navDiv3.append(weather);

        nav.append(navDiv1);
        nav.append(navDiv2);
        nav.append(navDiv3);

        app.append(nav);

        // MAIN
        let main = document.createElement('main');

        // Tabs
        let tabs = document.createElement('div');
        let tabsLinks = [
            {
                name: "Sizin için",
                class: "active"
            }
        ];
        tabs.classList.add('tabs');
        tabs.innerHTML = null;
        for (let tabsLink in tabsLinks) {
            tabs.innerHTML += `<a ${tabsLinks[tabsLink].class !== undefined ? 'class="active"' : ''}>${tabsLinks[tabsLink].name}</a>`;
        }

        // Time
        let time = document.createElement('div');
        time.classList.add('time');
        time.innerHTML = `16:13`;

        // Blockquote
        let blockquote = document.createElement('div');
        let blockquoteDvider = document.createElement('div');
        let blockquoteText = document.createElement('div');

        blockquote.classList.add('blockquote');
        blockquoteDvider.classList.add('blockquote-dvider');
        blockquoteText.classList.add('blockquote-text');

        blockquote.append(blockquoteDvider);
        blockquote.append(blockquoteText);

        // Search
        let search = document.createElement('div');
        let input = document.createElement('input');
        let searchButton = document.createElement('button');

        search.classList.add('search');
        input.setAttribute('placeholder', `Google'da Ara...`);
        input.setAttribute('tabindex', '1');
        searchButton.setAttribute('tabindex', '2');
        searchButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M22 22L20 20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

        search.append(input);
        search.append(searchButton);

        main.append(tabs);
        main.append(time);
        main.append(blockquote);
        main.append(search);

        // Elementleri App içerisine yükleyelim
        app.append(nav);
        app.append(main);

        //console.log(JSON.parse(localStorage.getItem('MX_APP_CONFIG')));
    }
}

// Tarayıcının yüksekliğini hesaplama
function appHeight() {
    const e = document.documentElement;
    e.style.setProperty("--vh", .01 * window.innerHeight + "px")
}

window.addEventListener("resize", appHeight), appHeight();
document.addEventListener('DOMContentLoaded', function (e) {
    // Döküman hazır olduktan sonra yapılacak işlemler
    mxApp(installControle());
})