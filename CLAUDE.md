# AI Co-Developer

## Current Phase
Phase 1C — Local Validation + Cloud Connection

## Stack
NestJS | Supabase (PostgreSQL + Auth + RLS) | Nordcraft | Gemini 1.5-pro | Cursor AI

## Vision (one-liner — full: memory/vision.md)
AI-first personal productivity platform. Beautiful + powerful. Full context awareness is the differentiator.

## What's Done (one line per completed phase)
- Phases 1A/1B/1B+: Backend + Chat + AI + Testing ✓ (Session 1, Feb 7 2026)

## What's Next (Priority Order)
1. Start Docker + local Supabase → run E2E tests
2. Link Supabase CLI to cloud → validate
3. Choose deployment platform
4. Begin Nordcraft frontend

## Active Blockers
- Docker Desktop must be running before Supabase CLI
- Supabase project ref needed for cloud linking
- Nordcraft account status unknown

## Quick Commands
| Action | Command |
|--------|---------|
| Start local Supabase | `npm run supabase:start` |
| Run tests | `npm run test:e2e` |
| Start backend | `npm run start:dev` |
| Link to cloud | `npx supabase link --project-ref REF` |

## Key Decisions (last 5 — full log: memory/decisions.md)
- NestJS over BuildShip (more control)
- Supabase Auth email/password (Phase 1)
- Gemini 1.5-pro (context-aware chat)
- Local-first dev with Docker

## Notable Issues (topic → session — full index: memory/index.md)
- Gemini model deprecation → Session 1
- DB constraint issues → Session 1

## Recent Session
Session 1 (Feb 7, 2026): Built entire backend + testing infra. All 6 modules complete.
→ All sessions: memory/sessions/
