# CLAUDE.md

## Project Overview

NestJS chat application backend with Supabase (PostgreSQL + Auth) and Google Gemini AI integration. Manages conversations and messages, auto-generating AI responses and conversation titles.

## Tech Stack

- **Framework:** NestJS 11 (Express adapter)
- **Language:** TypeScript 5.7 (ES2023 target, nodenext modules)
- **Database:** Supabase PostgreSQL with Row-Level Security (RLS)
- **Auth:** JWT via Supabase (custom guard, not Passport strategies)
- **AI:** Google Gemini (`@google/generative-ai`)
- **Validation:** class-validator + class-transformer
- **Testing:** Jest 30 + Supertest

## Commands

```bash
# Development
npm run start:dev          # Watch mode
npm run start:debug        # Debug with inspector

# Build
npm run build              # Compile TypeScript (nest build)
npm run start:prod         # Run compiled output

# Code Quality
npm run format             # Prettier (single quotes, trailing commas)
npm run lint               # ESLint with auto-fix

# Testing
npm run test               # Unit tests
npm run test:e2e           # Full e2e (resets Supabase DB first)
npm run test:e2e:local     # E2e without DB reset

# Supabase
npm run supabase:start     # Start local Supabase
npm run supabase:stop      # Stop local Supabase
npm run supabase:reset     # Reset local database
```

## Project Structure

```
src/
├── main.ts                 # Bootstrap (CORS, validation pipe)
├── app.module.ts           # Root module
├── auth/                   # JWT guard + decorators (@CurrentUser, @AccessToken)
├── supabase/               # Global Supabase client service (anon, admin, auth clients)
├── conversations/          # CRUD for conversations
├── messages/               # Message creation + AI response generation
└── ai/                     # Google Gemini integration (chat + title generation)

test/
├── test-helpers.ts         # createTestApp(), createTestUser(), cleanupTestUser()
├── *.e2e-spec.ts           # E2e tests (app, conversations, messages)
└── setup-e2e.ts            # Loads env vars for test environment

supabase/
└── migrations/             # SQL migrations (conversations + messages tables with RLS)
```

## Architecture Notes

- **No ORM** — uses Supabase client directly (`.from('table').select()/.insert()`, etc.)
- **Three Supabase client types:** `getClient()` (anon), `getAdminClient()` (service role, bypasses RLS), `getClientWithAuth(token)` (user-scoped)
- **Auth flow:** Bearer token extracted → Supabase verifies JWT → RLS enforces row ownership
- **AI flow:** User sends message → stored → Gemini generates response → response stored → first message auto-generates conversation title
- **DTOs** use class-validator decorators for request validation
- **E2e tests** use real local Supabase instance with test user signup/cleanup

## Database Schema

- **conversations:** `id (UUID)`, `user_id (FK auth.users)`, `title`, `created_at`, `updated_at`
- **messages:** `id (UUID)`, `conversation_id (FK)`, `role ('user'|'assistant')`, `content`, `created_at`
- RLS policies enforce user can only access own conversations and their messages

## Environment Variables

See `.env.local.example` for required vars:
- `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `PORT`, `NODE_ENV`, `FRONTEND_URL` (CORS)
