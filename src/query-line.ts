import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* Live query line: the page pretends to be a database and scroll is the
   cursor. A fixed mono status line always shows the SQL query whose
   result set is the content in viewport — project cards tick OFFSET,
   experience rows tick their year, contact is the lone INSERT.
   Desktop + motion-safe only. */

const GLYPHS = 'abcdefghijkmnopqrstuvwxyz*%#;=';

export function queryLine() {
  const wrap = document.createElement('div');
  wrap.className = 'query-line mono';
  wrap.setAttribute('aria-hidden', 'true');
  const text = document.createElement('span');
  const caret = document.createElement('span');
  caret.className = 'query-caret';
  wrap.append(text, caret);
  document.body.appendChild(wrap);

  /* Scramble morph that only touches characters that differ — shared
     prefix/suffix holds still, so a one-digit OFFSET tick barely flickers
     while a section change churns the whole clause. */
  let current = '';
  let tween: gsap.core.Tween | undefined;
  const setQuery = (to: string) => {
    if (to === current) return;
    const from = current;
    current = to;
    tween?.kill();
    const state = { p: 0 };
    const span = Math.max(from.length, to.length);
    tween = gsap.to(state, {
      p: 1,
      duration: 0.5,
      ease: 'none',
      onUpdate: () => {
        const len = Math.round(gsap.utils.interpolate(from.length, to.length, state.p));
        const fixed = Math.round(state.p * span);
        let out = '';
        for (let i = 0; i < len; i++) {
          if (i < fixed || from[i] === to[i]) out += to[i] ?? '';
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        text.textContent = out;
      },
    });
  };

  /* Each zone is a DOM region and the query that describes it. Later
     zones win when regions overlap the reading line simultaneously. */
  const year = (el: Element) =>
    el.querySelector('.xp-when')?.textContent?.match(/\d{4}(?!.*\d{4})/)?.[0] ?? '';

  const zones = [
    { el: document.querySelector('.hero'), q: 'SELECT * FROM ankit LIMIT 1;' },
    ...gsap.utils.toArray<Element>('.work-item').map((el, i) => ({
      el,
      q: `SELECT * FROM projects LIMIT 1 OFFSET ${i};`,
    })),
    ...gsap.utils.toArray<Element>('.xp-item').map((el) => ({
      el,
      q: `SELECT * FROM experience WHERE year = ${year(el)};`,
    })),
    { el: document.querySelector('.about'), q: 'SELECT focus FROM ankit WHERE ts = now();' },
    {
      el: document.querySelector('.achievements'),
      q: 'SELECT * FROM achievements WHERE selected = true;',
    },
    {
      el: document.querySelector('.contact'),
      q: "INSERT INTO inbox (sender) VALUES ('you');",
    },
  ].filter((z): z is { el: Element; q: string } => z.el !== null);

  const active = new Set<number>();
  const refresh = () => {
    if (active.size === 0) return; // between zones: hold the last query
    setQuery(zones[Math.max(...active)].q);
  };

  zones.forEach(({ el }, i) => {
    ScrollTrigger.create({
      trigger: el,
      // contact sits at the page floor and may never reach mid-viewport
      start: i === zones.length - 1 ? 'top 75%' : 'top 55%',
      end: 'bottom 55%',
      onToggle: (self) => {
        if (self.isActive) active.add(i);
        else active.delete(i);
        refresh();
      },
    });
  });

  text.textContent = zones[0]?.q ?? '';
  current = text.textContent;
}
