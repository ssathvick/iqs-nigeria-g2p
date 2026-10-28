# NigeriaG2P developer setup

This repository is a handoff for a **synthetic OpenG2P sandbox**, not a production deployment. It contains an older full-platform installation kit and a newer source snapshot of the Nigeria UX, knowledge, analytics and integrations. It does not contain the running site's databases, user accounts, private keys, certificates, tunnel credentials or the confidential CCT rules. A database connection by itself does not make this a working CCT programme.

There are two distinct ways to start:

1. **Quick UI and knowledge preview:** `Start-Experience-Preview.bat` installs Python 3.12 via Windows Package Manager if required, creates an isolated virtual environment and starts the standalone Experience Kit at `http://127.0.0.1:18110/experience/`. This is a smaller reusable template with generic guidance and disabled service placeholders. It is not the current NigeriaG2P application, and does not connect to its databases, analytics or payment services.
2. **Full sandbox:** `Prepare-Full-Lab.bat` verifies and extracts the historical recovery bundle and installation kit. The full platform then requires the manual, staged installation below. The scripts do not yet perform a verified unattended installation or automatically integrate the newer snapshot. No clean-machine end-to-end install has been certified.

## System requirements

For the full Windows lab, plan for Windows 11 x64, hardware virtualization enabled, WSL 2 and Ubuntu 22.04 with systemd; at least 12 logical processors (16 preferred); **64 GB host RAM as a practical starting point**, with 96–128 GB preferred; and an SSD with **at least 150 GB free where the WSL disk resides**. The original lab used a 48–64 GB WSL memory allocation and 16 GB swap. Internet access is needed for Ubuntu packages, container images, charts and source dependencies. An administrator is needed for Windows WSL setup and local certificate trust. These are planning figures from the original guide, not a benchmark or guarantee for smaller machines.

For the standalone preview, Windows, internet and Python 3.12 are sufficient; the full cluster specifications and WSL are not required. The preview launcher installs Flask into a per-user virtual environment and stores its SQLite data in `%LOCALAPPDATA%\IQS-Nigeria-Experience-Preview`. Close the console or press Ctrl+C to stop. If Python installation needs a restart, reopen the launcher. To install Python yourself, use the official Python installer and rerun the launcher.

## Get the files

1. An owner must grant the developer access to the private GitHub repository. Clone it with Git, or use **Code → Download ZIP** and extract the entire ZIP to a writable local folder. GitHub source access does not grant access to runtime data or credentials.
2. For a quick preview, double-click `Start-Experience-Preview.bat`. Keep the console open and visit the local address printed there. If port 18110 is in use, stop the other service or run `latest-source/experience-kit/app.py` with a different `PORT` environment variable.
3. For the full sandbox, double-click `Prepare-Full-Lab.bat`. It verifies `BUNDLE.sha256`, refuses to overwrite an existing staging directory, and extracts to `%USERPROFILE%\IQS-Nigeria-Setup`. It does not install the platform. To choose another new directory, run `powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\Prepare-Full-Lab.ps1 -Destination D:\IQS-Nigeria-Setup`.

## Full sandbox: staged installation

1. Confirm the resource requirements, disk space, virtualization and your organisation's network access. Preserve any existing WSL distributions. The script does not resize WSL memory or disk.
2. If Ubuntu 22.04 is not already installed, run `Install-WSL-Ubuntu.bat` from an **Administrator command prompt**. The script detects an existing `Ubuntu-22.04` distribution and leaves it untouched. Complete any Windows restart and Ubuntu's first-run account setup. Verify `wsl --list --verbose` shows Ubuntu 22.04 using version 2. Follow sections 06–07 of the Word guide to enable systemd and configure WSL resources. Do not overwrite an existing distribution or `.wslconfig`.
3. Read the extracted `iqs-nigeria-g2p\docs\REINSTALL.md` and the repository's `IQS-Nigeria-OpenG2P-Installation-Guide.docx`. The kit is at `IQS-Installation-Kit\` under the prepared directory. The guide expects `C:\IQS-Install\IQS-Installation-Kit`: if that destination is unused, copy the staged kit there. For another path, adjust the documented `/mnt/c/...` copy commands accordingly. Never merge into an existing installation without inspecting it.
4. In Ubuntu, copy the kit into `/opt/openg2p-install` as directed by the guide, then execute its stages in the documented order. The guide covers K3s, Helm, Istio, shared services, registries, PBMS, Bridge, portal, identity and local TLS. Stop at every failed readiness checkpoint. The kit generates destination secrets; keep them private and use a separate secret-management plan.
5. Follow the guide's local certificate trust and startup instructions. Verify the local launcher, workload health, role-based logins, demo registration and restart persistence. Use synthetic data. Browser warnings must be resolved through the documented CA installation, not bypassed.
6. **Integrate newer changes deliberately.** `latest-source/lab/` is the newer source snapshot, not a drop-in overlay: many installers use `/mnt/h/Nigeria_Mosip/codex/openg2p-lab`, original service names, local fixture IDs, or `nigeriag2p.com`. Review and adapt paths, environment configuration, charts, image versions, migrations, OIDC callbacks, feature dependencies and assets before installation. Recent files include registration, persona UI, language preview, geography, knowledge and analytics, and the registry illustration. The bundled older kit does not automatically contain all of these updates. Validate each feature against the destination; do not run every script or seeding command.
7. The public sandbox uses a Cloudflare tunnel and a domain controlled by the original operator. Do not copy or reuse its tunnel token, DNS, public hostnames, TLS keys, cookies or OIDC client secrets. For a separate domain, configure new DNS, TLS, OIDC redirects, allowed origins, nginx routes and a new tunnel after local validation. The Cloudflare guide is a reference, not a turnkey setup for a different domain.
8. Run destination-specific acceptance tests for authentication, authorized/unauthorized access, synchronization and retry, knowledge publication, analytics source freshness, geography, simulated payment/reconciliation, backup restore, restart and mobile/accessibility. Record exact image/chart versions and results. No historical test proves a new installation.

## Runtime recovery and confidentiality

The GitHub repository does not contain an exact copy of the running system. A separate private runtime backup was created on the original host; it contains sensitive credentials, configurations and synthetic operational records. Transfer only an encrypted copy through an approved channel, and send the decryption key separately. Restore into an isolated environment first: restoring databases replaces destination data, and copying the live tunnel or domain configuration can disrupt the original service. The original backup scripts and `latest-source/BACKUP-AND-RESTORE.md` describe the older verified workflow; a logical backup is not an offline WSL image and online file-volume captures are not guaranteed to be mutually consistent.

The installed environment is a demonstration: identity is mocked, bank services are simulated, access and geographic scoping are incomplete, and production security, reconciliation and disaster recovery are not certified. See `latest-source/lab/OORU-CCT-Implementation-Handoff.md` for production dependencies and ownership decisions.

## Troubleshooting

- **Private repository unavailable:** check the GitHub account's access with the repository owner.
- **`winget` unavailable or Python install fails:** install Python 3.12 from python.org, then reopen the preview launcher.
- **Bundle checksum mismatch:** discard the downloaded copy and obtain it again; do not extract or execute it.
- **Destination exists:** choose a new directory. The preparation script intentionally will not overwrite it.
- **WSL requires restart or virtualization:** complete Windows' requested restart and enable virtualization in firmware where required.
- **A full-lab stage fails:** stop at that stage; inspect its logs and the guide. The original machine's paths and public domain are not portable defaults.
