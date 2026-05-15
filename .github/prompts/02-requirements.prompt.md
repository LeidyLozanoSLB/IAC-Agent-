---
description: "Gather Azure resource requirements through focused questioning and produce 01-requirements.md."
agent: "02-Requirements"
argument-hint: "Describe the Azure resource or project you want to provision"
---

# Step 1 — Gather Requirements

Capture requirements for an Azure resource provisioning request.

## Prerequisites

- `agent-output/{project}/00-session-state.json` should exist (created by Orchestrator)
- The resource type is already known from the user's initial request (passed via Orchestrator)

## Variables

- `{project}`: project folder name under `agent-output/`

## Instructions

1. Read `agent-output/{project}/00-session-state.json` to identify the project and current state.
2. Use `askQuestions` to gather requirements — up to 5 focused questions:
   - **Q1**: Environment (dev / staging / prod)
   - **Q2**: Azure region
   - **Q3**: Connectivity (who/what connects to this resource)
   - **Q4**: Additional requirements (open-ended catch-all)
   - **Q5**: SKU / Tier (conditional — only if resource type has meaningful tier choices)
3. Skip any question already answered in the Orchestrator handoff context.
4. Read `.github/skills/azure-artifacts/references/01-requirements-template.md` for doc structure.
5. Read `.github/skills/azure-defaults/SKILL.digest.md` for defaults (region, tags, security).
6. Generate `agent-output/{project}/01-requirements.md` — concise, fact-based.
7. Invoke the `challenger-review-subagent` for adversarial review (1 pass).
8. Apply `must_fix` findings and re-validate.
9. Update session state: mark Step 1 `complete`.

## Constraints

- Do NOT re-ask the resource type — it's already known from the Orchestrator handoff.
- Do NOT ask about naming conventions — write "to be applied — standard pending definition".
- Do NOT ask about HIPAA, compliance, industry, company size, or workload patterns.
- Do NOT hardcode SKUs — leave sizing to Step 2 (Architecture).
- IaC tool is always Bicep — do not ask.
