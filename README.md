# IQS Nigeria G2P recovery repository

Private archive of the Nigeria OpenG2P sandbox installation kit, custom source, operations documentation and submitted UX delivery documents.

## Download and use on another machine

Sign in to GitHub using an account with access, then clone this repository:

```powershell
git clone https://github.com/ssathvick/iqs-nigeria-g2p.git
Set-Location iqs-nigeria-g2p
Expand-Archive -LiteralPath .\IQS-Nigeria-G2P-Recovery-Bundle.zip -DestinationPath .\recovery
```

Alternatively use **Code → Download ZIP**, extract it, then extract the recovery bundle inside it.

The complete working reference tree is in `recovery/iqs-nigeria-g2p/`. Begin with its `README.md` and `docs/REINSTALL.md`, then follow the installation Word guide. The archive preserves folder structure and the pinned chart kit; it is not an executable installer.

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
