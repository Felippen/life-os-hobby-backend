# Infrastructure & Ops

## Deployment
**Platform:** TBD
**URL:** Not deployed yet
**Deploy command:** TBD

### Options Under Consideration
| Platform | Pros | Cons | Recommendation |
|----------|------|------|---------------|
| Railway | Easy NestJS deploy, PostgreSQL, auto-scaling | Pricing (limited free tier) | Recommended |
| Render | Free tier, good NestJS support | Slow cold starts on free tier | Backup option |
| Vercel | Excellent DX, free tier | Requires adapters for NestJS | Not ideal |
| Docker on VPS | Maximum control, predictable pricing | More DevOps work | For later |

Note: Supabase is already hosted separately — only the NestJS backend needs deployment.

## Environments
| Environment | Supabase URL | Backend URL | Notes |
|-------------|-------------|-------------|-------|
| Local | http://127.0.0.1:54321 | http://localhost:3000 | Docker Desktop required |
| Cloud | TBD (in .env file) | TBD | Production |

## Environment Variables
### Required (.env / .env.local)
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY
- GEMINI_API_KEY
- PORT (default: 3000)
- NODE_ENV (development/local/production)
- FRONTEND_URL (default: http://localhost:5173)

### Local Development Defaults
- Supabase API: http://127.0.0.1:54321
- Supabase Studio: http://127.0.0.1:54323
- Anon/service keys: Default Supabase CLI keys (in .env.local)

## CI/CD
Not set up yet. Planned for post-Phase 1C.

## Domain & DNS
Not configured yet.

## Monitoring
Not configured yet. Options noted in tech debt:
- Error tracking: Sentry, Rollbar
- Performance: New Relic, DataDog
- Logs: LogDNA, Papertrail
- Uptime: Pingdom, UptimeRobot

## Security Checklist (Pre-Production)
- [ ] Rate limiting on API endpoints
- [ ] CORS configured for production domains
- [ ] Environment variables secured (not in repo)
- [ ] API key rotation strategy
- [ ] Database backup strategy
- [ ] SSL/TLS certificates
