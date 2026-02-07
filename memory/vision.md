# Project Vision

Living document. Updated as conversations reveal new insights about what we're building and why.

---

## North Star

The foundational "why" — this should rarely change.

**Mission:** Build a personal development and productivity platform where users can plan, track, and reflect on their lives with an AI companion that has full context awareness.

**Core Insight:** Most productivity tools aren't compelling enough to drive daily engagement. The system needs to be beautiful yet powerful — solving the retention problem that kills most productivity apps.

**Key Differentiator:** An AI that accesses ALL user context to be both proactive and reactive. Not just a chatbot — a companion that knows your goals, sees your tasks, reads your notes, and connects the dots you miss.

**Who it's for:** Initially Felipe (dogfooding), then individuals who want a single system for their entire life — not 5 separate apps stitched together.

---

## Product Vision

What the finished product looks and feels like, organized by capability. Each section describes the destination, not the current state. Tag items with priority:

- `[CORE]` — Essential to the product identity. Build first.
- `[IMPORTANT]` — Significantly enhances the experience. Build soon after core.
- `[FUTURE]` — Nice to have, builds on top of core + important.

### AI Companion [CORE]
The AI is the central nervous system, not a sidebar feature.
- Full context awareness across all user data (conversations, tasks, goals, calendar, notes)
- Proactive suggestions ("You have a deadline Friday but no tasks scheduled — want to plan?")
- Reactive assistance (answer questions, help plan, debug thinking)
- Personality that feels like a trusted advisor, not a corporate bot
- Memory that persists — the AI remembers past conversations and builds a model of the user over time

### Chat Interface [CORE]
- Persistent conversation history
- Context-aware responses (AI knows what user is working on)
- Auto-generated titles
- Future: streaming responses for better UX

### Task & Project Management [CORE]
- Tasks with status, priority, due dates
- Projects as containers for related tasks
- Task ↔ project relationships
- AI can suggest tasks, flag overdue items, help prioritize

### Goals & Tracking [IMPORTANT]
- Short-term and long-term goals with progress tracking
- Habits tracking
- AI connects daily actions to stated goals ("You said you wanted to launch by Q2 — here's where you stand")
- Periodic reviews with AI-generated insights

### Calendar Integration [IMPORTANT]
- View and manage events
- Third-party calendar sync (Google Calendar, etc.)
- AI can reference calendar context ("You have a meeting with X tomorrow — want to prep?")

### Notes & Documents [IMPORTANT]
- Rich text notes with folder organization
- Tags for cross-referencing
- AI can search and reference notes in conversation

### Whiteboards [FUTURE]
- Visual thinking canvas
- Potentially collaborative
- AI can analyze whiteboard content

### Analytics & Reflection [FUTURE]
- Personal dashboards (productivity trends, goal progress, time allocation)
- AI-generated weekly/monthly summaries
- Pattern recognition ("You're most productive on Tuesdays")

---

## Design Philosophy

Principles that guide every decision:

1. **Beautiful yet powerful** — If it doesn't look good, people won't open it. If it's not useful, they won't come back.
2. **AI-first, not AI-added** — The AI isn't a feature bolted on. It's the foundation everything else connects through.
3. **Single system** — One place for everything. The value compounds when data lives together.
4. **Proactive > Reactive** — The best assistant doesn't wait to be asked. It notices and suggests.
5. **Context is king** — Every feature is better when the AI can see it. Every piece of data makes the AI smarter.

---

## Roadmap

Concrete phases connecting current work to the vision. Cross-reference with `memory/project-state.md` for detailed status.

### Phase 1: Chat Foundation (Current)
**Goal:** Working AI chat with persistent history.
**Vision connection:** Establishes the AI companion as the first interaction point.
- 1A: Backend foundation ✓
- 1B: Chat functionality ✓
- 1B+: Testing infrastructure ✓
- 1C: Local validation + cloud connection (pending)
- 1D: Frontend chat UI (not started)

### Phase 2: Productivity Core
**Goal:** Tasks, projects, and goals — turning chat into action.
**Vision connection:** Moves from "AI chat" to "AI-powered productivity system."
- User profiles
- Tasks module (CRUD, status, priority, due dates)
- Projects module (task containers)
- Goals module (tracking, progress)
- AI integration: suggest tasks, connect goals to actions

### Phase 3: Context Expansion
**Goal:** Calendar, notes, whiteboards — giving the AI full context.
**Vision connection:** This is where the "full context awareness" differentiator kicks in.
- Calendar integration (view + third-party sync)
- Notes module (rich text, folders, tags)
- Whiteboards (visual canvas)
- AI integration: reference calendar/notes in conversations

### Phase 4: Intelligence Layer
**Goal:** Proactive AI, analytics, reflection.
**Vision connection:** The AI stops being reactive and starts being a true companion.
- Proactive suggestions engine
- Personal analytics dashboards
- Weekly/monthly AI summaries
- Pattern recognition
- Habit tracking integration

### Phase 5: Polish & Scale
**Goal:** Production-ready, potentially multi-user.
**Vision connection:** From personal tool to product.
- Performance optimization
- Mobile (PWA or React Native)
- Multi-user support (if desired)
- OAuth providers
- Public launch preparation

---

## Open Questions

Things we haven't decided yet that affect the vision:

- **Mobile strategy:** PWA vs. native app? Affects UX ambitions significantly.
- **Multi-user:** Is this ever more than a personal tool? Affects architecture.
- **Monetization:** If this becomes a product, how? Subscription? Freemium?
- **AI model flexibility:** Should users be able to choose their AI model? Or is one model the "brain"?
- **Data portability:** Can users export everything? Important for trust.
- **Offline support:** How much works without internet? Affects architecture deeply.

---

## Vision Changelog

Track when and why the vision evolves.

| Date | Change | Trigger |
|------|--------|---------|
| Feb 7, 2026 | Initial vision defined | Session 1 — project kickoff |
