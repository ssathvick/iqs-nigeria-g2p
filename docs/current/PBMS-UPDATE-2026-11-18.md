# Install the 18 November PBMS workspace update

This is the current source for the programme workspace, programme-scoped benefits/rules/lists, enrollment and disbursement workflow tabs, and permission-controlled native administration shortcuts. It retains the existing NSIPA design. See [completed behavior](PBMS-PROGRAMME-WORKSPACE.md) and the [user walkthrough](USAGE.md).

Use `latest-source/lab/` from this checkout. Historical ZIP downloads, recovery bundles and earlier dated snapshots do not include this update.

## Choose the installation path

- **Existing installation already running the 16 or 17 November PBMS overlay:** build and replace only its PBMS static frontend using the steps below. The existing native addon, session adapter, workers and databases remain in place. No addon upgrade, schema migration, new permission grants or payment-worker restart is required for this navigation update.
- **Fresh machine or an older installation:** follow [INSTALLATION.md](INSTALLATION.md), including the matching upstream services, native addon, authenticated adapter, payment extensions and account provisioning. Build the frontend from this current checkout at step 8. A frontend build alone cannot install PBMS or recreate the original accounts, beneficiary records or approved lists.

## Obtain and build current source

Run these commands in Ubuntu 22.04, including Ubuntu under WSL2, with Git and Node.js 22/npm available. Use a user-owned checkout and keep destination secrets outside it.

```bash
git clone https://github.com/ssathvick/iqs-nigeria-g2p.git
cd iqs-nigeria-g2p
git rev-parse HEAD
PBMS_SOURCE="$PWD/latest-source/lab/pbms-react"
cd "$PBMS_SOURCE"
npm ci
npm run build
test -s dist/index.html
test -s dist/app.js
test -s dist/app.css
```

For an existing clean checkout, use `git pull --ff-only origin main` from its root instead of cloning. Preserve or commit local changes first; do not force-reset an edited installation. Record the commit hash with the deployment. The lockfile supplies the frontend dependencies; no OpenAI/API key is needed for PBMS.

The frontend uses same-origin `/web/*`, `/pbms-ui-api/*` and `/iqs-brand/*` routes. Keep your destination domain, TLS, Nginx/ingress, session cookies and adapter Origin settings. Do not point a client installation at the original demonstration backend.

## Publish to an existing configured host

The commands below assume the existing Nginx site already serves `/pbms-ui/` from `/opt/openg2p-lab/pbms-react/current/`, and its native services work. Adapt `PBMS_ROOT` only if your configured alias uses another location. Run from the built `pbms-react` directory on that host.

```bash
set -e
PBMS_ROOT=/opt/openg2p-lab/pbms-react
PREVIOUS_RELEASE="$(readlink -f "$PBMS_ROOT/current")"
test -d "$PREVIOUS_RELEASE"
test -s "$PREVIOUS_RELEASE/index.html"
RELEASE_NAME="$(date -u +%Y%m%dT%H%M%SZ)-programme-workspace"
NEW_RELEASE="$PBMS_ROOT/releases/$RELEASE_NAME"
test ! -e "$NEW_RELEASE"
sudo install -d "$NEW_RELEASE" "$PBMS_ROOT/backups"
sudo cp -a dist/. "$NEW_RELEASE/"
printf '%s\n' "$PREVIOUS_RELEASE" | sudo tee "$PBMS_ROOT/backups/$RELEASE_NAME.previous-release.txt" >/dev/null
sudo nginx -t
sudo ln -s "$NEW_RELEASE" "$PBMS_ROOT/current-$RELEASE_NAME"
sudo mv -Tf "$PBMS_ROOT/current-$RELEASE_NAME" "$PBMS_ROOT/current"
readlink -f "$PBMS_ROOT/current"
```

Stop if any command fails. `nginx -t` must succeed before switching. The final rename atomically changes the static release; an unchanged Nginx configuration does not need a reload. Keep both release directories and the previous-release file. Confirm your existing static route sends `Cache-Control: no-store` as in [pbms.nginx.example.conf](../../latest-source/lab/release/pbms.nginx.example.conf); refresh the browser after publishing. Do not replace your whole site configuration just to install this frontend update.

