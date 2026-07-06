# Ankit Kr Sinha — Portfolio Website

## Overview
A modern, professional single-page portfolio for Ankit Kr Sinha (MTech CSE @ IIT Hyderabad, ex-Maersk SWE intern). Design direction is **light, editorial, Swiss-minimal**: off-white canvas, oversized grotesk headlines, generous whitespace, restrained but polished GSAP animation (scroll-driven reveals, hover micro-interactions). The goal is a site that reads as designed-by-a-studio, not generated — no generic AI-slop patterns (no purple gradients, no glassmorphism cards, no emoji section headers).

Primary audience: general presence (recruiters, founders, peers — anyone who googles him).
Headline identity: name-first minimal hero with descriptor "Software engineer building ML systems" (easy to change, single string).

## Tech Stack
- **Build**: Vite + vanilla TypeScript (no framework)
- **Animation**: GSAP 3 + ScrollTrigger (all GSAP plugins are free since 3.13)
- **Styling**: hand-written CSS with design tokens (custom properties) — no Tailwind
- **Fonts**: self-hosted webfonts (editorial grotesk for display + readable body face; final pick during design phase — candidates: Cabinet Grotesk / Clash Display / General Sans / Archivo from Fontshare)
- **Hosting**: Vercel (static output from `vite build`)
- **Repo**: GitHub (`ankitsinha1504`)

## Site Structure (single page, case-study pages later)
1. **Header** — name (wordmark), minimal nav (Work / About / Contact), subtle scroll behavior
2. **Hero** — giant type: name + "Engineer & Builder"-style statement, one-line descriptor, location/status line (IIT Hyderabad · MTech CSE), scroll cue
3. **Selected Work** — numbered editorial list/cards (01, 02, …):
   - 01 Text-to-SQL (MTech thesis — LLM/RAG based, in progress)
   - 02 LLVM compiler project (in progress)
   - 03 Cheque Verification & Clearing System (IEEE best project, 96% accuracy)
   - 04 Docker/K8s scaling on .NET Web API
   - Each card: number, title, one-line pitch, tech tags, link (GitHub/detail page later). In-progress items marked with a subtle "in progress" tag.
   - Cards architected so each can later link to a static case-study page (no router needed).
4. **Experience** — timeline-style entries: Maersk (SWE Intern, Nov 2022–Nov 2023), Amazon ML Summer School (2022), Omdena (Jr. ML Engineer, 2021)
5. **About / Now** — short narrative: MTech CSE (NIS) at IIT-H, current focus on systems, RAG, LLMs; skills presented as a clean typographic list grouped by area (Systems & Infra / ML & LLMs / Languages), not badge soup
6. **Achievements** — GATE '25: 99.6 percentile, AIR 609 · IEEE Best Project '23 · CP ratings (Coding Ninjas 2235, CodeChef 1604) · AccioWars AIR 681
7. **Contact / Footer** — big email CTA (ankitsinha1504@gmail.com), GitHub + LinkedIn links, no contact form, no photo

## Animation Plan (GSAP)
- Hero intro: masked line-by-line text reveal on load (once, fast, no long splash)
- Scroll reveals: ScrollTrigger fade/translate for section headings and work items, staggered
- Work list hover: underline draw / arrow slide micro-interactions (CSS + GSAP where needed)
- Number counters or subtle parallax only where it adds meaning — restraint is the aesthetic
- `gsap.matchMedia()` for responsive variants + `prefers-reduced-motion` fallback (all motion collapses to simple fades/none)
- Performance rules: transform/opacity only, no layout-thrashing properties, will-change used sparingly

## Project Phases

### Phase 0: Foundation
- [ ] Initialize git repo and .gitignore
- [ ] Scaffold Vite + vanilla TypeScript project
- [ ] Install GSAP, register ScrollTrigger
- [ ] Set up design tokens (colors, type scale, spacing) as CSS custom properties
- [ ] Self-host and wire chosen webfonts

### Phase 1: Layout & Content
- [ ] Build semantic HTML skeleton for all 7 sections with final copy
- [ ] Header + navigation with anchor scrolling
- [ ] Hero section layout (type-only, oversized headline)
- [ ] Selected Work list (4 entries incl. 2 in-progress) with hover states
- [ ] Experience timeline section
- [ ] About/Now + grouped skills section
- [ ] Achievements strip
- [ ] Contact footer with email CTA and social links
- [ ] Fully responsive layout (mobile-first breakpoints)

