# Internal Team Workspaces and IT Operations

## Goal
Turn each existing Clovr HQ workspace into a distinct, working internal product for a 100+ person organization, while keeping shared identity, permissions, people, calendar, mail, files, and administration centralized.

## Build scope

### 1. Shared workspace foundation
- Create a reusable workspace dashboard framework with team-specific KPIs, queues, activity, shortcuts, ownership, empty/loading/error states, and live database reads.
- Preserve the existing workspace picker, app identities, layouts, role-aware navigation, and organization access engine.
- Make every team dashboard actionable: records open into existing operational pages, people use profile popovers, and access remains enforced by existing route permissions.

### 2. Custom team products
- **Mission Operations:** incident command overview, active deployments, readiness, shift coverage, safety alerts, situation reports, and response handoffs.
- **Engineering:** project portfolio, milestones, requirements/issues, design reviews, ECOs, BOM health, CAD/document status, firmware, and test readiness.
- **Fleet & Supply:** aircraft readiness, maintenance/service due, inventory risks, work orders, inspections, suppliers, purchase orders, receiving, and deployment availability.
- **Research & Partners:** partner portfolio, research requests, knowledge, timelines, support queues, communications, and collaboration follow-ups.
- **Funding:** donor/grant pipeline, proposals, restricted budgets, invoices/expenses, funding coverage, reporting, and upcoming deadlines.
- **People & Operations:** headcount, recruiting, onboarding, attendance, leave, training/certifications, performance, and organization health.
- **HQ / Executive:** cross-workspace mission status, organizational risks, funding runway, people capacity, fleet readiness, and decision queue.

### 3. IT operations console
- Add a dedicated IT workspace and dashboard for app registry, environment/integration status, access administration, audit/security events, service health, and internal support.
- Move workspace and Slack settings into focused IT sections while retaining administrator authorization.
- Add Slack App User Connector support so each signed-in authorized user connects their own Slack identity/workspace data through the connector gateway.
- Provide bot/configuration surfaces for permitted channels, capabilities, status, and safe test actions; never expose OAuth credentials or connection keys in the browser.

### 4. Data and security
- Reuse existing engineering, manufacturing/fleet, support, finance, HR, organization, app-registry, and security tables before adding schema.
- Add only missing tables needed for IT-managed integration metadata, bot configuration, health checks, or team dashboard preferences.
- Any new tables will include explicit grants, RLS, administrator/team policies, audit timestamps, and server-only encrypted connector key storage where required.
- Privileged integration calls will use authenticated server functions with server-side admin verification; provider tokens and connector handles stay encrypted and server-only.

### 5. Validation
- Verify every workspace as an administrator and as a restricted team member.
- Test dashboard reads, links, filters, empty/error states, Slack connect/disconnect and safe API calls, responsive layouts, light/dark themes, and browser console/network health.
- Confirm unique route metadata and no regressions to public pages, login, onboarding, workspace selection, or current permission resolution.

## Technical approach
- Introduce shared dashboard primitives and typed team-dashboard definitions, then implement each workspace as a focused module rather than one conditional mega-dashboard.
- Keep browser reads under existing RLS where appropriate; put protected aggregation and integration work in thin `createServerFn` wrappers with server-only helpers.
- Use the current `org_apps`, `org_units`, `org_roles`, route mapping, `my_access()`, app theming, and `?app=` tab model as the source of truth.
- Roll out in phases: foundation + HQ/IT, mission/engineering/fleet, research/funding/people, then cross-workspace analytics and hardening.
