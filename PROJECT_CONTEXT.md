# PROJECT CONTEXT: MIOT (antiG)
# DATE: 2026-04-20
# FOCUS: AI Handoff / Device Transfer

## 1. PROJECT OVERVIEW
- **Product**: MIOT (International Institute of Osteopathy and Telehealth).
- **Type**: Professional educational portal for osteopathy and wellness.
- **Tech Stack**: Static HTML5, CSS3 (Vanilla), JavaScript (ES6). No framework.
- **Architecture**: Multi-page site with deep-linked course subdirectories.

## 2. RECENT ACTIVITY (Last 24h)
- **Current Task**: finalized `about.html` enhancements.
- **Changes**: 
  - Updated session booking links to new platform.
  - Redesigned "Expert" section with dual column layout (Call to Action buttons added).
  - Integrated student video review section for social proof.
- **Last Commit**: `ec11911` - "Update about.html: update session link, add buttons to right column, and include video reviews".

## 3. CORE FILE MAP
- `/index.html`: Main landing page (Core funnel).
- `/about.html`: Expert profile and session booking.
- `/style.css`: Global styles (Large, includes responsive layout).
- `/script.js`: Global interactivity (Sliders, FAQ toggles).
- `/kak-stat-osteopatom-obuchenie-s-nulya/`: Specific course portal for beginners.
- `/kursy-osteopatii-online/`: Courses catalog.
- `/student_video_cases/`: Dir containing student success stories.

## 4. DESIGN SYSTEM
- **Colors**: Premium palette (Gold/Beige tones, Sleek dark modes in specific sections).
- **Typography**: Likely Inter/Roboto or custom hosted fonts.
- **Key Components**: Horizontal sliders, FAQ accordions, Video embeds (local & YouTube).

## 5. TO-DO / NEXT STEPS
- [ ] **Verify Responsive**: Check `about.html` video reviews on mobile.
- [ ] **Link Audit**: Ensure all legacy session links on secondary pages are updated.
- [ ] **Performance**: Consider optimizing images in `/student_video_cases` (currently heavy).
- [ ] **SEO**: Finalize meta descriptions for the "How to become an osteopath" sub-pages.

## 6. AI BOOTSTRAP COMMANDS
- "Show me the latest changes in style.css related to about.html"
- "Audit all booking links across programs.html"
- "Summarize the structure of the 'kak-stat' folder"

## LATEST GIT HISTORY (Automatic)
ec11911 Update about.html: update session link, add buttons to right column, and include video reviews
bb62c56 Remove prices and update module titles
91115cf Update website: integrate recent changes and optimizations across various pages
5e4cf26 Create CNAME
53accdc Update site: reorder courses, refine messaging, and add slider nudge animation

## CURRENT MODIFICATIONS
?? PROJECT_CONTEXT.md
?? prepare_transfer.sh

## 7. Расписание: версии и правила (2026-11-23)

- `raspisanie.html` — версия для сотрудников. Содержит чаты, таблицы участников и вкладку «Ссылки на все сайты».
- `raspisanie-studentam.html` — отдельная версия для учеников. Сохраняет мероприятия, поиск, фильтры, оформление и ссылки на сайты мероприятий.
- В ученической версии запрещены ссылки на чаты Telegram и MAX, таблицы со списками учеников и каталог всех сайтов. Удалять эти данные из HTML и JavaScript полностью, включая скрытые разделы и свойства мероприятий.
- Обе версии сохраняют `noindex, nofollow`; не добавлять их в публичную навигацию или карту сайта без прямого указания пользователя.
- После правок мероприятий, поиска, фильтров или оформления запускать `python3 scripts/build-student-schedule.py` из `antiG`, проверять обе версии и включать обновлённую ученическую страницу в тот же коммит. Скрипт берёт текущую страницу сотрудников и создаёт очищенную статическую копию; вручную ученическую копию не редактировать.
- При изменении ссылок на чаты или таблицы обновлять только версию для сотрудников. Проверять, что после генерации эти ссылки отсутствуют в исходнике ученической страницы.
- В версии для сотрудников есть экран входа с проверкой пароля в браузере. Это не серверная защита: исходный HTML и прежние версии могут быть доступны. При обновлении сохранять форму входа; генератор удаляет её из версии для учеников.
- В ученической версии есть отдельный раздел «Для себя» с четырьмя программами и ссылками из `programs.html`. Его содержимое и вкладки задаются в `scripts/build-student-schedule.py`, чтобы сохраняться при пересборке расписания. Обновляя программы, сверять названия и ссылки с `programs.html`.

- `raspisanie-renata.html` — копия расписания для учеников Ренаты. Все ссылки на программы передают `utm_source=Renata`; адрес для распространения: `https://dr-agape.ru/raspisanie-renata.html?utm_source=Renata`. Копия автоматически пересоздаётся при запуске `scripts/build-student-schedule.py`; вручную её не редактировать.
