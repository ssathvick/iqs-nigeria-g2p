# Programme workspace update on 18 November 2026

Opening a programme now shows its information, assigned benefits, eligibility and entitlement rules, beneficiary lists, and enrollment/disbursement workflow tabs in one programme context. Existing NSIPA branding, typography, forms, tables, approval dialogs and responsive navigation are retained.

The meeting's final decision kept **Enrollment cycles** and **Disbursement cycles** in the sidebar. Beneficiary lists, Eligibility rules, Entitlement rules, Benefit codes and Programme benefits move into programme tabs. Programme approval flow, analytics, approvals and payments remain available across programmes.

## Behavior

- `#programme-detail?program_id=…` opens programme information. The other programme tabs retain `program_id` in their URLs.
- A visible programme selector supports switching and refresh persistence. Older unscoped links to moved sections request a programme rather than combining their records.
- Embedded tables query native PBMS with the selected programme domain. New scoped records prefill and disable the programme selector; related cycle selectors are filtered to the programme. Native ACLs and rules continue to enforce access.
- Workflow tabs read saved frequency, verification and automatic-approval settings. Approval-flow programmes also display their configured Finance, Audit and CEO groups. Workflow lists are filtered by both programme and enrollment/disbursement stage; opening a list uses the existing native-backed review journey.
- Benefit codes remain shared master data. Their tab defaults to assigned codes; the explicitly labelled shared catalogue supports master-code management. Programme benefits controls assignments.
- Cycle sidebar links retain programme context when opened from a programme. Related cycle-to-list navigation carries both programme and cycle IDs.
- User access settings links require native `base.group_erp_manager`; Developer apps requires `base.group_system`. Both open existing native Odoo actions via `/web?native=1`. Frontend visibility does not grant native permissions.

The administration entry was discussed as a possible follow-up and is included. No native models, permission assignments, approval decisions, financial values, payment workers or database schemas are modified by this frontend release.

## Build and release

Use the [18 November client setup and upgrade guide](PBMS-UPDATE-2026-11-18.md) for exact build, deployment, verification and rollback commands. Fresh machines follow the full installation guide.

Build `latest-source/lab/pbms-react` with its lockfile and `npm run build`. Publish the generated static files using the existing immutable-release/current-symlink mechanism, preserving the previous release for rollback. No addon upgrade or payment-worker restart is needed for this change.

On the original host the previous static release is retained in the PBMS release directory; the matching private backup manifest records its path. Roll back by atomically restoring that recorded current symlink. No database rollback is required for this frontend update.

## Verification

`test-meeting-20261118.cjs` checks the five PBMS roles using existing synthetic fixtures: sidebar composition, programme opening, all seven tabs, exact native counts, scoped forms, programme switching/reload, existing list review, administration visibility and mobile overflow. `test-meeting-admin-20261118.cjs` verifies the native user/app actions with a system administrator. They perform read-only navigation and do not approve lists, change access or dispatch payments. Both require a destination URL and private account file through environment variables; no original-host credential paths are embedded. See the setup guide for fixture requirements and inputs.

Set `PBMS_TEST_DEPLOYED=1` to test served files; otherwise the browser substitutes the local build. `PBMS_TEST_ROLE` can select a single role for diagnosis. Never publish the private credential files or raw beneficiary screenshots.

A new approval write cycle, real bank settlement and a fresh-machine installation are outside this navigation verification. Existing approval/payment validation is documented in [PBMS payments](PBMS-PAYMENTS.md).

## Meeting trace

| Requirement | Recording reference |
| --- | --- |
| Programme grouping and shared benefits | 00:01–03:04 |
| Final sidebar and cycle decision | 03:34–04:42 |
| Enrollment and disbursement workflow tabs | 04:42–05:02 |
| User settings and developer apps | 07:46–09:44 |

The agreement to use the existing meeting chat for faster clarification (09:50–10:22) is a communication process, with no application change required.
