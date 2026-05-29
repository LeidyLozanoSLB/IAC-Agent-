---
description: "Produce a focused architecture assessment based on completed requirements."
agent: "03-Architect"
---

# Step 2 — Architecture Assessment

Resume the multi-step workflow at Step 2. Produce a focused architecture assessment that
feeds the IaC Planner. No WAF pillar scoring, no external doc research, no cost estimation.

## Prerequisites

- `agent-output/{project}/01-requirements.md` must exist (Step 1 complete)
- `agent-output/{project}/00-session-state.json` with `steps.1.status = "complete"`

## Variables

- `{project}`: project folder name under `agent-output/`

## Instructions

1. Read `agent-output/{project}/00-session-state.json` to identify the project name, IaC tool,
   region, and current step.
2. Read `agent-output/{project}/01-requirements.md` for the full requirements from Step 1.
3. Read `.github/skills/azure-defaults/SKILL.digest.md` for region, naming, security baseline,
   AVM-first rules, and the Deprecated Services table.
4. Recommend specific Azure resources and SKUs/tiers justified by the requirements and environment.
5. Document key architectural decisions (private networking, identity, redundancy).
6. Select the Azure Verified Module (and version) for each resource — this feeds the IaC Planner.
7. Identify any hard blockers or risks specific to the request.
8. Save the assessment to `agent-output/{project}/02-architecture-assessment.md` using the
   structure: `## Resources`, `## Key Decisions`, `## AVM Modules`, `## Risks / Blockers`.
9. Run `npm run lint:artifact-templates` and fix any errors.
10. Update `agent-output/{project}/00-session-state.json`: mark Step 2 `complete`.

## Constraints

- Do NOT score WAF pillars or generate `02-waf-scores.py/.png` — removed for performance.
- Do NOT fetch Microsoft Learn URLs or perform external documentation research — rely on azure-defaults.
- Do NOT generate `03-des-cost-estimate.md`, any cost charts, or include dollar figures.
- Do NOT run adversarial/challenger review at this step — disabled for performance.
- Do NOT change any Step 1 decisions (IaC tool, region, compliance) — only build on them.
- All Azure resources must use `swedencentral` unless requirements specify otherwise.
- AVM-first: always recommend an Azure Verified Module before a raw resource.
