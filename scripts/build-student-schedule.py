"""Build the student schedule without staff links or participant data."""

from pathlib import Path
import re


ROOT = Path(__file__).resolve().parent.parent
SOURCE = ROOT / "raspisanie.html"
OUTPUT = ROOT / "raspisanie-studentam.html"

STUDENT_STYLES = '''
  .student-tabs { display:flex; gap:8px; border-bottom:1px solid var(--border-dark); margin:0 0 32px; }
  .student-tab { padding:14px 18px; border:0; border-bottom:3px solid transparent; background:transparent; color:var(--w-70); cursor:pointer; font-weight:700; }
  .student-tab[aria-pressed="true"] { color:var(--gold); border-bottom-color:var(--gold); }
  .student-tab:focus-visible, .self-course__link:focus-visible { outline:2px solid var(--gold); outline-offset:3px; }
  .self-intro { color:var(--w-70); margin:8px 0 26px; max-width:650px; }
  .self-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:16px; }
  .self-course { display:flex; flex-direction:column; align-items:flex-start; gap:12px; padding:24px; border:1px solid var(--border-dark); border-radius:18px; background:var(--card-dark); }
  .self-course h3 { font-family:'Unbounded',sans-serif; font-size:17px; line-height:1.4; }
  .self-course p { color:var(--w-70); margin:0; flex:1; }
  .self-course__meta { display:flex; flex-wrap:wrap; gap:7px; }
  .self-course__link { display:inline-flex; justify-content:center; align-items:center; min-height:44px; padding:10px 20px; color:var(--ink); border-radius:999px; background:var(--grad-btn); text-decoration:none; font-weight:700; }
  .self-course__link:hover { filter:brightness(1.1); }
  @media (max-width:640px) { .self-grid { grid-template-columns:1fr; } .self-course { padding:20px; } .self-course__link { width:100%; } }
'''

STUDENT_TABS = '''  <div class="student-tabs" role="group" aria-label="Направления обучения">
    <button class="student-tab" data-view="all" aria-pressed="true" aria-controls="student-panel-schedule student-panel-self">Все</button>
    <button class="student-tab" data-view="specialists" aria-pressed="false" aria-controls="student-panel-schedule student-panel-self">Для специалистов</button>
    <button class="student-tab" data-view="self" aria-pressed="false" aria-controls="student-panel-schedule student-panel-self">Для себя</button>
  </div>
'''

SELF_PANEL = '''  <section id="student-panel-self" aria-labelledby="student-self-heading">
    <h2 id="student-self-heading">Программы для себя</h2>
    <p class="self-intro">Онлайн-программы для самостоятельной работы с телом и заботы о себе и близких.</p>
    <div class="self-grid">
      <article class="self-course">
        <div class="self-course__meta"><span class="tag">Онлайн</span><span class="tag">8 модулей</span></div>
        <h3>Сам себе остеопат</h3>
        <p>Программа самокоррекции в формате «повторяй за мной»: дыхание, диафрагмы, ЖКТ и мышечные цепи.</p>
        <a class="self-course__link" href="self-osteopath.html" target="_blank" rel="noopener noreferrer">Подробнее о курсе</a>
      </article>
      <article class="self-course">
        <div class="self-course__meta"><span class="tag">Онлайн</span><span class="tag">4 недели</span></div>
        <h3>ОстеоРодитель</h3>
        <p>Остеопатические техники для родителей и детей от 0 до 7 лет. 15 уроков по 20 минут.</p>
        <a class="self-course__link" href="parents.html" target="_blank" rel="noopener noreferrer">Подробнее о курсе</a>
      </article>
      <article class="self-course">
        <div class="self-course__meta"><span class="tag">Онлайн</span><span class="tag">21 день</span></div>
        <h3>ОстеоЭстетика для себя</h3>
        <p>Утренние тренировки с упражнениями для тела и лица.</p>
        <a class="self-course__link" href="estetika.html" target="_blank" rel="noopener noreferrer">Подробнее о курсе</a>
      </article>
      <article class="self-course">
        <div class="self-course__meta"><span class="tag">Онлайн</span><span class="tag">Семинар</span></div>
        <h3>Психосоматика</h3>
        <p>Программа о взаимосвязи тела и эмоций и работе с психоэмоциональными блоками через тело.</p>
        <a class="self-course__link" href="психосоматика/psycho-preview.html" target="_blank" rel="noopener noreferrer">Подробнее о курсе</a>
      </article>
    </div>
  </section>
'''

