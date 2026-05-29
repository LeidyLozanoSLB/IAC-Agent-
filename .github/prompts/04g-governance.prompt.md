---
description: "Read the company policy document and produce governance constraint artifacts for IaC planning."
agent: "04g-Governance"
argument-hint: "Discover governance constraints for a project"
---

# Step 3.5 — Governance Discovery

Produce governance constraint artifacts from the company policy document before IaC planning begins.

## Prerequisites

- `agent-output/{project}/00-session-state.json` (Step 2 complete)
- `.github/skills/governance/company-policies.md` **must exist** — sole source of policy truth

## Instructions

1. Read `agent-output/{project}/00-session-state.json` to confirm Step 2 is complete.
2. Read `agent-output/{project}/02-architecture-assessment.md` for the planned resource list.
3. Run live subscription policy discovery (agent body Step 0): query Azure Policy assignments
   in the target subscription. If the live check fails, fall back gracefully — do NOT hard-stop.
4. Check whether `.github/skills/governance/company-policies.md` exists.
   If it does **not** exist, stop immediately and show this message — do not proceed:

   > ⛔ Company policy document not found at `.github/skills/governance/company-policies.md`.
   > Please add this file before running the Governance agent. See the template at
   > `.github/skills/governance/company-policies.template.md`.

5. Follow the agent body Steps 0–6 to discover, read, parse, MERGE (document is the floor),
   and produce both output files.
6. Save `agent-output/{project}/04-governance-constraints.md` (human-readable).
7. Save `agent-output/{project}/04-governance-constraints.json` (machine-readable; includes
   `discovery_source` = `live+policy-doc` or `policy-doc-only (live check failed)`).
8. Update `agent-output/{project}/00-session-state.json`: set `steps["3_5"].status = "complete"`.
9. Present findings summary and hand off to Step 4 (IaC Planning).

## Constraints

- Sources: live Azure Policy assignments MERGED with `company-policies.md` (the floor) — live
  discovery adds to the document, never removes from it; keep the stricter of any duplicate.
- If the live check fails (auth, timeout, permissions), fall back to policy-doc-only and set
  `discovery_source` accordingly — do NOT hard-stop.
- Both output files are required — do not skip either.
- If the policy document is missing, stop with the error message above — do not proceed silently.
- Challenger/adversarial review is DISABLED for performance — do not run a challenger pass at this step.
