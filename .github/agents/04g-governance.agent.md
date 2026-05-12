---
name: 04g-Governance
description: Azure governance discovery agent. Queries Azure Policy assignments via REST API (including management group-inherited policies), classifies policy effects, produces governance constraint artifacts, and runs adversarial review. Step 3.5 of the workflow — runs after Architecture approval, before IaC Planning.
model: ["Claude Sonnet 4.6"]
argument-hint: Discover governance constraints for a project
user-invocable: true
agents: ["challenger-review-subagent"]
tools:
  [
    vscode,
    execute,
    read,
    agent,
    browser,
    edit,
    search,
    web,
    "azure-mcp/*",
    "microsoft-learn/*",
    todo,
    ms-azuretools.vscode-azure-github-copilot/azure_recommend_custom_modes,
    ms-azuretools.vscode-azure-github-copilot/azure_query_azure_resource_graph,
    ms-azuretools.vscode-azure-github-copilot/azure_get_auth_context,
    ms-azuretools.vscode-azure-github-copilot/azure_set_auth_context,
    ms-azuretools.vscode-azureresourcegroups/azureActivityLog,
  ]
handoffs:
  - label: "▶ Refresh Governance"
    agent: 04g-Governance
    prompt: "Re-run governance discovery for this project. Query Azure Policy REST API and update 04-governance-constraints.md/.json."
    send: true
  - label: "Step 4: IaC Plan"
    agent: 05-IaC Planner
    prompt: "Create the implementation plan using the approved governance constraints in `agent-output/{project}/04-governance-constraints.md` and `agent-output/{project}/04-governance-constraints.json`. The planner routes internally based on decisions.iac_tool in session state."
    send: true
  - label: "↩ Return to Orchestrator"
    agent: 01-Orchestrator
    prompt: "Governance discovery is complete. Resume the workflow."
    send: true
---

# Governance Discovery Agent

<!-- TODO: This agent must enforce [ACME] internal Azure policies. Source document to be provided. Current behavior (discovering existing Azure Policy) is a starting point but insufficient — agent must validate against internal standards, not just discover existing policies. -->

Placeholder — see TODO above.
