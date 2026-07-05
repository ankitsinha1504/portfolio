import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/* Scroll elevator: a small accent square rides a hairline rail down the
   viewport edge, spinning with scroll and squashing with velocity, with a
   mono readout of the current section. Desktop + motion-safe only. */
export function scrollElevator() {
  const rail = document.createElement('div');
  rail.className = 'rail';
  rail.setAttribute('aria-hidden', 'true');
  rail.innerHTML = `
    <span class="rail-thumb"></span>
    <span class="rail-label mono">00</span>
  `;
  document.body.appendChild(rail);

  const thumb = rail.querySelector<HTMLElement>('.rail-thumb')!;
  const label = rail.querySelector<HTMLElement>('.rail-label')!;

  const travel = () => rail.clientHeight - thumb.offsetHeight;
  const yTo = gsap.quickTo(thumb, 'y', { duration: 0.35, ease: 'power3.out' });
  const squashTo = gsap.quickTo(thumb, 'scaleY', { duration: 0.25, ease: 'power2.out' });

  ScrollTrigger.create({
    start: 0,
    end: 'max',
    onUpdate: (self) => {
      yTo(self.progress * travel());
      // spin with scroll distance, squash with speed
      gsap.set(thumb, { rotation: window.scrollY / 6 });
      const v = Math.min(Math.abs(self.getVelocity()) / 4000, 0.45);
      squashTo(1 - v);
    },
    onScrubComplete: () => squashTo(1),
  });

  // settle squash back when scrolling stops
  let settle: ReturnType<typeof setTimeout>;
  window.addEventListener(
    'scroll',
    () => {
      clearTimeout(settle);
      settle = setTimeout(() => squashTo(1), 120);
    },
    { passive: true },
  );

  // section readout
  const stops: Array<[string, string]> = [
    ['.hero', '00'],
    ['.work', '01'],
    ['.experience', '02'],
    ['.about', '03'],
    ['.achievements', '04'],
    ['.contact', '05'],
  ];
  stops.forEach(([sel, num]) => {
    ScrollTrigger.create({
      trigger: sel,
      start: 'top center',
      end: 'bottom center',
      onToggle: (self) => {
        if (self.isActive) {
          label.textContent = num;
          gsap.fromTo(label, { yPercent: 60, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.3 });
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
