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
3. Check whether `.github/skills/governance/company-policies.md` exists.
   If it does **not** exist, stop immediately and show this message — do not proceed:

   > ⛔ Company policy document not found at `.github/skills/governance/company-policies.md`.
   > Please add this file before running the Governance agent. See the template at
   > `.github/skills/governance/company-policies.template.md`.

4. Follow the agent body Steps 1–6 to read, parse, and produce both output files.
5. Save `agent-output/{project}/04-governance-constraints.md` (human-readable).
6. Save `agent-output/{project}/04-governance-constraints.json` (machine-readable).
7. Run adversarial review via `challenger-review-subagent` with
   `artifact_type=governance-constraints`, `review_focus=comprehensive`, `pass_number=1`.
8. Apply all `must_fix` findings and re-validate.
9. Update `agent-output/{project}/00-session-state.json`: set `steps["3_5"].status = "complete"`.
10. Present findings summary and hand off to Step 4 (IaC Planning).

## Constraints

- Source of truth is `company-policies.md` only — do NOT query Azure, authenticate, or run scripts.
- Both output files are required — do not skip either.
- If the policy document is missing, stop with the error message above — do not proceed silently.
