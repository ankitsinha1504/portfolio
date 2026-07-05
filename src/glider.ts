import gsap from 'gsap';

/* Glider: a giant ultramarine asterisk — the footnote mark to the whole
   page — gliding down the viewport as you scroll. Not a straight drop:
   it weaves on a smooth S-curve between waypoints (one per section),
   turning slowly, and settles lower-right beside the contact CTA.
   Multiply blend lets it pass over content like a print overlay.
   Desktop + motion-safe only. */
export function glider() {
  const el = document.createElement('div');
  el.className = 'glider';
  el.setAttribute('aria-hidden', 'true');
  el.innerHTML = `
    <div class="glider-inner">
      <svg viewBox="-50 -50 100 100" focusable="false">
        <g fill="currentColor">
          <rect x="-50" y="-8" width="100" height="16"></rect>
          <rect x="-50" y="-8" width="100" height="16" transform="rotate(60)"></rect>
          <rect x="-50" y="-8" width="100" height="16" transform="rotate(120)"></rect>
        </g>
      </svg>
    </div>`;
  document.body.appendChild(el);

  const vw = (p: number) => () => window.innerWidth * p;
  const vh = (p: number) => () => window.innerHeight * p;

  gsap.set(el, { xPercent: -50, yPercent: -50 });

  // idle float on the inner wrapper so the glide transform stays untouched
  gsap.to(el.querySelector('.glider-inner'), {
    y: 12,
    duration: 2.8,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
  });

  /* Horizontal waypoints (fraction of viewport width), one hop per
     section transition. Eased hops against a linear sink = S-curve. */
  const xs = [0.55, 0.82, 0.24, 0.62, 0.8];

  const tl = gsap.timeline({
    defaults: { ease: 'power1.inOut', duration: 1 },
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'max',
      scrub: 1.2,
      invalidateOnRefresh: true,
    },
  });

  tl.fromTo(el, { x: vw(0.74) }, { x: vw(xs[0]) }, 0);
  xs.slice(1).forEach((p, i) => tl.to(el, { x: vw(p) }, i + 1));

  // steady sink + slow turn; 540° = 9 sixth-turns, lands upright
  tl.fromTo(
    el,
    { y: vh(0.14) },
    { y: vh(0.78), duration: xs.length, ease: 'none' },
    0,
  ).fromTo(el, { rotation: 0 }, { rotation: 540, duration: xs.length, ease: 'none' }, 0);
}
