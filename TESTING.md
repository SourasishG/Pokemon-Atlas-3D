# Testing Strategy & QA Architecture

## Overview
This application follows a Behavior-Driven Testing (BDT) approach, testing what users see and do rather than internal implementation details.

---

## Test Pyramid & Stack

| Layer | Tooling | Coverage Focus |
|---|---|---|
| **Unit Tests** | Vitest | Pure utility functions (`typeColors`, `typeEffectiveness`, `teamAnalytics`, `pokeapi` normalizer) |
| **Store State Tests** | Vitest | Zustand state transitions, max team member enforcement (6 limit), duplicate prevention, and reset isolation |
| **Component Tests** | Vitest + React Testing Library + `@testing-library/user-event` | `PokemonCard`, `SearchBar`, `FilterBar`, `QuickViewModal` |
| **API Mocking** | MSW (Mock Service Worker) | Intercepting PokéAPI REST endpoints, handling 404, 429, 500, and empty responses |
| **Accessibility Tests** | `jest-axe` | Automated WCAG AA contrast, ARIA role compliance, and focus management |
| **End-to-End Tests** | Playwright | Full user journeys in real Chromium and Mobile browser viewports |

---

## How to Run Tests

### Unit & Component Tests
```bash
# Run test suite once
npm run test

# Run tests in watch mode
npm run test:watch

# Generate code coverage
npm run test:coverage
```

### End-to-End Tests (Playwright)
```bash
# Run Playwright E2E tests
npm run test:e2e

# Open Playwright Interactive UI
npm run test:e2e:ui
```

---

## API Mocking with MSW
No real network requests are made during unit and component tests.
Mock service worker handlers are located in `tests/mocks/handlers.ts` and simulate responses for:
- `/api/v2/pokemon`
- `/api/v2/pokemon/:idOrName`
- `/api/v2/pokemon-species/:id`
- `/api/v2/evolution-chain/:id`
- Error states: `404 Not Found`, `429 Rate Limit`, and `500 Server Error`.

---

## 3D Canvas Fallback & Mocking
To prevent WebGL context errors during node/jsdom test execution:
- HTML Canvas context methods (`getContext`, `fillRect`, etc.) are mocked in `tests/setup.ts`.
- Components utilize `SafeCanvas` with error boundary fallbacks to handle WebGL context loss safely without crashing the UI.

---

## Manual Accessibility Instructions
1. Navigate through all interactive controls using only `Tab`, `Shift+Tab`, `Enter`, `Space`, and `Escape`.
2. Verify visual focus rings around buttons and links.
3. Test layout at 200% browser zoom.
4. Verify screen reader labels for icon-only action buttons.
