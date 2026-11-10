## Current NSIPA project backup — 10 November 2026

See [updated source backup and consolidated report](source-snapshots/2026-11-10-nsipa/README.md). This is a credential-free source/documentation snapshot; older packages below are historical.

# IQS Nigeria G2P recovery repository

Private handoff of the Nigeria OpenG2P synthetic sandbox installation kit, newer custom source, and operations documentation. The complete platform is not yet a verified one-click installer or a production-ready CCT system.

## Start here

Read **[DEVELOPER-SETUP.md](DEVELOPER-SETUP.md)** for system requirements, developer access, and step-by-step instructions.

* **Quick standalone UX/KMS preview:** run `Start-Experience-Preview.bat`. This runs a small, separate Experience Kit; it is not the complete NigeriaG2P site.
* **Full sandbox installation:** run `Prepare-Full-Lab.bat` to verify and extract the original kit, then follow the staged guide. `Install-WSL-Ubuntu.bat` can install WSL and Ubuntu 22.04 when needed. Full installation and the newer feature overlay remain manual and have not been verified on a clean machine.
* **Exact operational state:** obtain a separately encrypted private backup and its key through approved channels. GitHub does not contain live databases, passwords, private keys or tunnel credentials. Do not run a recovered public tunnel against the existing site.
* **Field mobile demo:** the [v3 packages](downloads/v3/README.md) include a test-signed Android sample and an iPhone/iPad web preview. Supervisor authentication is not implemented. The older [React Native prototype](mobile-app/README.md) is separate.

## Download and use on another machine

Sign in to GitHub using an account with access, then clone this repository:

```powershell
git clone https://github.com/ssathvick/iqs-nigeria-g2p.git
Set-Location iqs-nigeria-g2p
Expand-Archive -LiteralPath .\IQS-Nigeria-G2P-Recovery-Bundle.zip -DestinationPath .\recovery
```

Alternatively use **Code → Download ZIP**, extract it, then extract the recovery bundle inside it.

The historical reference tree is in `recovery/iqs-nigeria-g2p/`. Begin with its `README.md` and `docs/REINSTALL.md`, then follow the installation Word guide. The archive preserves folder structure and the pinned chart kit; it is not an executable installer and predates `latest-source/`.

## Included

| Contents | Location inside the recovery bundle |
| --- | --- |
| Installation kit with chart dependencies and retained patches | `installation/` |
| Project scripts, startup launchers, registration source and templates | `lab/` |
| IQS branding assets | `lab/branding/` |
| Installation, operations and Cloudflare Word guides | `docs/guides/` |
| Illustrated UX improvement plan | `docs/ux/` |
| Submitted SOW, SOP and delivery framework | `docs/scope/` |
| Recorded versions, image digests and synthetic fixtures | `inventory/` |
| File integrity inventory | `MANIFEST.sha256.json` |

The principal Word documents are also available individually at the repository root for convenient download.

## Integrity check

Compare this command's output with `BUNDLE.sha256` before extracting:

```powershell
Get-FileHash .\IQS-Nigeria-G2P-Recovery-Bundle.zip -Algorithm SHA256
```

## Important reproduction boundaries

Generate fresh passwords, keys, certificates and Cloudflare tunnel credentials on the new machine. This repository excludes the current account passwords, live client secrets, private keys, kubeconfig, database dumps, recordings and runtime backups.

The original WSL2 installation and registration integration have been exercised. Clean-machine replay and the native Ubuntu adaptation have not yet been executed. Follow the staged guide and complete its destination acceptance checks. Some diagnostic scripts reference original fixture IDs and are reference only; do not run all scripts indiscriminately.

Git stores source and documentation, not the running application's database or persistent volumes. For an exact migration, retain a separate encrypted runtime backup. The included environment is a synthetic sandbox with simulated integrations, not a production service or live payment deployment.

Third-party software retains its respective licenses and notices. Project documents are stored privately; no open-source license is assigned to them.

Archived 4 October 2026.

## Newer developer source snapshot (28 October 2026)

`latest-source/` contains a source snapshot based on the separate UX/KMS repository, overlaid with matching current local lab files and selected newer analytics, simulation and Phase 1 modules. See `latest-source/lab/OORU-CCT-Implementation-Handoff.md` and `latest-source/lab/Analytics-Operations.md` first. The original recovery bundle above remains the installation baseline; the new snapshot is not a complete rebuilt installation kit. Reconcile and test the two before deployment. Snapshot scripts may refer to the original machine and require review. No clean installation, production security assessment, live NSR/NIMC integration, payment settlement certification or production acceptance is asserted. Use synthetic data only until those gaps are closed.

## NSIPA branding update

The current lab sources include the NSIPA identity, shared service theme and native company/realm branding installers. See [latest-source/lab/branding/README.md](latest-source/lab/branding/README.md) for build, application and verification steps, and editable Illustrator/SVG/Photoshop masters. Historical recovery archives retain their original contents; apply the current branding sources after restoration.

## Historical NSIPA v2 packages — 3 November 2026

Download the [complete handoff, Figma/FigCraft design kit and Experience Kit v2](downloads/v2/README.md). This includes updated logos, 240 design screens, both Ooru handoffs and five refreshed videos. The v2 Experience Kit was software 0.2.0; the current source in [`latest-source/experience-kit`](latest-source/experience-kit/README.md) is v3 (software 0.3.0). SHA-256 files accompany every download. Earlier archives remain historical baselines.

## Current NSIPA v3 packages — 4 November 2026

Download the [UX/UI Design Package v3](downloads/v3/NigeriaG2P-UX-UI-Design-Package-v3.zip?raw=true), [Complete Handoff v3](downloads/v3/NigeriaG2P-NSIPA-Complete-Handoff-v3.zip?raw=true), or [Experience Kit v3](downloads/v3/OpenG2P-Experience-Kit-v3.zip?raw=true). See the [v3 package guide](downloads/v3/README.md) and companion `.sha256` files. Earlier v2 packages remain available.

This source snapshot adds connected service dashboards, the public territorial atlas, the synthetic Jos CCT pilot, and the sample Android/iOS field experience. Source files and installers are lab-specific, not an unattended installer. Payments remain simulated; source-dated geographic gaps are retained. The Android test PIN is not an authenticated supervisor and the iOS web preview has no server sync. No runtime credentials, ODK App User URL, private keys or household databases are included.

## Version 0.5 splash update

The Android test build and the iPhone/iPad browser preview now show the field-demo introduction artwork at launch. Android package v0.5 is test-signed and supports in-place updates from v0.4 using the same demo signing key. The iOS option remains a web preview, not an IPA or a connected sync client. The splash update has not yet been tested on a physical phone. See the [download and test page](https://nigeriag2p.com/field-preview/android/). Earlier v3 delivery archives remain unchanged historical snapshots.
