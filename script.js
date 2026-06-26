document.addEventListener('DOMContentLoaded', () => {
    // Анимация при скролле (Intersection Observer)
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in-up');
    fadeElements.forEach(el => observer.observe(el));

    // Простой мобильный бургер меню
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            nav.classList.toggle('nav-open');
            mobileBtn.classList.toggle('is-active');
        });
    }

    // Изменение хедера при скролле
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // Плавный скролл для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Закрываем мобильное меню при клике
                if (nav.classList.contains('nav-open')) {
                    nav.classList.remove('nav-open');
                    mobileBtn.classList.remove('is-active');
                }
            }
        });
    });

    // --- Parallax Background Animations ---
    const bgGraphics = document.getElementById('bg-graphics');
    if (bgGraphics) {
        const shapes = bgGraphics.querySelectorAll('.shape');

        // Массив множителей скорости для каждой фигуры
        const speeds = [0.03, 0.05, 0.02, 0.06, 0.01];

        // Эффект мыши
        let mouseX = 0;
        let mouseY = 0;
        let couseX = 0;
        let couseY = 0;

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX - window.innerWidth / 2;
            mouseY = e.clientY - window.innerHeight / 2;
        });

        const animateParallax = () => {
            couseX += (mouseX - couseX) * 0.1;
            couseY += (mouseY - couseY) * 0.1;

            shapes.forEach((shape, index) => {
                const speed = speeds[index] || 0.03;
                const x = (couseX * speed).toFixed(2);
                const y = (couseY * speed).toFixed(2);
                shape.style.transform = `translate(${x}px, ${y}px)`;
            });

            requestAnimationFrame(animateParallax);
        };

        // Запуск анимации для мыши если мы не на смартфоне
        if (window.innerWidth > 768) {
            animateParallax();
        }

        // Эффект плавного параллакса при скролле
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            shapes.forEach((shape, index) => {
                const speed = speeds[index] * 1.5;
                const yPos = -(scrolled * speed);
                // Комбинируем transform (нужно аккуратно если mouse parallax тоже работает)
                if (window.innerWidth <= 768) {
                    shape.style.transform = `translateY(${yPos}px)`;
                }
                // Если десктоп, то скролл эффект применяется через margin для независимости или тоже transform. 
                // Остановимся на простом - сдвигаем весь контейнер
            });

            // Простой параллакс всего контейнера 
            bgGraphics.style.transform = `translateY(${scrolled * 0.15}px)`;
        });
    }
});

// Аккордеон FAQ
const faqQuestions = document.querySelectorAll('.faq-question');
faqQuestions.forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;

        // Если нужно чтобы открыт был только один
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(faq => {
            faq.classList.remove('active');
        });

        if (!isActive) {
            item.classList.add('active');
        }
    });
});

// Фильтрация программ обучения (Слайдер)
const filterBtns = document.querySelectorAll('.filter-btn');
const programCards = document.querySelectorAll('.program-card');

// Инициализируем фильтр при загрузке (если есть активный)
if (programCards.length > 0 && filterBtns.length > 0) {
    const activeBtn = document.querySelector('.filter-btn.active');
    if (activeBtn) {
        const initialCat = activeBtn.getAttribute('data-filter');
        programCards.forEach(card => {
            if (initialCat === 'all' || card.getAttribute('data-category') === initialCat) {
                card.style.display = ''; // Allow CSS to control display
            } else {
                card.style.display = 'none';
            }
        });
    }

    // Обработка клика по кнопкам фильтра
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            programCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = ''; // Allow CSS to control display
                    card.style.opacity = '0';
                    setTimeout(() => card.style.opacity = '1', 50);
                } else {
                    card.style.display = 'none';
                }
            });

            // Скроллим слайдер обратно в начало
            const slider = document.getElementById('programsSlider');
            if (slider) {
                slider.scrollTo({ left: 0, behavior: 'smooth' });
            }
        });
    });

    // --- Slider Scroll Hint (Peek Animation) ---
    const slider = document.getElementById('programsSlider');
    if (slider) {
        const scrollHintObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    if (slider.scrollWidth > slider.clientWidth) {
                        setTimeout(() => {
                            // Отключаем на время привязку (snap), чтобы анимация была плавной
                            slider.style.scrollSnapType = 'none';
                            
                            slider.scrollTo({ left: 120, behavior: 'smooth' });
                            
                            setTimeout(() => {
                                slider.scrollTo({ left: 0, behavior: 'smooth' });
                                
                                // Возвращаем snap после завершения
                                setTimeout(() => {
                                    slider.style.scrollSnapType = '';
                                }, 600);
                            }, 800);
                        }, 1200);
                    }
                    scrollHintObserver.unobserve(slider);
                }
            });
        }, { threshold: 0.1 });
        scrollHintObserver.observe(slider);
    }
}

