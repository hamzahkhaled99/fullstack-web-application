# Best Student Humanizer Web

Production-oriented AI-first writing/research platform (Node.js + Express + Vanilla JS).

## Architecture
- Frontend: `index.html`, `tools.html`, `tools.js`, `styles.css`, `i18n.js`
- Backend: `server.js`
- AI orchestration: `services/tool-orchestrator.js`
- Tool config + wizard contracts: `config/tools/*.json`
- Validation from config: `services/tool-input-validator.js` (Zod)
- Canonical usage input: `services/canonical-input.js`
- Persistence: `services/platform-store.js`
  - PostgreSQL in production
  - JSON fallback (`data/platform-store.json`) in development only
- File pipeline: `services/file-pipeline.js` (PDF/DOCX/TXT/MD parsing + chunking)
- Tool run observability: `services/tool-run-logger.js`

## Security and Runtime Rules
- `DATABASE_URL` is required in production.
- `APP_ORIGIN` is required in production.
- CORS defaults to localhost allowlist in development only.
- `/api/users/by-email` is `admin` only.
- `/api/user/upgrade` is `admin` only.
- `/api/billing/subscription/sync` requires `x-billing-token`.
- No hardcoded production credentials.

## Tool Execution Model
All tools run through the same AI orchestrator path:
- `POST /api/tools/run`
- `POST /api/tools/run/stream` (SSE)

Legacy route (still supported):
- `POST /api/ai/:tool` (internally routed to orchestrator)

## Tool Groups (16)
Core Tools:
1. Research Fusion
2. Humanizer Pro
3. Research Copilot
4. Essay Architect
5. Lecture Notes AI
6. Authenticity Report
7. Smart Editor

Advanced Writing:
1. Citation Agent
2. Plagiarism Checker
3. Methodology Builder
4. Paraphrase by Level
5. Thesis Generator
6. Outline to Draft

Quality & Review:
1. PDF/Doc Analyzer
2. Style Heatmap
3. Submission Readiness

## Environment Variables
Required in production:
- `NODE_ENV=production`
- `DATABASE_URL`
- `APP_ORIGIN`

Common:
- `OPENAI_API_KEY`
- `OPENAI_MODEL` (default `gpt-4o-mini`)
- `AI_TIMEOUT_MS`
- `MAX_UPLOAD_MB`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `PG_SSL`
- `SESSION_TTL_MS`
- `ADMIN_EMAILS` (optional)
- `BILLING_SYNC_TOKEN` (required only if using billing sync endpoint)

Dev-only optional demo user:
- `ENABLE_DEV_DEMO_USER=1`
- `DEV_DEMO_EMAIL`
- `DEV_DEMO_NAME`
- `DEV_DEMO_PLAN`

## Local Development
1. Install:
```bash
npm install
```
2. Configure:
```bash
copy .env.example .env
```
3. Start:
```bash
npm run dev
```
4. Open:
- `http://localhost:3000`

## Migration from legacy JSON
See `MIGRATION.md`.

## Notes
- PDF/Word export is available from tool UI.
- Authenticity/plagiarism outputs are heuristic and explicitly limited.
- Citation agent does not fabricate references.
