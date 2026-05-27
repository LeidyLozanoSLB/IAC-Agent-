import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import {
  continueRequirements,
  startRequirements,
} from "./agents/requirements.js";
import { load, SESSIONS_ROOT } from "./state.js";

const app = new Hono();

app.get("/health", (c) => c.json({ status: "ok" }));

/**
 * Start a new requirements session.
 * Body: { project: string, message: string }
 */
app.post("/sessions", async (c) => {
  try {
    const body = await c.req.json<{ project?: string; message?: string }>();
    if (!body.project || !body.message) {
      return c.json(
        { error: "both 'project' and 'message' are required" },
        400
      );
    }
    const result = await startRequirements(body.project, body.message);
    return c.json(result);
  } catch (e: any) {
    console.error("[POST /sessions] error:", e);
    return c.json({ error: e.message ?? "unknown error" }, 500);
  }
});

/**
 * Reply to the pending askQuestions.
 * Body: { answers: string | string[] | string[][] }
 */
app.post("/sessions/:id/answer", async (c) => {
  try {
    const body = await c.req.json<{ answers?: unknown }>();
    if (body.answers === undefined) {
      return c.json({ error: "'answers' is required" }, 400);
    }
    const result = await continueRequirements(c.req.param("id"), body.answers);
    return c.json(result);
  } catch (e: any) {
    console.error(`[POST /sessions/${c.req.param("id")}/answer] error:`, e);
    return c.json({ error: e.message ?? "unknown error" }, 500);
  }
});

/** Debug helper — inspect a session's full state. */
app.get("/sessions/:id", (c) => {
  try {
    return c.json(load(c.req.param("id")));
  } catch (e: any) {
    return c.json({ error: e.message }, 404);
  }
});

/** Read a produced artifact (e.g. 01-requirements.md). */
app.get("/sessions/:id/artifacts/:name", (c) => {
  const path = join(
    SESSIONS_ROOT,
    c.req.param("id"),
    "agent-output",
    c.req.param("name")
  );
  if (!existsSync(path)) return c.json({ error: "artifact not found" }, 404);
  return c.text(readFileSync(path, "utf-8"));
});

const port = Number(process.env.PORT ?? 3000);
serve({ fetch: app.fetch, port });
console.log(`IaC Agent backend listening on http://localhost:${port}`);
