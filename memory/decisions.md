# Architecture Decision Log

## ADR-001: NestJS over BuildShip (Feb 7, 2026)
**Decision:** Use NestJS as backend framework
**Rationale:** More control, flexibility, industry-standard, strong TypeScript support, built-in DI
**Alternatives:** BuildShip (easier but limited control)
**Impact:** Full backend architecture

## ADR-002: Supabase Auth with Email/Password (Feb 7, 2026)
**Decision:** Use Supabase Auth with email/password for Phase 1
**Rationale:** Quick to implement, native RLS integration, JWT tokens
**Alternatives:** Custom auth, OAuth providers (planned for future)
**Impact:** Auth flow, token handling, RLS policies

## ADR-003: Gemini 1.5-pro for AI (Feb 7, 2026)
**Decision:** Use Google Gemini 1.5-pro as the AI model
**Rationale:** API key already obtained, good for conversational AI, context-aware
**Alternatives:** OpenAI GPT-4, Claude, local LLMs
**Impact:** AI service implementation, token management
**Note:** Initially tried gemini-pro (deprecated), migrated to gemini-1.5-pro

## ADR-004: Nordcraft for Frontend (Feb 7, 2026)
**Decision:** Use Nordcraft as frontend framework
**Rationale:** Visual design + code control, 24kb runtime, SSR, open source
**Alternatives:** Next.js, Nuxt, vanilla React
**Impact:** Frontend architecture, deployment options

## ADR-005: Local-first Development with Docker (Feb 7, 2026)
**Decision:** Use Supabase CLI with Docker for local development
**Rationale:** Fast iteration, free, no cloud dependency during dev, migration version control
**Alternatives:** Cloud-only development
**Impact:** Dev environment setup, testing workflow
