# ⚡ Pokémon Atlas 3D

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=threedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Three_Fiber-3D-000000?style=for-the-badge&logo=react&logoColor=61DAFB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

<p align="center">
  <strong>A modern, immersive and interactive 3D Pokédex built for exploring the Pokémon universe.</strong>
</p>

<p align="center">
  Search • Explore • Compare • Build Teams • Save Favorites • Experience Pokémon in 3D
</p>

<p align="center">
  <a href="#-features">Features</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-project-structure">Structure</a>
</p>

---

## 🌌 About The Project

**Pokémon Atlas 3D** is a feature-rich Pokémon exploration platform designed to transform the traditional Pokédex experience into an immersive digital atlas.

Instead of simply displaying Pokémon as static cards, the application combines a **modern glassmorphism interface**, **interactive 3D scenes**, powerful exploration tools and persistent user interactions.

The application uses the **PokéAPI** to retrieve Pokémon data and transforms it into a consistent format for the frontend.

The result is an experience that feels more like a futuristic Pokémon research terminal than a traditional Pokédex.

> 🔬 **Explore the data.**
>
> 🧬 **Understand the Pokémon.**
>
> ⚔️ **Build your team.**
>
> 🌌 **Explore the Atlas.**

---

# ✨ Features

## 🔎 Advanced Pokémon Explorer

Browse through the Pokémon database with a powerful exploration interface.

* 🔍 Search Pokémon by name
* 🧬 Filter by Pokémon type
* 🌎 Filter by generation
* ↕️ Sort by:

  * Pokédex number
  * Reverse Pokédex number
  * Name
  * Base stats
* 🖼️ Grid and list viewing modes
* ⚡ Fast pagination
* 💀 Skeleton loading states
* 📱 Responsive mobile layout

---

## 🧬 Detailed Pokémon Profiles

Every Pokémon has its own detailed information page.

### Information includes

* Official artwork
* Shiny artwork
* Animated sprites
* Pokémon types
* Base statistics
* Total base stats
* Abilities
* Hidden abilities
* Moves
* Height
* Weight
* Pokédex flavor text
* Evolution chain
* Species information

The interface presents this information through a futuristic glass-style dashboard rather than a conventional data table.

---

# 🌀 Interactive 3D Pokémon Viewer

One of the core experiences of Pokémon Atlas 3D is the interactive **Three.js-powered Pokémon viewer**.

The project uses:

* React Three Fiber
* Three.js
* Drei
* Orbit controls
* Interactive 3D scenes

Users can interact with the Pokémon environment and explore the visual presentation from different angles.

### 3D capabilities

* 🌀 Interactive camera controls
* 🔭 Orbit controls
* 💫 Animated environments
* 🌌 Cosmic visual effects
* 🧊 3D Pokémon presentation
* ⚡ Performance-aware rendering

The application also includes a dedicated performance-conscious rendering layer to prevent heavy 3D scenes from negatively affecting the overall experience.

---

# ⚔️ Team Builder

Create your own Pokémon team directly inside the application.

### Team Builder capabilities

* Add Pokémon to your team
* Maximum team size of 6
* Remove Pokémon
* Reorder team members
* Rename your team
* Prevent duplicate Pokémon
* Export team information
* Generate a text summary
* Persist team data across browser sessions

Your team is stored using Zustand's persistence middleware, meaning your selected team remains available after refreshing the page.

---

# ⚖️ Pokémon Comparison

Compare two Pokémon side-by-side.

The comparison system provides two selection slots:

```text
┌─────────────────────┐
│      Pokémon A      │
│                     │
│      VS             │
│                     │
│      Pokémon B      │
└─────────────────────┘
```

### Comparison functionality

* Select Pokémon A
* Select Pokémon B
* Swap Pokémon
* Compare statistics
* Clear comparison
* Reuse the Pokémon selection interface

This makes it easy to evaluate Pokémon before adding them to a team.

