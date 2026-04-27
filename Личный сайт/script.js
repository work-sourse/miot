// Header shadow on scroll
const header = document.getElementById('header');
const onScroll = () => {
    if (window.scrollY > 8) header.classList.add('is-scrolled');
    else header.classList.remove('is-scrolled');
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile menu
const burger = document.getElementById('burger');
const nav = document.getElementById('nav');
burger.addEventListener('click', () => {
    const open = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', String(open));
});

// Close mobile menu on link click
nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
        if (nav.classList.contains('is-open')) {
            nav.classList.remove('is-open');
            burger.classList.remove('is-open');
            burger.setAttribute('aria-expanded', 'false');
        }
    });
});

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Diplomas lightbox
const diplomas = [
    { src: 'images/diplomas/01-sechenov-residency.jpg', caption: 'Диплом об окончании ординатуры — Первый МГМУ им. И.М. Сеченова, специальность «Остеопатия»' },
    { src: 'images/diplomas/08-sechenov-appendix.jpg', caption: 'Приложение к диплому ординатуры (Сеченовский университет)' },
    { src: 'images/diplomas/02-sechenov-certificate.jpg', caption: 'Сертификат специалиста государственного образца — Остеопатия' },
    { src: 'images/diplomas/03-rudn.jpg', caption: 'Диплом РУДН — Врач по специальности «Лечебное дело»' },
    { src: 'images/diplomas/09-rudn-appendix-1.jpg', caption: 'Приложение к диплому РУДН — сведения об обладателе' },
    { src: 'images/diplomas/10-rudn-appendix-2.jpg', caption: 'Приложение к диплому РУДН — дисциплины и оценки' },
    { src: 'images/diplomas/11-rudn-appendix-3.jpg', caption: 'Приложение к диплому РУДН — практика и итоговая аттестация' },
    { src: 'images/diplomas/12-accreditation.jpg', caption: 'Свидетельство об аккредитации специалиста' },
    { src: 'images/diplomas/13-specialist-certificate.jpg', caption: 'Сертификат специалиста' },
    { src: 'images/diplomas/04-metavitonika-diploma.png', caption: 'Диплом о профессиональной переподготовке — Институт остеопатии и метавитоники Э.М. Нейматова' },
    { src: 'images/diplomas/14-metavitonika-fundamental.jpg', caption: 'Свидетельство — Метавитоника, фундаментальный уровень' },
    { src: 'images/diplomas/15-metavitonika-info-fluid.png', caption: 'Сертификат METAVITONICA — «Информационно-флюидическое единство»' },
    { src: 'images/diplomas/16-metavitonika-metamassage.png', caption: 'Сертификат METAVITONICA — «Метамассаж», базовый уровень' },
    { src: 'images/diplomas/17-metavitonika-tissue.jpg', caption: 'Сертификат METAVITONICA — «Тканевой подход»' },
    { src: 'images/diplomas/05-metavitonika-visceral.jpg', caption: 'Сертификат METAVITONICA — «Висцеральное единство»' },
    { src: 'images/diplomas/18-metavitonika-face.jpg', caption: 'Сертификат METAVITONICA — «Эстетическая мануальная коррекция лица»' },
    { src: 'images/diplomas/06-vignon-poumons.jpg', caption: 'Certificat de Formation — «Les poumons en Ostéopathie», Nicolas Vignon (FR)' },
    { src: 'images/diplomas/19-vignon-diaphragme.jpg', caption: 'Certificat de Formation — «Le diaphragme en Ostéopathie», Nicolas Vignon (FR)' },
    { src: 'images/diplomas/20-vignon-pericarde.jpg', caption: 'Certificat de Formation — «Le péricarde en Ostéopathie», Nicolas Vignon (FR)' },
    { src: 'images/diplomas/21-vignon-cou.jpg', caption: 'Certificat de Formation — «Le cou en Ostéopathie», Nicolas Vignon (FR)' },
    { src: 'images/diplomas/07-vignon-urogenital.jpg', caption: 'Certificat de Formation — «Ostéopathie Urogénitale 2», Nicolas Vignon (FR)' },
    { src: 'images/diplomas/22-fmt-basic.jpg', caption: 'RockTape FMT Basic + Performance — Moscow, 2018' },
    { src: 'images/diplomas/23-fmt-screen.jpg', caption: 'RockTape FMT Screen + Movability — Moscow, 2018' }
];

const lightbox = document.getElementById('lightbox');
if (lightbox) {
    const lbImg = document.getElementById('lightboxImg');
    const lbCaption = document.getElementById('lightboxCaption');
    const lbClose = document.getElementById('lightboxClose');
    const lbPrev = document.getElementById('lightboxPrev');
    const lbNext = document.getElementById('lightboxNext');
    const lbThumbs = document.getElementById('lightboxThumbs');
    const allBtn = document.getElementById('diplomasAll');
    let current = 0;

    // Build thumbnails
    diplomas.forEach((d, i) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'lightbox__thumb';
        b.dataset.index = String(i);
        b.setAttribute('aria-label', d.caption);
        const img = document.createElement('img');
        img.src = d.src;
        img.alt = '';
        img.loading = 'lazy';
        b.appendChild(img);
        b.addEventListener('click', () => show(i));
        lbThumbs.appendChild(b);
    });

    const show = (i) => {
        current = (i + diplomas.length) % diplomas.length;
        const d = diplomas[current];
        lbImg.src = d.src;
        lbImg.alt = d.caption;
        lbCaption.textContent = d.caption;
        lbThumbs.querySelectorAll('.lightbox__thumb').forEach((el, idx) => {
            el.classList.toggle('is-active', idx === current);
        });
        const active = lbThumbs.querySelector('.lightbox__thumb.is-active');
        if (active) active.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    };

    const open = (i) => {
        show(i);
        lightbox.classList.add('is-open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lightbox-open');
    };

    const close = () => {
        lightbox.classList.remove('is-open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lightbox-open');
    };

    document.querySelectorAll('.diploma[data-diploma-index]').forEach(btn => {
        btn.addEventListener('click', () => {
            const i = parseInt(btn.dataset.diplomaIndex, 10) || 0;
            open(i);
        });
    });

    if (allBtn) allBtn.addEventListener('click', () => open(0));

    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', () => show(current - 1));
    lbNext.addEventListener('click', () => show(current + 1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) close();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') show(current - 1);
        else if (e.key === 'ArrowRight') show(current + 1);
    });
}
