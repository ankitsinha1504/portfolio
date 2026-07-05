import gsap from 'gsap';

/* Token train: the thesis, performed. A natural-language query, split
   into mono token chips, snakes down the viewport follow-the-leader
   along a curved weave as you scroll. Mid-page each chip scrambles and
   resolves into its SQL counterpart — by the contact section the train
   reads as a finished query. Reverses when scrolling back up.
   Desktop + motion-safe only. */

const NL = ['show', 'me', 'the', 'work'];
const SQL = ['SELECT', '*', 'FROM', 'work;'];
const GLYPHS = 'abcdefghijkmnopqrstuvwxyz*%#;=';

export function tokenTrain() {
  const wrap = document.createElement('div');
  wrap.className = 'token-train';
  wrap.setAttribute('aria-hidden', 'true');
  NL.forEach((word) => {
    const chip = document.createElement('span');
    chip.className = 'token-chip mono';
    chip.textContent = word;
    wrap.appendChild(chip);
  });
  document.body.appendChild(wrap);

  const chips = Array.from(wrap.children) as HTMLElement[];
  gsap.set(chips, { xPercent: -50, yPercent: -50 });

  /* Same weave as the shuttle's world, vertical: eased hops between
     per-section x waypoints over a linear sink. u is path progress. */
  const xs = [0.74, 0.55, 0.82, 0.24, 0.62, 0.8];
  const seg = xs.length - 1;
  const clamp01 = gsap.utils.clamp(0, 1);
  const easeSeg = (t: number) => 0.5 - Math.cos(Math.PI * t) / 2;

  const pointAt = (u: number) => {
    const c = clamp01(u);
    const s = Math.min(Math.floor(c * seg), seg - 1);
    let x = gsap.utils.interpolate(xs[s], xs[s + 1], easeSeg(c * seg - s)) * window.innerWidth;
    const y = gsap.utils.interpolate(0.16, 0.8, c) * window.innerHeight;
    /* off-path chips sit in a horizontal row: queued to the right of the
       start before boarding, pulled out to the left of the end after
       arriving — so the query reads left-to-right at rest both ways */
    x -= (u - c) * window.innerHeight * 2.2;
    return { x, y };
  };

  /* Scramble morph between vocabularies, staggered per chip because
     each chip crosses the threshold at its own path position. */
  const morphed = chips.map(() => false);
  const scramble = (chip: HTMLElement, to: string) => {
    const state = { p: 0 };
    gsap.to(state, {
      p: 1,
      duration: 0.45,
      ease: 'none',
      onUpdate: () => {
        const fixed = Math.round(state.p * to.length);
        let tail = '';
        for (let i = fixed; i < to.length; i++) {
          tail += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        chip.textContent = to.slice(0, fixed) + tail;
      },
    });
  };

  const gap = 0.04;
  const bank = gsap.utils.clamp(-12, 12);
  const setters = chips.map((chip) => ({
    x: gsap.quickSetter(chip, 'x', 'px'),
    y: gsap.quickSetter(chip, 'y', 'px'),
    r: gsap.quickSetter(chip, 'rotation', 'deg'),
  }));

  const train = { u: 0 };
  const apply = () => {
    chips.forEach((chip, i) => {
      const u = train.u - i * gap;
      const p = pointAt(u);
      const ahead = pointAt(u + 0.012);
      const angle = (Math.atan2(ahead.y - p.y, ahead.x - p.x) * 180) / Math.PI;
      setters[i].x(p.x);
      setters[i].y(p.y);
      setters[i].r(u > 0 && u < 1 ? bank((angle - 90) * 0.3) : 0);

      const isSQL = u > 0.5;
      if (isSQL !== morphed[i]) {
        morphed[i] = isSQL;
        scramble(chip, isSQL ? SQL[i] : NL[i]);
      }
    });
  };

  gsap.to(train, {
    // overshoot so the last chip clears the path and the row settles
    u: 1 + gap * (chips.length - 1),
    ease: 'none',
    onUpdate: apply,
    scrollTrigger: {
      trigger: document.body,
      start: 'top top',
      end: 'max',
      scrub: 1.2,
      onRefresh: apply,
    },
  });
  apply();
}
