NSIPA PBMS current release — 18 November 2026

Client setup: docs/current/PBMS-UPDATE-2026-11-18.md from the repository root.
Use latest-source/lab/pbms-react, not historical ZIP downloads.
Build with Node.js 22: npm ci; npm run build.
For an existing 16/17 November deployment, publish only the new static dist/
through the documented release symlink. No database or addon upgrade is needed
for the 18 November navigation update. Fresh machines need the full installation.

Programmes -> Open now shows programme information, programme benefits, benefit
codes, eligibility rules, entitlement rules, beneficiary lists, Enrollment workflow
and Disbursement workflow. Enrollment/disbursement cycles stay in the sidebar.
User settings and Developer apps shortcuts follow the existing native Odoo groups.
Existing NSIPA design, native approval and payment enforcement are retained.

Read docs/current/INSTALLATION.md and docs/current/PBMS-PAYMENTS.md.
Programme setup -> enrolment -> disbursement -> Payment submits for approval ->
Finance -> Audit -> CEO -> Payment proceeds -> Bridge dispatch/reconciliation.
XLS export remains available. CEO approval alone does not send money.
The eleven red-marked sidebar entries are hidden; supporting routes/data remain.
Configure a sponsor bank route once per programme before payment submission.
The installed Bridge requires whole NGN entitlements; fractional values are rejected.
Existing account usernames/passwords are preserved. No passwords are published.
Build: npm ci; npm run build. Install the native addon, matching payment worker
extensions and session adapter in the sequence documented in INSTALLATION.md.
Tests create synthetic programmes and may send simulator payments. Run them only
in an isolated lab with verified local Example Bank connectors, never as installation.
Supply private approval credentials through PBMS_APPROVAL_ACCOUNTS_FILE.

Programme analytics: state/FCT map with programme/cycle filters and aggregate snapshot counts.
All five PBMS roles can view their assigned programmes. See docs/current/PROGRAMME-ANALYTICS.md.