### Phase 2: Animation
- [ ] Hero load-in sequence (masked line reveals)
- [ ] ScrollTrigger reveals for all sections (staggered, restrained)
- [ ] Work list micro-interactions (hover underline/arrow)
- [ ] gsap.matchMedia responsive + prefers-reduced-motion handling

### Phase 3: Polish
- [ ] Meta tags, OG image, favicon, page title/description
- [ ] Accessibility pass (landmarks, focus states, contrast, alt text)
- [ ] Performance pass (font loading strategy, Lighthouse ≥ 95)
- [ ] Cross-browser/mobile check

### Phase 4: Deploy
- [ ] Push to GitHub repository
- [ ] Connect and deploy on Vercel
- [ ] Verify production build + share URL

### Phase 5: Scroll Companion (branch: feat/scroll-companion)
- [ ] Scroll elevator: ultramarine square rides a hairline rail on the right edge, tracks scroll progress, spins with scroll direction, squashes with velocity; mono label shows current section (01–05)
- [ ] Cursor follower: lagging blue dot (desktop, fine-pointer only), grows to a ring over interactive rows/links
- [ ] Both desktop-only (≥900px), motion-safe only, aria-hidden, pointer-events none
- [ ] Preview on Vercel branch deploy, merge after approval

### Phase 5b: Live Query Line (branch: feat/glyph-glider, stacked on feat/scroll-companion)
Token train built + previewed, rejected ("childish" — toy `SELECT * FROM work;`, banking rotation, filled candy chips). Replaced by a live query line: the page pretends to be a database and scroll is the cursor — a fixed mono status line always shows the SQL query whose result set is the content currently in viewport:
- [ ] Fixed mono status line, bottom-left above the shuttle rail; ink-soft text, blinking ultramarine block caret
- [ ] Per-zone queries tied to real content: hero (`SELECT * FROM ankit LIMIT 1;`), each project card ticks `LIMIT 1 OFFSET n`, each experience row ticks `WHERE year = <its year>`, about (`WHERE ts = now()`), achievements (`WHERE selected = true`), contact is the single write (`INSERT INTO inbox (sender) VALUES ('you');`)
- [ ] Char-preserving scramble morph between queries — only characters that differ flicker, common prefix/suffix stays put; reversible on scroll-up
- [ ] Shuttle numeric section label hidden while query line is active (query line supersedes it)
- [ ] Desktop-only (≥900px), motion-safe only, aria-hidden, pointer-events none
- [ ] Screenshot-verify, push branch for Vercel preview, share URL

### Phase 6 (future, on demand)
- [ ] Case-study pages for Text-to-SQL thesis and LLVM project once content exists
- [ ] Replace placeholder projects with final ones
- [ ] Custom domain

## Key Decisions
- 2026-07-05: Audience = general presence; identity = name-first hero + "Software engineer building ML systems" descriptor (merge of minimal + SWE/ML positioning).
- 2026-07-05: Visual direction = light editorial Swiss-minimal (rejected dark cinematic, brutalist).
- 2026-07-05: Stack = Vite + vanilla TS + GSAP; no framework (static content, max animation control, easiest maintenance).
- 2026-07-05: Single page now; project cards structured to add static case-study pages later (thesis/LLVM content not ready yet).
- 2026-07-05: Deploy on Vercel; contact = email + socials; no photo; no contact form.
- 2026-07-05: Featured work = Text-to-SQL thesis + LLVM project (in progress, placeholder copy) + old projects as backfill, swappable later.
- 2026-07-05: Scroll-companion branch kept as-is per user; new big vertical element lives on feat/glyph-glider stacked on top of it so both compose in one preview.
- 2026-07-05: Big vertical element = hero-scale ultramarine asterisk gliding on a curved weave (user: "it should glide, move in a curve, not just straight down"); multiply-blend overlay, desktop + motion-safe only.
- 2026-07-05: Asterisk rejected after preview (decorative, not meaningful). Replaced by token train: NL query tokens glide down the curve and morph into SQL — the element now narrates the user's thesis (Text-to-SQL). Curve/weave mechanics kept.
- 2026-07-06: Token train rejected after preview (childish — toy query, cartoon banking, filled chips). Replaced by live query line: fixed mono status line whose SQL always describes the viewport content, ticking at row level (project OFFSET, experience year); contact is the lone INSERT. Traveling element retired — content over motion.

## Notes
- Resume (Resume_Aug25.pdf in repo root) is the content source but outdated: current focus is systems, RAG, LLMs. Copy should reflect the new direction.
- Tone: professional, not academic. No student-project framing.
- User is in college (MTech, IIT-H, expected 2027) — site should read as an engineer's site, not a campus profile.
