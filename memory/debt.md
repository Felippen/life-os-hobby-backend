# Technical Debt Tracker

## Low Priority (Future Enhancements)
| Item | Description | Complexity | Phase |
|------|-------------|-----------|-------|
| Streaming AI | Stream Gemini tokens to frontend for better UX | Medium | Post-1D |
| Message metadata | Add JSONB column for tokens, model version, timing | Low | 2 |
| Soft deletes | Add deleted_at to conversations for recovery | Low | 2 |
| Real-time updates | Supabase real-time subscriptions | Medium | 2+ |
| Rate limiting | Protect Gemini API from abuse | Medium | Pre-production |
| Error logging | Comprehensive logging/monitoring service | Medium | Pre-production |

## Medium Priority (Before V1.0)
| Item | Description | Complexity | Phase |
|------|-------------|-----------|-------|
| Env secrets mgmt | Production environment variables strategy | Low | 1C |
| CI/CD pipeline | Automated testing and deployment | Medium | Post-1C |
| DB backup strategy | Beyond Supabase auto-backups | Low | Pre-production |
| API documentation | Swagger/OpenAPI spec | Low | 1D |
| UPDATE/DELETE RLS | Add missing RLS policies for update/delete | Low | 1C |

## Resolved
(None yet)
