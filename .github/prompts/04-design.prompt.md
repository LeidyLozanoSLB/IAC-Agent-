---
description: "Generate the architecture diagram (Mermaid) and optional ADRs. Optional step — can be skipped."
agent: "04-Design"
model: "Claude Sonnet 4.6"
---

# Step 3 — Design Artifacts (Optional)

Generate a Mermaid architecture diagram (and optional ADRs) for the approved architecture.
No MCP server required — Mermaid renders natively in markdown.

## Expected Variables

- `{project}` — project folder name under `agent-output/`

## Inputs

Required:

- `agent-output/{project}/01-requirements.md`
- `agent-output/{project}/02-architecture-assessment.md`

Optional (read if present, do NOT hard-stop if missing):

- `agent-output/{project}/04-governance-constraints.md` — allowed regions, required tags, network policies
- `agent-output/{project}/04-implementation-plan.md` — final resource names, dependency order

## Instructions

1. Read the required input files. Read optional inputs if they exist.
2. Generate a single `graph TD` Mermaid diagram embedded in markdown — see the diagram
   spec in `04-design.agent.md` Phase 2.
3. Save to `agent-output/{project}/04-architecture-diagram.md`.
4. Checkpoint: `apex-recall checkpoint <project> 3 design-diagram-complete --json`
5. Optionally generate ADRs (`03-des-adr-NNNN-*.md`) if non-obvious decisions need recording.
6. Update `agent-output/{project}/README.md` — mark Step 3 complete, link the diagram.
7. Hand off back to the Orchestrator with a one-line summary.

## Constraints

- This step is optional. If the user says "skip", mark Step 3 as `skipped` and proceed.
- One diagram, one file — do not generate multiple separate diagram files.
- Markdown + embedded Mermaid only — no PNG, no .py, no .drawio.
- Do NOT require any MCP server or external skill file.
- Do NOT hard-stop if `04-governance-constraints.md` or `04-implementation-plan.md` is missing.
- Brownfield: existing resources styled with `:::existing` class (dashed border) + legend.
- Greenfield: all resources use default styling, no legend.
- No challenger review is required for this step.