// Floating Video Widget & Modal Logic
document.addEventListener('DOMContentLoaded', () => {
    /* Floating Video Widget & Modal Logic - DISABLED
    const videoWidget = document.getElementById('floatingVideoWidget');
    const closeVideoBtn = document.getElementById('closeFloatingVideo');
    const promoVideo = document.getElementById('promoVideo');
    const leadModal = document.getElementById('leadModal');
    const closeLeadModal = document.getElementById('closeLeadModal');
    const leadForm = document.getElementById('leadForm');

    let modalShown = false;
    let widgetDismissed = sessionStorage.getItem('promoVideoDismissed') === 'true';

    // Show widget when scrolling down a bit, if not dismissed
    if (videoWidget && !widgetDismissed) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300 && !widgetDismissed) {
                videoWidget.classList.add('show');
            } else if (window.scrollY <= 300) {
                videoWidget.classList.remove('show');
            }
        });
    }

    if (promoVideo) {
        promoVideo.addEventListener('timeupdate', () => {
            // Check if video reached 20 seconds and modal hasn't been shown yet
            if (promoVideo.currentTime >= 20 && !modalShown && !widgetDismissed) {
                if (leadModal) {
                    leadModal.classList.add('show');
                    promoVideo.pause(); // Pause video when modal opens
                    modalShown = true; // Prevents modal from popping up again
                }
            }
        });

        promoVideo.addEventListener('ended', () => {
            closeWidget();
        });
    }

    function closeWidget() {
        if (videoWidget) {
            videoWidget.classList.remove('show');
            if (promoVideo) promoVideo.pause();
            widgetDismissed = true;
            sessionStorage.setItem('promoVideoDismissed', 'true');
        }
    }

    if (closeVideoBtn) {
        closeVideoBtn.addEventListener('click', closeWidget);
    }

    if (closeLeadModal) {
        closeLeadModal.addEventListener('click', () => {
            if (leadModal) leadModal.classList.remove('show');
        });
    }

    // Close modal on outside click
    if (leadModal) {
        leadModal.addEventListener('click', (e) => {
            if (e.target === leadModal) {
                leadModal.classList.remove('show');
            }
        });
    }

    if (leadForm) {
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            window.open('https://t.me/TatyBondar', '_blank');
            if (leadModal) leadModal.classList.remove('show');
            leadForm.reset();
            closeWidget();
        });
    }
    */
    // Certificates Slider Logic
    const certSlider = document.getElementById('certificatesSlider');
    const certPrev = document.getElementById('certPrev');
    const certNext = document.getElementById('certNext');

    if (certSlider && certPrev && certNext) {
        const scrollAmount = 350; // cert-card width + gap

        certNext.addEventListener('click', () => {
            certSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        certPrev.addEventListener('click', () => {
            certSlider.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Click on image to open in full size
        certSlider.querySelectorAll('img').forEach(img => {
            img.addEventListener('click', () => {
                window.open(img.src, '_blank');
            });
        });
    }

    // Community Video Modal Logic
    const communityVideoModal = document.getElementById('communityVideoModal');
    const communityVideo = document.getElementById('communityVideo');
    const closeCommunityVideo = document.getElementById('closeCommunityVideo');
    const videoMockups = document.querySelectorAll('.video-mockup');

    if (communityVideoModal && communityVideo && closeCommunityVideo) {
        videoMockups.forEach(mockup => {
            mockup.addEventListener('click', () => {
                const videoSrc = mockup.getAttribute('data-video');
                if (videoSrc) {
                    communityVideo.src = videoSrc;
                    communityVideoModal.classList.add('show');
                    communityVideo.play();
                }
            });
        });

        const closeGalleryModal = () => {
            communityVideoModal.classList.remove('show');
            communityVideo.pause();
            communityVideo.src = "";
        };

        closeCommunityVideo.addEventListener('click', closeGalleryModal);

        communityVideoModal.addEventListener('click', (e) => {
            if (e.target === communityVideoModal) {
                closeGalleryModal();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && communityVideoModal.classList.contains('show')) {
                closeGalleryModal();
            }
        });
    }
});

// --- Календарь мероприятий ---
const calendarEvents = [
    { start: '2026-03-27', end: '2026-03-29', title: '6 поток Висцеральные Остеопатические Технологии', target: 'osteocorrection.html', program: 'Специалист Остеокоррекции', shortTitle: 'Висцеральные' },
    { start: '2026-04-24', end: '2026-04-26', title: '6 поток Биомеханические Остеопатические Технологии', target: 'osteocorrection.html', program: 'Специалист Остеокоррекции', shortTitle: 'Биомеханика' },
    { start: '2026-05-22', end: '2026-05-24', title: '6 поток Краниосакральные технологии', target: 'osteocorrection.html', program: 'Специалист Остеокоррекции', shortTitle: 'Краниа' },
    { start: '2026-07-11', end: '2026-07-12', title: 'Экзамен 6 поток', target: 'osteocorrection.html', program: 'Специалист Остеокоррекции', shortTitle: 'Экзамен', promo: false },
    { start: '2026-10-10', end: '2026-10-11', title: 'Конференция «Секреты фасции»', target: 'osteocorrection.html', program: 'Специалист Остеокоррекции', shortTitle: 'Конфа' },
    { start: '2025-10-30', end: '2025-11-01', title: 'Диссекция «Жир и фасции — скрытая механика боли и старения»', target: 'osteocorrection.html', program: 'Специалист Остеокоррекции', shortTitle: 'Диссекция' },
    // Семинар по психосоматике
    { start: '2026-07-24', end: '2026-07-26', title: 'Семинар по психосоматике', target: 'психосоматика/psycho-preview.html', program: 'Психосоматика', shortTitle: 'Психосоматика' },
    // 7 поток «Специалист Остеокоррекции»
    { start: '2026-09-04', end: '2026-09-06', title: '7 поток Базовые Остеопатические Технологии', target: 'osteocorrection.html', program: 'Специалист Остеокоррекции', shortTitle: 'Базовые ОТ' },
    { start: '2026-10-02', end: '2026-10-04', title: '7 поток Висцеральные Остеопатические Технологии', target: 'osteocorrection.html', program: 'Специалист Остеокоррекции', shortTitle: 'Висцеральные ОТ' },
    { start: '2026-10-30', end: '2026-11-01', title: '7 поток Биомеханические Остеопатические Технологии', target: 'osteocorrection.html', program: 'Специалист Остеокоррекции', shortTitle: 'Биомеханические ОТ' },
    { start: '2026-12-04', end: '2026-12-06', title: '7 поток Краниосакральные Остеопатические Технологии', target: 'osteocorrection.html', program: 'Специалист Остеокоррекции', shortTitle: 'Краниосакральные ОТ' },
    // Биодинамика
    { start: '2026-09-11', end: '2026-09-13', title: 'Биодинамика опорно-двигательной системы', target: 'биодинамика/biodynamic.html', program: 'Биодинамика', shortTitle: 'Биодинамика ОДС' },
    { start: '2026-10-16', end: '2026-10-18', title: 'Биодинамика висцеральной системы', target: 'биодинамика/biodynamic.html', program: 'Биодинамика', shortTitle: 'Биодинамика висцеральной системы' },
    { start: '2026-11-13', end: '2026-11-15', title: 'Биодинамика систем регуляции', target: 'биодинамика/biodynamic.html', program: 'Биодинамика', shortTitle: 'Биодинамика систем регуляции' },
    { start: '2026-12-11', end: '2026-12-13', title: 'Биодинамика полевых процессов', target: 'биодинамика/biodynamic.html', program: 'Биодинамика', shortTitle: 'Биодинамика полевых процессов' }
];

function initCalendar() {
    const calendarDays = document.getElementById('calendarDays');
    const currentMonthYear = document.getElementById('currentMonthYear');
    const prevMonthBtn = document.getElementById('prevMonth');
    const nextMonthBtn = document.getElementById('nextMonth');
    const eventDetails = document.getElementById('eventDetails');

    if (!calendarDays) return;

    // Открываем календарь на текущем месяце (на момент захода на сайт)
    let currentDate = new Date();
    currentDate.setDate(1);

    const monthNames = [
        "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
    ];

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        if (currentMonthYear) {
            currentMonthYear.innerText = `${monthNames[month]} ${year}`;
        }

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Корректировка для Пн (0) - Вс (6)
        let startingDay = firstDay === 0 ? 6 : firstDay - 1;

        for (let i = 0; i < startingDay; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.classList.add('calendar-day', 'empty');
            calendarDays.appendChild(emptyDay);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const dayElement = document.createElement('div');
            dayElement.classList.add('calendar-day');
            
            const dayNumber = document.createElement('span');
            dayNumber.classList.add('day-number');
            dayNumber.innerText = i;
            dayElement.appendChild(dayNumber);

            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
            const dayEvents = calendarEvents.filter(e => {
                const start = e.start;
                const end = e.end || e.start;
                return dateStr >= start && dateStr <= end;
            });

            if (dayEvents.length > 0) {
                dayElement.classList.add('has-event');
                
                // Добавляем полное описание (только для первого события если их несколько)
                const eventLabel = document.createElement('span');
                eventLabel.classList.add('event-label');
                eventLabel.innerText = dayEvents[0].title;
                dayElement.appendChild(eventLabel);

                dayElement.addEventListener('click', () => showEventDetails(dayEvents, dayElement));
            }

            // Добавляем класс today если совпадает (для сегодняшней даты, если она в этом месяце)
            const today = new Date();
            if (year === today.getFullYear() && month === today.getMonth() && i === today.getDate()) {
                dayElement.classList.add('today');
            }

            calendarDays.appendChild(dayElement);
        }
    }

    function showEventDetails(events, element) {
        // Убираем выделение со всех дней
        document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
        element.classList.add('selected');

        eventDetails.innerHTML = '';
        events.forEach(event => {
            const card = document.createElement('div');
            card.classList.add('event-details-card');
            card.innerHTML = `
                <h4>${event.title}</h4>
                <p><strong>Программа:</strong> ${event.program}</p>
                <p><strong>Даты:</strong> ${formatDateRange(event.start, event.end)}</p>
                <div class="card-actions">
                    <a href="${event.target}" class="btn btn-primary btn-sm scroll-to-product">Узнать подробнее / Забронировать</a>
                </div>
            `;
            
            // Плавный скролл для якорей на этой странице; обычный переход для ссылок на другие страницы
            card.querySelector('.scroll-to-product').addEventListener('click', (e) => {
                if (!event.target.startsWith('#')) {
                    return; // внешняя/другая страница — переходим по ссылке
                }
                e.preventDefault();
                const targetEl = document.querySelector(event.target);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetEl.classList.add('highlight-flash');
                    setTimeout(() => targetEl.classList.remove('highlight-flash'), 2000);
                }
            });
            
            eventDetails.appendChild(card);
        });
    }

    function formatDateRange(start, end) {
        if (!end || start === end) {
            const d = new Date(start);
            return `${d.getDate()} ${monthNames[d.getMonth()]}`;
        }
        const s = new Date(start);
        const e = new Date(end);
        if (s.getMonth() === e.getMonth()) {
            return `${s.getDate()} - ${e.getDate()} ${monthNames[s.getMonth()]}`;
        }
        return `${s.getDate()} ${monthNames[s.getMonth()]} - ${e.getDate()} ${monthNames[e.getMonth()]}`;
    }

    if (prevMonthBtn) {
        prevMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar();
            eventDetails.innerHTML = '<p class="no-events">Выберите дату с отметкой, чтобы увидеть детали</p>';
        });
    }

    if (nextMonthBtn) {
        nextMonthBtn.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar();
            eventDetails.innerHTML = '<p class="no-events">Выберите дату с отметкой, чтобы увидеть детали</p>';
        });
    }

    renderCalendar();
}

