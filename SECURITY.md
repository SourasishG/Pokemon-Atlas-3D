# Security Policy & Frontend Threat Model

## Overview
Pokémon Atlas 3D is a client-side Single Page Application (SPA) built on React 19, Vite 6, Three.js, and Zustand. It communicates directly with public open-source Pokémon APIs (PokéAPI) and GitHub 3D model CDN mirrors. This document outlines the security architecture, threat model, data sanitization policies, and deployment security headers.

---

## 1. Secrets and Environment Variables
- **Zero-Secret Client Policy**: No private API keys or authentication credentials are required or embedded in client-side code or public variables.
- PokéAPI and 3D asset mirrors are public, open-source resources.
- `.env` configuration files are strictly excluded from version control via `.gitignore`. A clean template is maintained in `.env.example`.

---

## 2. Input Handling, Validation & Sanitization
- **URL & Search Strings**: Query parameters and search inputs are trimmed, sanitized, and capped to safe lengths to prevent memory spikes or regular expression DoS.
- **Team JSON Import Validation**:
  - Safe parsing within `try/catch` protective blocks.
  - Runtime validation guarantees that input is a valid object containing a `members` array.
  - Strict ID deduplication (`Set` tracking) and type casting (`Number`).
  - Hard cap of maximum 6 team members.
  - Untrusted string fields (`teamName`, `displayName`) are sanitized and length-limited (max 50 chars).
- **No Dynamic Code Execution**: Zero usage of `eval()`, `new Function()`, or dynamic `<script>` injection.

---

## 3. Cross-Site Scripting (XSS) Prevention
- Zero instances of `dangerouslySetInnerHTML`.
- All text strings, custom team names, abilities, moves, and PokéAPI flavor texts are safely interpolated through React's native escaping mechanism.
- External URLs for sprites, GLTF models, and artwork are validated against trusted CDNs.

---

## 4. LocalStorage Persistence Safety
- `localStorage` is treated as untrusted user storage.
- Zustand `persist` middleware loads saved favorites and teams with runtime boundaries:
  - Enforces maximum team size limit of 6.
  - Rejects corrupted or malformed persisted JSON gracefully without crashing application startup.

---

## 5. External Assets & HTTPS
- All Pokémon artwork, official sprites, GLTF/GLB models, and audio files are fetched exclusively over encrypted `HTTPS`.
- Trusted host domains are strictly scoped:
  - `pokeapi.co` (REST metadata)
  - `raw.githubusercontent.com` (Sprites, official artwork, GLTF/GLB 3D models)
  - `fonts.googleapis.com` / `fonts.gstatic.com` (Typography)

---

## 6. Security Response Headers (Vercel / Cloud Run)
Production response headers configured in `vercel.json`:
- `Content-Security-Policy`: Restricts scripts to `'self'`, styles to Google Fonts and self, images to PokéAPI and GitHub CDNs, and prohibits `object-src`.
- `X-Content-Type-Options: nosniff`: Prevents MIME-type sniffing.
- `Referrer-Policy: strict-origin-when-cross-origin`: Restricts referrer data leakage across origins.
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`: Disables unused hardware device APIs.

---

## 7. Dependency Vulnerability Audits
Dependencies are continuously audited using `npm audit --audit-level=high`. CI pipeline builds fail automatically on high or critical security vulnerabilities.