---

# ❤️ Favorites

Save Pokémon that you want to revisit later.

Favorites are persisted locally using Zustand middleware.

### Favorites functionality

* Add Pokémon to favorites
* Remove individual favorites
* Check favorite state
* Clear all favorites
* Persistent browser storage

Your favorites survive page refreshes and browser sessions.

---

# 🎨 Modern UI / UX

Pokémon Atlas 3D uses a futuristic **cosmic research terminal aesthetic**.

### Visual design

* 🌌 Dark cosmic background
* 🧊 Glassmorphism cards
* 💎 Soft borders and glow effects
* ✨ Animated interactions
* ⚡ Smooth transitions
* 📡 Scanline effects
* 🔮 Shimmer loading animations
* 🌀 Slow orbital animations
* 📱 Responsive layouts
* ♿ Reduced-motion support
* ⚙️ Low-performance mode

The UI is designed to feel immersive without sacrificing usability.

---

# 🧠 Smart State Management

The application uses **Zustand** to keep application state modular and predictable.

Separate stores handle different areas of the application:

```text
Pokemon Store
│
├── Search
├── Filters
├── Sorting
├── View Mode
├── Pagination
├── Performance Settings
└── UI State

Team Store
│
├── Team Members
├── Team Name
├── Reordering
├── Export
└── Persistence

Favorites Store
│
├── Favorites
├── Add / Remove
└── Persistence

Compare Store
│
├── Pokémon A
├── Pokémon B
├── Swap
└── Selection Modal
```

This separation keeps the application scalable and prevents unrelated features from becoming tightly coupled.

---

# 🚀 Performance Features

Performance was considered throughout the application, especially because of the 3D components.

### Included optimizations

* In-memory API response caching
* Lazy-friendly component architecture
* Skeleton loading states
* Performance mode
* Reduced-motion support
* Controlled 3D rendering
* Normalized API responses
* Responsive rendering
* Minimal unnecessary state coupling

The API service includes an in-memory cache to reduce repeated requests during a browsing session.

---

# 🧩 Tech Stack

## Frontend

<p>
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
</p>

* React 19
* TypeScript
* Tailwind CSS 4
* Vite
* React Router

---

## 3D & Visualization

<p>
  <img src="https://img.shields.io/badge/Three.js-000000?style=for-the-badge&logo=threedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/React_Three_Fiber-000000?style=for-the-badge&logo=react&logoColor=61DAFB" />
</p>

* Three.js
* React Three Fiber
* React Three Drei
* Orbit Controls
* Custom 3D scenes

---

## State Management

<p>
  <img src="https://img.shields.io/badge/Zustand-433E38?style=for-the-badge&logo=react&logoColor=white" />
</p>

* Zustand
* Zustand Persist Middleware

---

## UI & Animation

<p>
  <img src="https://img.shields.io/badge/Lucide_React-F56565?style=for-the-badge&logo=lucide&logoColor=white" />
  <img src="https://img.shields.io/badge/Motion-000000?style=for-the-badge&logo=framer&logoColor=white" />
</p>

* Motion
* Lucide React
* Tailwind CSS
* CLSX
* Tailwind Merge

---

## Data

### PokéAPI

Pokémon information is retrieved from the **PokéAPI**, including:

* Pokémon species
* Types
* Abilities
* Moves
* Base statistics
* Sprites
* Official artwork
* Evolution chains
* Flavor text

API Base Endpoint:

```text
https://pokeapi.co/api/v2
```

---

# 🏗️ Architecture

The project follows a modular React architecture.

```text
                    ┌─────────────────────┐
                    │      React App      │
                    └──────────┬──────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
        ┌──────────┐     ┌───────────┐    ┌───────────┐
        │   Pages  │     │ Components│    │   Stores  │
        └────┬─────┘     └─────┬─────┘    └─────┬─────┘
             │                 │                │
             └─────────────────┼────────────────┘
                               │
                               ▼
                     ┌─────────────────┐
                     │  Service Layer  │
                     └────────┬────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │   PokéAPI   │
                       └─────────────┘
```

