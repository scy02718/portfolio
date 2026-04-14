# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server with HMR
- `npm run build` — production build
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint across the repo

No test runner is configured.

## Architecture

Single-page personal portfolio built with React 18 + Vite, styled with Tailwind CSS. The app is composed as a vertical stack of section components rendered by `src/App.jsx`; section order there is the source of truth for page layout (e.g. `Projects` is currently commented out).

- `src/sections/` — top-level page sections (Hero, About, Education, Experience, Certificates, Awards, Skills, Contact, Footer, Navbar). Each section is self-contained and typically pulls its data from `src/constants/index.js`.
- `src/components/` — reusable presentational pieces and 3D assets. The 3D scene pieces (`HackerRoom`, `Developer`, `Human`, `Cube`, `Rings`, `Target`, `ReactLogo`, `DemoComputer`, `HeroCamera`, `Floor`, `CanvasLoader`) are React Three Fiber components meant to be mounted inside a `<Canvas>` in a section (primarily `Hero`).
- `src/constants/index.js` — centralized content (nav links, experience, education, certificates, skills, etc.). Editing copy or adding portfolio entries generally means editing this file, not the section JSX.
- `public/assets`, `public/models`, `public/textures` — static images, GLTF models, and textures referenced by URL (e.g. `/assets/...`). Recent fix (`4d2bc0a`) moved asset fetching to local paths; keep new assets under `public/` and reference them with root-relative URLs rather than imports.
- Layout constraint: `App.jsx` wraps everything in `max-w-7xl mx-auto`. Sections should respect this width — the comment in `App.jsx` explicitly calls this out.

## Stack notes

- 3D: `@react-three/fiber` + `@react-three/drei` + `three`, with `leva` available for debug controls and `maath` for math helpers. `react-globe.gl` is used separately for the globe visual.
- Animation: `gsap` (with `@gsap/react`) and `framer-motion` are both present — check the section you are editing to match the existing animation library rather than mixing.
- Contact form uses `@emailjs/browser`; credentials are expected via Vite env vars (`import.meta.env.VITE_*`).
- Responsive behavior uses `react-responsive` breakpoints rather than only Tailwind classes in a few places (notably Hero's 3D scene sizing).
