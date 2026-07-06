import '@fontsource-variable/archivo/wdth.css';
import '@fontsource/spline-sans-mono/400.css';
import '@fontsource/spline-sans-mono/500.css';
import './style.css';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { shuttle, cursorFollower } from './companion';
import { queryLine } from './query-line';

gsap.registerPlugin(ScrollTrigger);

const mm = gsap.matchMedia();

mm.add(
  {
    motionOK: '(prefers-reduced-motion: no-preference)',
    reduceMotion: '(prefers-reduced-motion: reduce)',
  },
  (context) => {
    // Reduced motion: static page, no tweens created.
    if (!context.conditions?.motionOK) return;

    heroIntro();
    sectionReveals();
    listReveals();
    achievementCounters();
    scrollCueFade();
  },
);

/* Scroll companion: desktop, motion-safe, fine pointer for the cursor dot.
   Cleanup removes injected DOM when conditions stop matching. */
mm.add('(prefers-reduced-motion: no-preference) and (min-width: 900px)', () => {
  shuttle();
  queryLine();
  return () => {
    document.querySelector('.shuttle-track')?.remove();
    document.querySelector('.query-line')?.remove();
  };
});

mm.add('(prefers-reduced-motion: no-preference) and (pointer: fine)', () => {
  cursorFollower();
  return () => document.querySelector('.cursor-dot')?.remove();
});

/* Hero: name lines rise out of their masks while the width axis
   stretches from condensed to full — the signature moment. */
function heroIntro() {
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  tl.from('.hero-word', {
    yPercent: 110,
    duration: 1.1,
    stagger: 0.14,
  })
    .fromTo(
      '.hero-name',
      { fontStretch: '62%' },
      { fontStretch: '125%', duration: 1.4, ease: 'power3.out' },
      0.1,
    )
    .from(
      ['.hero-eyebrow', '.hero-desc', '.hero-meta'],
      { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.1 },
      0.75,
    )
    .from('.scroll-cue', { autoAlpha: 0, duration: 0.6 }, 1.2);
}

/* Section heads: hairline draws in, labels fade up. */
function sectionReveals() {
  gsap.utils.toArray<HTMLElement>('.section-head').forEach((head) => {
    gsap
      .timeline({
        scrollTrigger: { trigger: head, start: 'top 85%', once: true },
      })
      .from(head, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.9,
        ease: 'power3.inOut',
      })
      .from(
        head.children,
        { autoAlpha: 0, y: 14, duration: 0.6, ease: 'power2.out', stagger: 0.08 },
        0.35,
      );
  });

  gsap.from('.about-statement', {
    autoAlpha: 0,
    y: 40,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.about-statement', start: 'top 82%', once: true },
  });

  gsap
    .timeline({
      scrollTrigger: { trigger: '.contact', start: 'top 75%', once: true },
    })
    .from(['.contact-lede', '.contact-email', '.contact-links'], {
      autoAlpha: 0,
      y: 30,
      duration: 0.8,
      ease: 'power3.out',
      stagger: 0.12,
    });
}

/* Work rows, experience entries, skills, achievements: batched rises. */
function listReveals() {
  const groups = ['.work-item', '.xp-item', '.skill-group', '.ach-item'];
  groups.forEach((selector) => {
    gsap.set(selector, { autoAlpha: 0, y: 44 });
    ScrollTrigger.batch(selector, {
      start: 'top 88%',
      once: true,
      onEnter: (batch) =>
        gsap.to(batch, {
          autoAlpha: 1,
          y: 0,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.12,
        }),
    });
  });
}

/* Achievement figures count up when they enter view. */
function achievementCounters() {
  gsap.utils.toArray<HTMLElement>('.ach-num').forEach((el) => {
    const target = parseFloat(el.dataset.count ?? '0');
    const decimals = parseInt(el.dataset.decimals ?? '0', 10);
    const counter = { value: 0 };
    gsap.to(counter, {
      value: target,
      duration: 1.6,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = counter.value.toFixed(decimals);
      },
    });
  });
}

/* Scroll cue quietly leaves once scrolling starts. */
function scrollCueFade() {
  gsap.to('.scroll-cue', {
    autoAlpha: 0,
    duration: 0.4,
    scrollTrigger: { trigger: '.work', start: 'top 95%', toggleActions: 'play none none reverse' },
  });
}

/* Variable-font metrics settle after load; recalculate trigger positions. */
document.fonts.ready.then(() => ScrollTrigger.refresh());
