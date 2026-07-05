import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* Shuttle: a blinking block cursor — the engineer's pen — resting on a
   fixed track at the bottom of the viewport. Scroll scrubs it left and
   right between waypoints, one per section, tumbling as it travels.
   Desktop + motion-safe only. */
export function shuttle() {
  const track = document.createElement('div');
  track.className = 'shuttle-track';
  track.setAttribute('aria-hidden', 'true');
  track.innerHTML = `
    <span class="shuttle">
      <span class="shuttle-label mono">00</span>
    </span>
  `;
  document.body.appendChild(track);

  const cursor = track.querySelector<HTMLElement>('.shuttle')!;
  const label = track.querySelector<HTMLElement>('.shuttle-label')!;

  // idle terminal blink; suspended while travelling
  const blink = gsap.to(cursor, {
    opacity: 0.25,
    duration: 0.55,
    repeat: -1,
    yoyo: true,
    ease: 'steps(1)',
  });

  // waypoints: percentage of track width per section, weaving L <-> R
  const stops: Array<[string, string, number]> = [
    ['.hero', '00', 4],
    ['.work', '01', 82],
    ['.experience', '02', 18],
    ['.about', '03', 74],
    ['.achievements', '04', 30],
    ['.contact', '05', 92],
  ];

  const tl = gsap.timeline({
    defaults: { ease: 'power1.inOut' },
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'max',
      scrub: 1,
      onUpdate: () => {
        blink.pause();
        gsap.set(cursor, { opacity: 1 });
        clearTimeout(rest);
        rest = setTimeout(() => blink.restart(), 260);
      },
    },
  });
  let rest: ReturnType<typeof setTimeout>;

  stops.forEach(([, , pct], i) => {
    if (i === 0) {
      gsap.set(cursor, { left: `${pct}%`, rotation: 0 });
    } else {
      // one full tumble per hop so it always lands upright
      tl.to(cursor, { left: `${pct}%`, rotation: i * 360, duration: 1 }, i - 1);
    }
  });

  // section readout riding on the cursor
  stops.forEach(([sel, num]) => {
    ScrollTrigger.create({
      trigger: sel,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          label.textContent = num;
          gsap.fromTo(
            label,
            { yPercent: 40, autoAlpha: 0 },
            { yPercent: 0, autoAlpha: 1, duration: 0.3, ease: 'power2.out' },
          );
        }
      },
    });
  });
}

/* Cursor follower: a lagging accent dot that grows into a ring over
   interactive targets. Fine-pointer devices only. */
export function cursorFollower() {
  const dot = document.createElement('div');
  dot.className = 'cursor-dot';
  dot.setAttribute('aria-hidden', 'true');
  document.body.appendChild(dot);

  const xTo = gsap.quickTo(dot, 'x', { duration: 0.4, ease: 'power3.out' });
  const yTo = gsap.quickTo(dot, 'y', { duration: 0.4, ease: 'power3.out' });

  gsap.set(dot, { xPercent: -50, yPercent: -50, autoAlpha: 0 });

  let seen = false;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (!seen) {
        seen = true;
        gsap.set(dot, { x: e.clientX, y: e.clientY });
        gsap.to(dot, { autoAlpha: 1, duration: 0.3 });
      }
      xTo(e.clientX);
      yTo(e.clientY);
    },
    { passive: true },
  );

  const targets = document.querySelectorAll('a, button');
  targets.forEach((el) => {
    el.addEventListener('pointerenter', () => dot.classList.add('cursor-dot-ring'));
    el.addEventListener('pointerleave', () => dot.classList.remove('cursor-dot-ring'));
  });
}
