# IaC Agent Backend (POC)

Vertical slice: hosts the `02-Requirements` agent behind an HTTP API. Loads the existing
`.github/agents/02-requirements.agent.md` from this repo, runs it against GitHub Models,
and exposes a simple session-based REST API for any frontend to drive.

**This is a POC to validate the hosting pattern.** It runs one agent. It does not
implement auth, streaming, MCP bridging, or handoffs between agents.

## Setup

1. Create a GitHub PAT with `models:read` scope: <https://github.com/settings/tokens>
2. `cd backend`
3. `cp .env.example .env` (PowerShell: `Copy-Item .env.example .env`)
4. Open `.env` and paste your PAT into `GITHUB_TOKEN=`
5. `npm install`
6. `npm run dev`

You should see: `IaC Agent backend listening on http://localhost:3000`

## Endpoints

| Method | Path                                | Purpose                                      |
| ------ | ----------------------------------- | -------------------------------------------- |
| GET    | `/health`                           | Liveness check                               |
| POST   | `/sessions`                         | Start a requirements session                 |
| POST   | `/sessions/:id/answer`              | Reply to the pending `askQuestions` prompt   |
| GET    | `/sessions/:id/artifacts/:name`     | Read a produced artifact                     |
| GET    | `/sessions/:id`                     | Inspect session state (debug)                |

## Try it

Start a session:

```sh
curl -X POST http://localhost:3000/sessions \
  -H "Content-Type: application/json" \
  -d '{ "project": "postgres-dev", "message": "I need a PostgreSQL database in dev" }'
```

Response will be either `{ status: "awaiting_answer", question: {...} }` or
`{ status: "complete", artifactPath: "..." }`.

If awaiting an answer, reply with:

```sh
curl -X POST http://localhost:3000/sessions/<id>/answer \
  -H "Content-Type: application/json" \
  -d '{ "answers": ["No — start from scratch (greenfield)"] }'
```

Repeat until `status: "complete"`, then read the artifact:

```sh
curl http://localhost:3000/sessions/<id>/artifacts/01-requirements.md
```

## Known limitations

- **Tool surface is minimal.** The agent body references `apex-recall`, `azure-mcp/*`,
  `microsoft-learn/*` and other tools not implemented here. The model will see those
  instructions but only has `askQuestions` available. It will skip the unavailable tools.
- **GitHub Models free tier has rate limits** (low requests/min, low tokens/call).
  Expect occasional 429s on the free tier.
- **No streaming** — each `/answer` request blocks until the next pause or completion.
- **Session state is on local disk** under `sessions/`. Does not survive a container restart.
- **No auth.** Anyone hitting `localhost:3000` can spend your token.

## Layout

```
backend/
├── package.json
├── tsconfig.json
├── .env                       # your PAT (gitignored)
└── src/
    ├── server.ts              # Hono app + endpoints
    ├── loader.ts              # Parses .agent.md frontmatter + body
    ├── llm.ts                 # GitHub Models client (OpenAI-compatible)
    ├── state.ts               # Per-session JSON state
    ├── tools/
    │   └── askQuestions.ts    # Tool schema for the LLM
    └── agents/
        └── requirements.ts    # The actual run loop
```
