# Claude Context — Ankit Sinha Portfolio

## What This Project Is
A single-page portfolio website for Ankit Kr Sinha (MTech CSE @ IIT Hyderabad, ex-Maersk SWE intern; focus: systems, RAG, LLMs). Light editorial Swiss-minimal design — off-white, oversized grotesk type, generous whitespace — with restrained GSAP/ScrollTrigger animation. Built with Vite + vanilla TypeScript (no framework), deployed to Vercel. Full blueprint in plan.md; task status in checkbox.md.

## Current Phase
Phase 0 (Foundation) — plan files just created, scaffold not started.

## Recent Decisions
- Light editorial Swiss-minimal direction (not dark/cinematic); type-only hero, no photo.
- Vite + vanilla TS + GSAP; single page now, static case-study pages later when thesis/LLVM content is ready.
- Featured work uses placeholder copy for Text-to-SQL thesis + LLVM project; old resume projects as backfill.

## Protocols (always follow these)

1. **Plan-first rule**: If a new decision contradicts or changes anything in plan.md, update plan.md FIRST, then update checkbox.md to reflect any new or removed tasks, THEN implement.

2. **Checkbox discipline**: Mark items in checkbox.md as done only after they are fully implemented and working.

3. **Git commits**: Before committing, verify git is configured under the user's name (see Git Protocol below). Commit after:
   - A major feature or step is completed
   - plan.md or checkbox.md are updated
   - The user explicitly asks for a commit

4. **No silent changes**: Never change the direction of the project without updating plan.md first. If something mid-implementation reveals a flaw in the plan, pause, update the plan, then continue.

5. **claude.md updates**: Only update this file when the plan changes significantly or the user asks for it. Do not regenerate it every session.

6. **Design guard**: Before any UI work, load the frontend-design skill; before GSAP work, load the relevant gsap-skills. No generic AI-slop patterns (purple gradients, glass cards, emoji headings, Inter-by-default).

## Git Protocol
Before every commit run `git config user.name` and `git config user.email`. If either is missing, stop and ask the user to configure git, then commit. Stage with `git add .`, use specific commit messages (e.g. "Implement hero section — Phase 1 step complete"). Never override git identity with --author flags.
