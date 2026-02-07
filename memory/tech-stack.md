# Technology Stack

## Core Stack
| Layer | Technology | Version/Model | Docs |
|-------|-----------|---------------|------|
| Frontend | Nordcraft | Latest | https://docs.nordcraft.com/ |
| Backend | NestJS | Latest | https://docs.nestjs.com/ |
| Database | Supabase (PostgreSQL) | Latest | https://supabase.com/docs |
| AI | Google Gemini API | 1.5-pro | https://ai.google.dev/docs |
| Dev Tool | Cursor AI | Latest | - |

## Backend Dependencies
| Package | Purpose |
|---------|---------|
| @nestjs/common, core, platform-express | NestJS framework |
| @supabase/supabase-js | Database client |
| @google/generative-ai | Gemini integration |
| @nestjs/passport, passport, passport-jwt | Auth |
| @nestjs/config | Environment config |
| class-validator, class-transformer | DTO validation |

## Dev Dependencies
| Package | Purpose |
|---------|---------|
| supabase (CLI) | Local dev, migrations |
| jest, supertest | E2E testing |
| Docker Desktop | Required for local Supabase |

## Environment Variables
### Backend (.env / .env.local)
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- GEMINI_API_KEY
- PORT (default: 3000)
- NODE_ENV
- FRONTEND_URL (default: http://localhost:5173)

## Architecture
- REST API between Nordcraft ↔ NestJS
- JWT auth (Supabase tokens)
- RLS at database level
- CORS configured for frontend origin

## Deployment
**Status:** Not decided
**Options under consideration:**
- Railway (recommended for NestJS)
- Render (free tier)
- Vercel (needs adapters)
- Docker on VPS (max control)