---

# 📁 Project Structure

```text
pokemon-atlas-3d/
│
├── assets/
│
├── src/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── SkeletonCard.jsx
│   │   │   └── Toast.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MobileMenu.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── pokemon/
│   │   │   ├── PokemonCard.jsx
│   │   │   ├── PokemonGrid.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── TypeBadge.jsx
│   │   │   ├── StatBar.jsx
│   │   │   ├── EvolutionChain.jsx
│   │   │   └── QuickViewModal.jsx
│   │   │
│   │   └── three/
│   │       ├── HeroBallScene.jsx
│   │       ├── PokemonViewer.jsx
│   │       ├── SafeCanvas.jsx
│   │       └── SafeOrbitControls.jsx
│   │
│   ├── constants/
│   │   └── pokemonConstants.js
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Pokedex.jsx
│   │   ├── PokemonDetail.jsx
│   │   ├── TeamBuilder.jsx
│   │   ├── Compare.jsx
│   │   └── Favorites.jsx
│   │
│   ├── services/
│   │   └── pokeapi.js
│   │
│   ├── store/
│   │   ├── usePokemonStore.js
│   │   ├── useTeamStore.js
│   │   ├── useCompareStore.js
│   │   └── useFavoritesStore.js
│   │
│   ├── utils/
│   │   ├── typeColors.js
│   │   ├── typeEffectiveness.js
│   │   └── teamAnalytics.js
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

# 🛠️ Getting Started

## Prerequisites

Make sure you have installed:

* Node.js 18+
* npm
* Git

---

## 1. Clone the Repository

```bash
git clone https://github.com/SourasishG/Pokemon-Atlas-3d.git
```

```bash
cd pokemon-atlas-3d
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

## 4. Create a Production Build

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

---

# 📜 Available Scripts

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `npm run dev`           | Start development server |
| `npm run build`         | Create production build  |
| `npm run preview`       | Preview production build |
| `npm run lint`          | Run TypeScript checks    |
| `npm run test`          | Run unit tests           |
| `npm run test:watch`    | Run tests in watch mode  |
| `npm run test:coverage` | Generate test coverage   |
| `npm run test:e2e`      | Run Playwright E2E tests |
| `npm run test:e2e:ui`   | Open Playwright UI       |
| `npm run format:check`  | Check code formatting    |
| `npm run audit`         | Run npm security audit   |

---

# 🧪 Testing

The project is prepared with a testing ecosystem based around:

* Vitest
* React Testing Library
* Jest DOM
* MSW
* Playwright
* jest-axe

Testing layers include:

```text
Unit Tests
    ↓
Component Tests
    ↓
Accessibility Tests
    ↓
End-to-End Tests
```

---

# 🔐 Environment Variables

If additional environment configuration is required, create a `.env` file based on:

```bash
.env.example
```

Keep private credentials and environment-specific configuration out of version control.

---

# 📱 Responsive Design

Pokémon Atlas 3D is designed for multiple screen sizes.

```text
Desktop
┌─────────────────────────────────────────┐
│ Navigation                               │
├─────────────────────────────────────────┤
│                                         │
│          Immersive 3D Experience        │
│                                         │
├─────────────────────────────────────────┤
│ Pokemon Explorer / Dashboard             │
└─────────────────────────────────────────┘

Mobile
┌──────────────────┐
│ ☰   ATLAS        │
├──────────────────┤
│                  │
│   Pokémon        │
│                  │
├──────────────────┤
│ Search           │
├──────────────────┤
│ Cards            │
│ Cards            │
│ Cards            │
└──────────────────┘
```

The interface adapts its layout while maintaining the core exploration experience.

---

