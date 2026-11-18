# PBMS programme workspace update on 18 November 2026

The current `latest-source/lab/pbms-react/` includes the programme workspace and meeting changes. It is deployed on the original host and retains the existing NSIPA design. The native backend, payment workers and database schema are unchanged by this frontend release.

Clients should start with [setup and upgrade instructions](../../docs/current/PBMS-UPDATE-2026-11-18.md), [completed behavior](../../docs/current/PBMS-PROGRAMME-WORKSPACE.md), and [usage](../../docs/current/USAGE.md). Historical recovery/ZIP packages are installation baselines, not this update's source.

`source-manifest.json` identifies the changed PBMS source and verification scripts using canonical Git blob SHA256 hashes. `verification-summary.json` records the original-host checks without credentials, recordings, beneficiary records or screenshots. Earlier platform source/runtime inventories remain historical baselines.

The update was verified against the existing original-host backend. A fresh-machine replay and real bank settlement are not certified by these navigation checks. Complete destination acceptance from the setup guide.