STUDENT_TABS_SCRIPT = '''
const studentTabs = [...document.querySelectorAll('.student-tab')];
function selectStudentTab(tab, focus = false) {
  const view = tab.dataset.view;
  studentTabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-pressed', String(selected));
  });
  document.getElementById('student-panel-schedule').hidden = view === 'self';
  document.getElementById('student-panel-self').hidden = view === 'specialists';
  if (focus) tab.focus();
}
studentTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectStudentTab(tab.dataset.view !== 'all' && tab.getAttribute('aria-pressed') === 'true' ? studentTabs[0] : tab));
  tab.addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? studentTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + studentTabs.length) % studentTabs.length;
    selectStudentTab(studentTabs[next], true);
  });
});
'''


def remove_between(html, start, end):
    if html.count(start) != 1:
        raise ValueError(f"Expected one section starting with {start!r}")
    first = html.index(start)
    last = html.index(end, first)
    return html[:first] + html[last:]


def replace_once(html, old, new):
    if html.count(old) != 1:
        raise ValueError(f"Expected one occurrence of {old!r}")
    return html.replace(old, new, 1)


def build():
    html = SOURCE.read_text(encoding="utf-8")
    for marker in ("STAFF_LOGIN", "STAFF_LOGIN_FORM"):
        start = f"<!-- {marker}_START -->"
        end = f"<!-- {marker}_END -->"
        if html.count(start) != 1 or html.count(end) != 1:
            raise ValueError(f"Missing or duplicate staff login marker: {marker}")
        html = html[:html.index(start)] + html[html.index(end) + len(end):].lstrip('\n')
    html = replace_once(html, "(для сотрудников)</title>", "(для учеников)</title>")
    html = replace_once(html, ">Для сотрудников</span>", ">Для учеников</span>")
    html = replace_once(
        html,
        "МИОТ · внутренняя страница, не для публикации",
        "МИОТ · расписание для учеников",
    )
    html = remove_between(html, '  <div class="page-tabs"', '  <section id="panel-schedule"')
    html = replace_once(
        html,
        'id="panel-schedule" role="tabpanel" aria-labelledby="tab-schedule"',
        'aria-label="Расписание мероприятий"',
    )
    html = remove_between(html, '  <section id="panel-sites"', "\n</main>")
    html = remove_between(html, "/* Чаты участников:", "EVENTS.forEach((e, i) => {")
    html = remove_between(html, "  if (e.sheet) {", "  document.getElementById('modalBody').innerHTML = h;")
    html = remove_between(html, "const pageTabs =", "renderNext();")

    # Remove chat data stored directly on individual events, too.
    html = re.sub(r",\n    chats: \[[^\n]+\](?= \},)", "", html)
    removed_styles = (
        ".modal__chats", ".btn--sheet", ".btn--ghost", ".page-tabs",
        ".page-tab", ".sites-intro", ".sites-group", ".sites-list", ".site-link",
    )
    html = "\n".join(
        line for line in html.splitlines()
        if not line.lstrip().startswith(removed_styles)
    ) + "\n"

    html = replace_once(html, '</style>\n</head>', STUDENT_STYLES + '</style>\n</head>')
    html = replace_once(html, '<main class="wrap">\n', '<main class="wrap">\n' + STUDENT_TABS)
    html = replace_once(html, '<section aria-label="Расписание мероприятий">', '<section id="student-panel-schedule" aria-label="Расписание мероприятий для специалистов">')
    html = replace_once(html, "  filter = c.dataset.f;\n  document.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x === c ? 'true' : 'false'));", "  filter = c.dataset.f !== 'all' && filter === c.dataset.f ? 'all' : c.dataset.f;\n  document.querySelectorAll('.chip').forEach(x => x.setAttribute('aria-pressed', x.dataset.f === filter ? 'true' : 'false'));")
    html = replace_once(html, '\n</main>', '\n' + SELF_PANEL + '\n</main>')
    html = replace_once(html, '\nrenderNext();\nrender();', '\n' + STUDENT_TABS_SCRIPT + '\nrenderNext();\nrender();')

    forbidden = (
        "t.me/", "telegram.me/", "max.ru/join/", "docs.google.com/spreadsheets/",
        "CHATS", "SHEETS", "e.chats", "e.sheet", "chats:", "sheet:",
        "modal__chats", "page-tab", "panel-sites", "tab-sites",
        "Ссылки на все сайты", "Для сотрудников", "для сотрудников",
    )
    for value in forbidden:
        if value.casefold() in html.casefold():
            raise ValueError(f"Staff-only content remains: {value!r}")
    if '<meta name="robots" content="noindex, nofollow">' not in html:
        raise ValueError("The student page must preserve the noindex setting")

    OUTPUT.write_text(html, encoding="utf-8")
    print(f"Built {OUTPUT.name}; staff links and data removed.")


if __name__ == "__main__":
    build()
