# Security Policy & Frontend Threat Model

## Overview
This application is a client-side SPA with a server proxy. This document outlines the security assumptions, threat model, and client-side security policies enforced across the application.

---

## 1. Secrets and Environment Variables
- **Zero-Secret Client Policy**: No private secrets or API keys are stored in client-side code or `VITE_` public environment variables.
- Server-side secrets (such as `SERVER_API_KEY`) are kept isolated on the server container layer and accessed via `/api/*` proxies.
- `.env` files are excluded from version control via `.gitignore`. A safe `.env.example` template is provided.

---

## 2. Input Handling & Sanitization
- All search strings, type filters, and route parameters are validated and capped to reasonable lengths.
- Team JSON import parses objects safely with `try/catch` block validation, discarding malformed fields, duplicate IDs, and invalid team sizes (> 6 members).
- **No Code Execution**: `eval`, `new Function`, and dynamic script tags are strictly prohibited.

---

## 3. Cross-Site Scripting (XSS) Prevention
- Zero usage of `dangerouslySetInnerHTML`.
- All user input strings, custom team names, and PokéAPI flavor texts are rendered via standard React escaping.

---

## 4. LocalStorage Persistence Safety
- `localStorage` is treated as untrusted user data.
- Zustand `persist` middleware rehydrates favorites and team stores with runtime checks:
  - Enforces maximum team size limit of 6.
  - Clears malformed or corrupted JSON objects gracefully without crashing app startup.

---

## 5. External Assets & HTTPS
- All Pokémon artwork, sprites, and audio files are loaded exclusively over secure `HTTPS`.
- Trusted host domains are limited to `raw.githubusercontent.com` and `pokeapi.co`.

---

## 6. Security Headers (Vercel / Cloud Run)
Production response headers configured in `vercel.json`:
- `Content-Security-Policy`: Restricts allowed scripts, styles, fonts, images, and connect sources.
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

---

## 7. Dependency Vulnerability Checks
Dependencies are routinely audited using `npm audit --audit-level=high`. CI pipeline builds fail on high or critical security vulnerabilities.