# 🧠 Key Engineering Concepts

This project demonstrates practical implementation of:

* Component-based architecture
* Global state management
* Persistent client-side state
* API integration
* Data normalization
* API caching
* Dynamic routing
* URL parameter handling
* Responsive UI design
* 3D rendering with React
* Animation systems
* Loading states
* Error states
* Accessibility considerations
* Performance optimization
* Modular utility functions

---

# 🗺️ Application Routes

| Route          | Purpose            |
| -------------- | ------------------ |
| `/`            | Landing / Home     |
| `/pokedex`     | Pokémon explorer   |
| `/pokemon/:id` | Pokémon details    |
| `/pokedex/:id` | Pokémon details    |
| `/team`        | Team Builder       |
| `/compare`     | Pokémon comparison |
| `/favorites`   | Saved Pokémon      |

---

# 🎯 Why This Project?

Most Pokédex applications focus primarily on displaying information.

Pokémon Atlas 3D focuses on **how users experience that information**.

The goal was to combine:

```text
Pokémon Data
      +
Modern UI
      +
3D Graphics
      +
State Management
      +
Interactive Exploration
      =
Pokémon Atlas 3D
```

The project serves as a practical demonstration of how modern frontend technologies can be combined to create an immersive, data-driven web application.

---

# 🏆 Highlights

| Area        | Implementation                          |
| ----------- | --------------------------------------- |
| UI          | Modern glassmorphism / cosmic interface |
| 3D          | Three.js + React Three Fiber            |
| Data        | PokéAPI                                 |
| State       | Zustand                                 |
| Persistence | Zustand Persist                         |
| Routing     | React Router                            |
| Styling     | Tailwind CSS 4                          |
| Animation   | Motion + CSS                            |
| Icons       | Lucide React                            |
| Build Tool  | Vite                                    |
| Testing     | Vitest + Playwright                     |
| Responsive  | Desktop + Mobile                        |
| Performance | Caching + performance modes             |

---

# ⚡ Performance Philosophy

The application doesn't treat 3D as an excuse to sacrifice usability.

Pokémon Atlas 3D includes:

> **Performance-aware rendering + reduced motion + loading states + API caching**

Users with lower-end devices can enable performance-oriented settings while users with capable hardware can enjoy the full visual experience.

---

# 🤝 Contributing

Contributions, suggestions and improvements are welcome.

### Contribution workflow

```bash
# Fork the repository

# Clone your fork
git clone https://github.com/SourasishG/Pokemon-Atlas-3d.git

# Create a feature branch
git checkout -b feature/amazing-feature

# Make your changes

# Commit
git commit -m "feat: add amazing feature"

# Push
git push origin feature/amazing-feature

# Open a Pull Request
```

---

# ⚠️ Disclaimer

Pokémon Atlas 3D is a **fan-made, non-commercial project** created for educational and portfolio purposes.

Pokémon and its associated characters, names, artwork and trademarks are the property of their respective owners.

This project is not affiliated with, endorsed by, or sponsored by Nintendo, Game Freak, Creatures Inc., or The Pokémon Company.

Pokémon data is provided through the publicly available PokéAPI.

---

# 📚 Credits

### Data

**PokéAPI** — Pokémon data API

### Technology

Built with:

* React
* TypeScript
* Three.js
* React Three Fiber
* Tailwind CSS
* Zustand
* Vite
* React Router
* Motion
* Lucide React

---

# 🌌 Final Look

<p align="center">

**POKÉMON ATLAS 3D**

*Explore the Pokémon universe from a different perspective.*

<br />

🔎 **Discover**
🧬 **Analyze**
⚔️ **Build**
⚖️ **Compare**
❤️ **Collect**
🌌 **Explore**

</p>

---

<p align="center">
  Made with ❤️, React & Three.js
</p>

<p align="center">
  ⭐ If you found this project interesting, consider giving the repository a star!
</p>
