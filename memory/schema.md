# Database Schema & API Contracts

## Tables

### conversations [LIVE]
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | gen_random_uuid() |
| user_id | UUID (FK → auth.users) | CASCADE delete |
| title | TEXT | nullable, can be auto-generated |
| created_at | TIMESTAMPTZ | default NOW() |
| updated_at | TIMESTAMPTZ | default NOW() |

**Indexes:** idx_conversations_user_id
**RLS:** Users can SELECT and INSERT own conversations
**Migration:** 20260207000000_initial_schema.sql

### messages [LIVE]
| Column | Type | Notes |
|--------|------|-------|
| id | UUID (PK) | gen_random_uuid() |
| conversation_id | UUID (FK → conversations) | CASCADE delete |
| role | TEXT | CHECK: 'user' or 'assistant' |
| content | TEXT | NOT NULL |
| created_at | TIMESTAMPTZ | default NOW() |

**Indexes:** idx_messages_conversation_id, idx_messages_created_at
**RLS:** Users can SELECT and INSERT messages in own conversations
**Migration:** 20260207000000_initial_schema.sql

### user_profiles [PLANNED]
Extends auth.users with display_name, avatar_url, preferences (JSONB).

### tasks [PLANNED]
CRUD with status (todo/in_progress/done/archived), priority (low/medium/high/urgent), due_date, project_id FK.

### projects [PLANNED]
Name, description, status (active/completed/on_hold/archived), start_date, target_date.

### goals [PLANNED]
Title, goal_type (short_term/long_term/habit), target_date, status, progress_percentage.

### notes [PLANNED]
Title, content, folder_id FK, tags array.

### events [PLANNED]
Calendar events with start/end times, all_day flag, location, calendar_integration_id.

---

## API Endpoints

### Conversations Module [LIVE]
| Method | Path | Purpose |
|--------|------|---------|
| POST | /conversations | Create chat |
| GET | /conversations | List chats (paginated: limit, offset, sort, order) |
| GET | /conversations/:id | Get chat + messages |
| DELETE | /conversations/:id | Delete chat |

### Messages Module [LIVE]
| Method | Path | Purpose |
|--------|------|---------|
| POST | /messages | Send message, get AI response |
| GET | /messages/conversation/:id | List messages in conversation |

### Auth
All endpoints require: `Authorization: Bearer <supabase_jwt_token>`

### Planned Modules
- Tasks CRUD [PLANNED]
- Projects CRUD [PLANNED]
- Goals CRUD [PLANNED]
- Notes CRUD [PLANNED]
- Events/Calendar [PLANNED]
- User Profiles [PLANNED]

---

## Migration Files
| File | Tables | Status |
|------|--------|--------|
| 20260207000000_initial_schema.sql | conversations, messages + indexes + RLS | Applied |
