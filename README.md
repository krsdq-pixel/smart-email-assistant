# Smart Email Assistant

Production-grade resilient inbox automation built with React, TypeScript, Vite, Tailwind, and Capacitor.

## Features
- Dark mode with charcoal, cyan, and orange palette
- Full RTL Arabic support
- Multi-account inbox management for 4+ Google accounts
- Resilient storage abstraction with Capacitor + LocalForage fallback
- Global error boundaries and strict TypeScript safety
- Iron Shield protection for critical emails
- Automated intelligent cleanup engine with retry safety

## Quick start
1. npm install
2. npm run dev
3. Open the Vite app in your browser

## Mobile
- npm install
- npx cap add android
- npm run build
- npx cap sync

## Architecture notes
- All data writes are wrapped in retry-safe persistence helpers.
- Each account is isolated in memory and persisted independently.
- Any delete/archive action checks the Iron Shield before proceeding.
