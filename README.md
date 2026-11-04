<div align="center">

# ⚡ Pokémon Atlas 3D
### *Next-Gen Holographic Pokédex & Competitive Squad Studio*

[![React 19](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![Vite 6](https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind-4.1-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-764ABC)](https://zustand-demo.pmnd.rs/)
[![Vitest](https://img.shields.io/badge/Vitest-4.1-FCC72B?logo=vitest&logoColor=black)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-1.62-2EAD33?logo=playwright&logoColor=white)](https://playwright.dev/)
[![Accessibility](https://img.shields.io/badge/WCAG%20AA-Passed-brightgreen?logo=w3c&logoColor=white)](https://www.w3.org/WAI/standards-guidelines/wcag/)
[![Security](https://img.shields.io/badge/npm%20audit-0%20vulnerabilities-brightgreen?logo=npm&logoColor=white)](https://www.npmjs.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

<br />

**Pokémon Atlas 3D** is a production-grade, responsive WebGL 3D Pokédex and squad analysis workstation. It bridges immersive 3D graphics, real-time PokéAPI data synchronization, advanced team synergy analytics, and dual-species battle spec comparisons into a sleek holographic interface.

[Explore Pokédex](#-features) • [Quick Start](#-getting-started) • [Architecture](#-architecture--tech-stack) • [Testing Suite](#-testing--quality-assurance) • [Deployment](#-production-deployment)

---

</div>

## 🌟 Key Features

### 🌌 1. Interactive 3D Holographic Laboratory
- **Real-Time 3D WebGL Rendering**: Powered by Three.js and React Three Fiber with custom PBR lighting, orbit controls, smooth damping, and interactive rotation.
- **Dual Visual Modes**: Switch between high-definition **GLTF 3D Meshes** and volumetric glass **3D Hologram Statues**.
- **Shiny Mode Transformation**: Instant toggle between regular species forms and rare Shiny variations with dynamic particle lighting and pedestal re-theming.
- **Fail-Safe WebGL Isolation**: Protected by `SafeCanvas` and `CanvasErrorBoundary` — devices without hardware WebGL support smoothly fallback to 2D holographic mode without UI interruption.

### 📖 2. Complete Pokédex Explorer (Gen I - IX)
- **1,025+ Indexed Pokémon**: Comprehensive directory spanning Kanto through Paldea.
- **Smart Debounced Search**: Instant 300ms debounced filtering by species name or numerical Pokédex `#ID` (e.g., `#0025` or `Pikachu`).
- **Dynamic Multi-Filters**: Filter by 18 elemental types and 9 distinct Pokémon generations simultaneously.
- **Multi-Axis Sorting**: Sort by ID (asc/desc), Alphabetical name (A–Z), or Base Stat Total (BST).
- **Dual Display Modes**: Toggle between visual Glass Card Grid and high-density Data Table List view.
- **Quick-View Modal**: Instant inspection drawer with base stats, height, weight, and abilities without losing browse state.

### 🛡️ 3. Competitive Squad Builder & Matrix Analysis
- **6-Member Squad Roster**: Strict validation enforcing team limits and duplicate prevention.
- **Shared Vulnerability Detection**: Calculates cumulative defensive multipliers and alerts trainers to compound elemental weaknesses across squad members.
- **Benchmark Metrics**: Real-time calculations of total team BST, average stats, fastest speed tier, and primary type frequency.
- **One-Click Presets & Randomizer**: Test squad configurations instantly using iconic meta lineups.
- **Import / Export Safe JSON**: Export squad data to standard JSON or copy formatted text summaries to clipboard. Safe JSON importer features runtime type validation, sanitization, and strict cap enforcement.

### ⚖️ 4. Dual Spec Battle Comparator
- **Side-by-Side Stat Breakdown**: Compare any two Pokémon across HP, Attack, Defense, Special Attack, Special Defense, and Speed.
- **Direct Winner Badging**: Visual meters highlight winning stat categories with golden trophy badges.
- **Iconic Rivalry Presets**: Instant loading for classic face-offs (*Charizard vs Blastoise*, *Mewtwo vs Mew*, *Lucario vs Gengar*, *Koraidon vs Miraidon*).
- **One-Click Slot Swap**: Rapidly invert A/B slot perspectives.

### ❤️ 5. Saved Species Vault (Favorites)
- **Persistent LocalStorage**: Save beloved species with zero login requirement.
- **In-Vault Filtering**: Dedicated search bar and type dropdown to filter within personal favorites.
- **One-Click Sync**: Synchronize favorites directly into Team Builder or Comparison modules.

---

## 🏗 Architecture & Tech Stack

```
pokémon-atlas-3d/
├── .github/workflows/ci.yml       # Automated CI pipeline (lint, format, test, build, audit)
├── public/                        # Static assets, logos, and favicons
├── src/
│   ├── assets/                    # Artwork & vector graphics
│   ├── components/
│   │   ├── common/                # Reusable UI (Modal, Badge, Toast, SkeletonCard)
│   │   ├── compare/               # Comparison card and dual-stage meters
│   │   ├── layout/                # Navbar, Footer, Mobile drawer
│   │   ├── pokemon/               # PokemonCard, PokemonGrid, SearchBar, FilterBar
│   │   ├── team/                  # TeamCard, TeamAnalysis, Squad slots
│   │   └── three/                 # Three.js Canvas, SafeCanvas, OrbitControls, 3D Models
│   ├── constants/                 # Type charts, generations, and stat map metadata
│   ├── pages/                     # Lazy-loaded page routes (Home, Pokedex, Detail, Team, Compare, Favorites)
│   ├── services/                  # PokéAPI v2 client with multi-tier in-memory caching
│   ├── store/                     # Zustand stores with localStorage persistence
│   ├── utils/                     # Type effectiveness, team analytics, color palettes
│   ├── App.tsx                    # Route definitions with Suspense boundaries
│   ├── index.css                  # Tailwind CSS styling and glassmorphism utilities
│   └── main.tsx                   # React 19 root bootstrap
├── tests/
│   ├── accessibility/             # jest-axe automated WCAG AA audits
│   ├── components/                # RTL component tests (Cards, Filters, Modals)
│   ├── e2e/                       # Playwright browser end-to-end tests
│   ├── mocks/                     # MSW (Mock Service Worker) API handlers
│   └── unit/                      # Utility and Zustand state store tests
├── vercel.json                    # Strict CSP headers, security policies, and SPA rewrites
└── vite.config.ts                 # Rollup chunk splitting & build optimizations
```

| Layer | Technology | Key Details |
|---|---|---|
| **Core Framework** | React 19 + TypeScript | Concurrent rendering, typed state, and strict mode compliance |
| **Build & Bundler** | Vite 6 + Rollup | Dynamic chunking, instant HMR, and tree shaking |
| **3D Rendering** | Three.js + React Three Fiber + Drei | WebGL PBR rendering, custom canvas error boundaries |
| **State Management** | Zustand 5 | Modular stores (`usePokemonStore`, `useTeamStore`, `useFavoritesStore`, `useCompareStore`) with `persist` middleware |
| **Styling & Effects** | Tailwind CSS 4 + Motion | Modern glassmorphism, responsive mobile drawers, and smooth spring physics |
| **Data Engine** | PokéAPI v2 REST API | Client-side memory caching, batch parallel requests, and abortable signals |
| **Unit & Store Testing** | Vitest 4 + Testing Library | 62 unit and component tests passing |
| **E2E Testing** | Playwright | Multi-device browser testing (Desktop Chrome, Mobile Pixel) |
| **Accessibility** | `jest-axe` | Automated WCAG 2.1 AA audits with 0 violations |

---

## ⚡ Performance & Production Optimizations

- **Dynamic Code Splitting**: All major route components (`Home`, `Pokedex`, `PokemonDetail`, `TeamBuilder`, `Compare`, `Favorites`) are lazy-loaded via `React.lazy()` and wrapped in `<Suspense>` with a neon holographic loader.
- **Rollup Manual Chunks**: Heavy libraries are isolated into dedicated vendor chunks (`three-vendor`, `react-vendor`, `motion-vendor`, `lucide-vendor`), reducing the entry bundle weight from **1.5 MB down to ~15 kB** (gzip: 5.18 kB).
- **Directory In-Memory Caching**: PokéAPI species lists and generation directories are cached in RAM, eliminating duplicate network roundtrips during pagination.
- **Zero-Vulnerability Tree**: Zero known vulnerabilities across direct and transitive dependencies (`npm audit` 100% clean).
- **Cross-Platform Compatibility**: Clean scripts and build commands execute seamlessly across Windows (PowerShell/CMD), macOS, and Linux environments.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.0.0` or higher (LTS recommended)
- **npm**: `v10.0.0` or higher

### 1. Clone & Install
```bash
# Clone the repository
git clone https://github.com/your-username/pokemon-atlas-3d.git
cd pokemon-atlas-3d

# Install dependencies cleanly
npm install
```

### 2. Configure Environment (Optional)
The application works out of the box without any third-party API keys! To configure custom ports or URLs:
```bash
cp .env.example .env
```

### 3. Launch Development Server
```bash
npm run dev
```
Navigate to [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🧪 Testing & Quality Assurance

The codebase maintains an extensive test suite covering unit math, state transitions, API mocking, user interactions, accessibility, and E2E journeys.

```bash
# Run all unit, component, and accessibility tests
npm test

# Run tests in continuous watch mode
npm run test:watch

# Generate comprehensive test coverage report
npm run test:coverage

# Run TypeScript type check
npm run lint

# Check Prettier code formatting
npm run format:check

# Auto-format codebase with Prettier
npm run format

# Run security vulnerability audit
npm run audit

# Run full Playwright End-to-End test suite
npm run test:e2e

# Open interactive Playwright UI
npm run test:e2e:ui
```

---

## 🎮 3D Viewer Navigation & Controls

| Action | Desktop Interaction | Mobile / Touch Gesture |
|---|---|---|
| **Rotate 360°** | Click + Drag | Single-finger Drag |
| **Zoom In / Out** | Mouse Wheel Scroll | Pinch In / Pinch Out |
| **Reset Camera** | Click the `Reset Camera` button | Tap the `Reset Camera` icon |
| **Shiny Toggle** | Click `Shiny / Normal` toggle button | Tap `Shiny / Normal` pill |
| **Hologram Switch**| Click `3D Mesh` vs `3D Hologram` | Tap segmented control |

---

## 🌐 Production Deployment

### Vercel (Recommended)
This repository includes a production-ready [`vercel.json`](vercel.json) configured with:
- Single-page application rewrites (`/(.*)` -> `/index.html`) so deep links and page refreshes work seamlessly.
- Hardened Content Security Policy (`CSP`), `X-Content-Type-Options: nosniff`, and strict referrer headers.

Deploy with the Vercel CLI:
```bash
npm i -g vercel
vercel
```

### Docker / Static Container
Build the production bundle:
```bash
npm run build
```
The compiled output in `dist/` can be served with Nginx, Caddy, Cloudflare Pages, Netlify, or any static file server:
```bash
npm run preview
```

---

## ♿ Accessibility (a11y) & Keyboard Navigation

- **Keyboard Accessible**: Full navigation support using `Tab`, `Shift + Tab`, `Enter`, `Space`, and `Escape`.
- **Screen Reader Friendly**: All icon-only buttons include `aria-label` or `title` tags. Modals have `role="dialog"` and `aria-modal="true"`.
- **Reduced Motion Support**: Respects OS accessibility settings for animations.
- **Color Contrast**: All typography and badges meet or exceed WCAG 2.1 AA standards.

---

## 📄 License & Legal Notice

This project is open-source under the [MIT License](LICENSE).

> **Disclaimer**: Pokémon and Pokémon character names are trademarks and copyright of Nintendo, Creatures Inc., and GAME FREAK Inc. This project is a non-commercial, educational fan tribute powered by [PokéAPI](https://pokeapi.co/).
