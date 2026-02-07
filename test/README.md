# E2E Test Setup

## Local Supabase (Recommended)

Run tests against a local Supabase instance—no remote config needed.

### Prerequisites

- **Docker Desktop** must be installed and running
- Copy `.env.local.example` to `.env.local` and add your `GEMINI_API_KEY`

### Run Tests

```bash
# 1. Start local Supabase (first time or after stop)
npm run supabase:start

# 2. Run tests (resets DB, runs migrations, executes tests)
npm run test:e2e
```

### Commands

| Command | Description |
|---------|-------------|
| `npm run supabase:start` | Start local Supabase (Docker) |
| `npm run supabase:stop` | Stop local Supabase |
| `npm run supabase:status` | Check service status |
| `npm run supabase:reset` | Reset DB, re-run migrations |
| `npm run test:e2e` | Reset DB + run E2E tests |
| `npm run test:e2e:local` | Run tests (assumes Supabase running, DB reset) |

### Local Studio

Open http://127.0.0.1:54323 to view the database UI.

---

## Remote Supabase (Alternative)

To run against your remote Supabase project:

1. Use `.env` with your remote credentials
2. Set `NODE_ENV` to something other than `local` (or don't use test:e2e:local)
3. Disable "Confirm email" in Auth settings
4. Ensure `conversations` and `messages` tables exist
5. Run `jest --config ./test/jest-e2e.json`

## Test Structure

- `app.e2e-spec.ts` – basic auth check
- `conversations.e2e-spec.ts` – CRUD tests
- `messages.e2e-spec.ts` – message creation and AI response tests

## Notes

- Message tests call the real Gemini API.
- Local Supabase has no auth restrictions—test users create instantly.
- AI-related tests have a 30s timeout.
