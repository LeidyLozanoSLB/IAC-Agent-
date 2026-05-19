# Company Azure Policy Document

> Copy this file to `company-policies.md` in this same directory and fill in each section.
> The Governance agent reads `company-policies.md` as its sole source of truth.
> Leave sections as "None defined" if no constraints exist — do not delete sections.

---

## Section 1 — Allowed Regions

List every Azure region that resources may be deployed to.
Use the Azure region name format (e.g. `swedencentral`, `westeurope`, `eastus2`).

```
- swedencentral
- westeurope
```

---

## Section 2 — Required Tags

List every tag that must be present on all Azure resources.
Provide the tag name and a description of what value is expected.

| Tag Name    | Description                                       | Required Value / Format          |
| ----------- | ------------------------------------------------- | -------------------------------- |
| Environment | Deployment environment                            | `dev`, `staging`, or `prod`      |
| Project     | Project or workload identifier                    | Short alphanumeric slug          |
| ManagedBy   | IaC tool that manages this resource               | `Bicep`                          |
| Owner       | Team or individual responsible for the resource   | Email address or team alias      |

> Add rows for any additional required tags. Remove example rows and replace with actuals.

---

## Section 3 — Deny Policies

List every policy that actively blocks deployment (`effect: Deny`).
Each entry requires an Azure property path and a Bicep property path so the
CodeGen agent can translate the constraint into correct Bicep parameters.

### Policy: [Policy Name]

- **Applies to resource types**: `Microsoft.Provider/resourceType`
- **Azure property path** (`azurePropertyPath`): `properties.propertyName`
- **Bicep property path** (`bicepPropertyPath`): `propertyName`
- **Required value**: `value`
- **Reason**: Why this policy exists

> Example:
>
> ### Policy: Require minimum TLS 1.2 on storage accounts
> - **Applies to resource types**: `Microsoft.Storage/storageAccounts`
> - **Azure property path**: `properties.minimumTlsVersion`
> - **Bicep property path**: `minimumTlsVersion`
> - **Required value**: `TLS1_2`
> - **Reason**: Security baseline — TLS 1.0 and 1.1 are deprecated

---

## Section 4 — Security Baselines

List security requirements that apply across all resources or specific resource types.
Each entry is translated to a `deny`-effect policy in the output JSON.

### Baseline: [Baseline Name]

- **Applies to resource types**: `Microsoft.Provider/resourceType` (or `all`)
- **Azure property path**: `properties.propertyName`
- **Bicep property path**: `propertyName`
- **Required value**: `value`
- **Reason**: Security justification

> Examples of common security baselines:
>
> - HTTPS-only traffic (`properties.httpsOnly: true`)
> - Disable public blob access (`properties.allowBlobPublicAccess: false`)
> - Require Managed Identity (`identity.type: SystemAssigned`)
> - Disable local authentication on Key Vault (`properties.disableLocalAuth: true`)

---

## Section 5 — Network Policies

List network constraints that apply to resources.
Each entry is translated to a `deny`-effect policy in the output JSON.

### Policy: [Network Policy Name]

- **Applies to resource types**: `Microsoft.Provider/resourceType`
- **Azure property path**: `properties.networkAcls.defaultAction` (example)
- **Bicep property path**: `networkAcls` (example)
- **Required value**: `Deny` (example)
- **Reason**: Network isolation requirement

> Examples of common network policies:
>
> - Require private endpoints for storage accounts
> - Deny public network access on databases
> - Require VNet integration for App Services

---

## Section 6 — SKU Restrictions

List SKU or tier restrictions. Each entry blocks deployment of disallowed SKUs.
Translated to `deny`-effect, `classification: blocker` entries in the output JSON.

| Resource Type | Allowed SKUs / Tiers | Blocked SKUs / Tiers | Reason |
| ------------- | -------------------- | -------------------- | ------ |
| `Microsoft.Sql/servers/databases` | `GP_Gen5_2`, `GP_Gen5_4` | `Basic`, `Free` | Cost control |

> Add rows for each resource type with SKU restrictions.
> Leave as "None defined" if no SKU restrictions exist.

---

## Section 7 — Allowed/Blocked Resource Types

(Optional) List resource types that are explicitly allowed or blocked.
Allowed types translate to `audit`/`informational`; blocked types translate to `deny`/`blocker`.

### Allowed Resource Types

List resource types that are explicitly permitted (others may still be used unless blocked):

```
- Microsoft.Storage/storageAccounts
- Microsoft.Sql/servers
- Microsoft.Web/sites
```

### Blocked Resource Types

List resource types that are explicitly prohibited:

```
- Microsoft.ClassicCompute/virtualMachines
- Microsoft.ClassicStorage/storageAccounts
```

> Leave both lists as "None defined" if no resource type restrictions exist.

---

## Section 8 — Override Policy Rules

List any approved exceptions to the policies above.
Each override **must** include all three fields: `reason`, `issue_link`, and `expiry`.
An override missing any field, or with a past `expiry` date, is treated as a blocker.

### Override: [Policy Name Being Overridden]

- **Policy**: Name of the Deny policy being overridden
- **Reason**: Business justification for the exception
- **Issue link**: URL to the ticket, approval record, or change request
- **Expiry**: `YYYY-MM-DD` — date after which the override is no longer valid

> Example:
>
> ### Override: Require minimum TLS 1.2 on storage accounts
> - **Policy**: Require minimum TLS 1.2 on storage accounts
> - **Reason**: Legacy integration with third-party system requires TLS 1.0 until Q3 migration
> - **Issue link**: https://jira.example.com/browse/INFRA-4521
> - **Expiry**: 2026-09-30

---

> Generated from `company-policies.template.md` | Copy to `company-policies.md` and fill in actuals.