// Запуск инициализации если мы на странице программ
if (document.getElementById('calendar')) {
    initCalendar();
}

// --- Блок «Ближайшие мероприятия» (автозаполнение из calendarEvents) ---
function renderUpcomingEvents() {
    const list = document.getElementById('upcomingEventsList');
    if (!list) return;

    const monthGen = ["января", "февраля", "марта", "апреля", "мая", "июня",
        "июля", "августа", "сентября", "октября", "ноября", "декабря"];
    const monthShort = ["ЯНВ", "ФЕВ", "МАР", "АПР", "МАЙ", "ИЮН",
        "ИЮЛ", "АВГ", "СЕН", "ОКТ", "НОЯ", "ДЕК"];
    const LIMIT = 3;

    // Сегодняшняя дата в формате YYYY-MM-DD (для сравнения со строковыми датами событий)
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const upcoming = calendarEvents
        .filter(e => e.promo !== false)            // исключаем служебные события (например, экзамен)
        .filter(e => (e.end || e.start) >= todayStr) // ещё не прошедшие
        .sort((a, b) => a.start.localeCompare(b.start))
        .slice(0, LIMIT);

    function badge(start, end) {
        const s = start.split('-'), e = (end || start).split('-');
        const sD = +s[2], sM = +s[1] - 1, eD = +e[2], eM = +e[1] - 1;
        if (start === (end || start)) return { day: `${sD}`, month: monthGen[sM].toUpperCase() };
        if (sM === eM) return { day: `${sD}-${eD}`, month: monthGen[sM].toUpperCase() };
        return { day: `${sD}-${eD}`, month: `${monthShort[sM]}/${monthShort[eM]}` };
    }

    // Краткие теги (формат / для кого). Можно задать в событии (format, audience),
    // иначе подставляются значения по типу программы.
    function metaTags(ev) {
        const defaults = {
            'Биодинамика': { format: 'Очно / Онлайн', audience: 'Для остеопатов и практиков' },
            'Психосоматика': { format: 'Онлайн', audience: 'Для специалистов и для себя' }
        };
        const def = defaults[ev.program] || { format: 'Очно / Онлайн', audience: 'Для специалистов' };
        return [ev.format || def.format, ev.audience || def.audience].filter(Boolean);
    }

    if (upcoming.length === 0) {
        list.innerHTML = '<p class="no-events">Ближайшие мероприятия скоро появятся.</p>';
        return;
    }

    list.innerHTML = upcoming.map((ev, i) => {
        const b = badge(ev.start, ev.end);
        return `
            <div class="event-row fade-in-up delay-${i + 2}">
                <div class="event-date">
                    <span class="day${b.day.includes('-') ? ' day--range' : ''}">${b.day}</span>
                    <span class="month">${b.month}</span>
                </div>
                <div class="event-info">
                    <h4>${ev.program}</h4>
                    <p>${ev.title}</p>
                    <div class="event-tags">
                        ${metaTags(ev).map(t => `<span>${t}</span>`).join('')}
                    </div>
                </div>
                <div class="event-action">
                    <a href="${ev.target}" class="btn btn-secondary btn-sm">Записаться</a>
                </div>
            </div>`;
    }).join('');
}

renderUpcomingEvents();

// --- Модалки «Узнать стоимость» (виджеты GetCourse) ---
window.gcOpen = function (id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('is-open');
    document.body.style.overflow = 'hidden';
};
(function () {
    function closeModal(m) {
        m.classList.remove('is-open');
        document.body.style.overflow = '';
    }
    document.addEventListener('click', function (e) {
        const t = e.target;
        if (t.hasAttribute('data-gc-close') || t.classList.contains('gc-modal__overlay')) {
            const m = t.closest('.gc-modal');
            if (m) closeModal(m);
        }
    });
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            document.querySelectorAll('.gc-modal.is-open').forEach(closeModal);
        }
    });
})();