## Client acceptance

1. Sign in through your own PBMS URL. Open **Programmes → Open** and confirm the programme information page.
2. Check **Programme benefits**, **Benefit codes**, **Eligibility rules**, **Entitlement rules**, **Beneficiary lists**, **Enrollment workflow** and **Disbursement workflow**. Switch between at least two assigned programmes and refresh; each section must retain its programme filter.
3. Confirm Enrollment cycles and Disbursement cycles remain in the sidebar. A cycle shortcut from a programme carries its programme ID.
4. Confirm Benefit codes defaults to assigned codes. **Manage shared benefit catalogue** deliberately shows shared master data; use Programme benefits for assignments.
5. Open an existing enrollment and disbursement list. Verify its beneficiary details, saved approval history and applicable role actions. This navigation update does not dispatch payments.
6. Verify Programme Admin, Payment, Finance, Audit and CEO separately. Programme membership and native roles still apply. User settings requires native `base.group_erp_manager`; Developer apps requires `base.group_system`. Do not grant these groups to ordinary staff just to expose the links.
7. Check desktop and narrow mobile layouts, sign-out and contextual help. Record your destination results separately from the original-host evidence.

## Optional read-only automated verification

The two new tests accept destination-specific inputs. Run them only in an isolated test deployment populated with synthetic data. They do not create fixtures, approve lists, install modules or submit payments. The five-role test expects at least two accessible programmes per role; the selected programme must use `nsipa_flow` and have synthetic enrollment/disbursement lists if those review paths are to be exercised.

Create private JSON files outside Git: the five-role file has `admin`, `payment`, `finance`, `audit` and `ceo` keys, each containing `login` and `password`. A separate administrator file has top-level `login` and `password` for a native system administrator. Restrict the files to their owner. Never attach credentials, raw test screenshots or beneficiary records to a public issue.

```bash
cd "$PBMS_SOURCE"
npx playwright install chromium
export PBMS_BASE_URL=https://YOUR-PBMS-HOST/pbms-ui/
export PBMS_APPROVAL_ACCOUNTS_FILE=/secure/pbms-test-accounts.local.json
export PBMS_ADMIN_ACCOUNT_FILE=/secure/pbms-system-admin.local.json
export PBMS_TEST_PROGRAM_ID=YOUR_SYNTHETIC_PROGRAMME_ID
export PBMS_TEST_DEPLOYED=1
node test-meeting-20261118.cjs
node test-meeting-admin-20261118.cjs
```

`PBMS_TEST_PROGRAM_ID` must be the destination's numeric ID. Tests use Chromium by default; `PBMS_BROWSER_CHANNEL=msedge` selects an installed Edge browser. Install Playwright's OS dependencies if required by your Linux host. TLS must be trusted. Results and screenshots default to ignored `evidence/meeting-20261118/`; `PBMS_TEST_OUTPUT` selects another private directory. Omit `PBMS_TEST_DEPLOYED` only when intentionally testing local `dist/` assets against the test deployment. `PBMS_TEST_ROLE` optionally restricts the five-role test to one role.

## Roll back this frontend update

Read the matching previous-release file saved above. Confirm its directory still contains the prior static files before restoring the pointer.

```bash
set -e
PREVIOUS_RELEASE="$(cat "$PBMS_ROOT/backups/$RELEASE_NAME.previous-release.txt")"
test -s "$PREVIOUS_RELEASE/index.html"
ROLLBACK_LINK="$PBMS_ROOT/current-rollback-$(date -u +%Y%m%dT%H%M%SZ)"
sudo ln -s "$PREVIOUS_RELEASE" "$ROLLBACK_LINK"
sudo mv -Tf "$ROLLBACK_LINK" "$PBMS_ROOT/current"
readlink -f "$PBMS_ROOT/current"
```

Refresh and verify the prior UI. No database rollback is needed for this frontend release. This procedure does not reverse any independent backend installation, permission change, approval or payment performed by an operator.
