# Deploying to ktailearn.com/PrimaryChinese3B (Hostinger)

Every push to `main` automatically uploads this site's files to Hostinger
over FTP, into the `PrimaryChinese3B` folder under `ktailearn.com` — see
`.github/workflows/deploy.yml`. It needs three secrets set up once.

## 1. Create a scoped FTP account on Hostinger

Rather than using your main Hostinger login, create a separate FTP account
limited to just this folder, so the credentials stored in GitHub can't
touch anything else on the server:

1. Log into [hpanel.hostinger.com](https://hpanel.hostinger.com) →
   pick the ktailearn.com website → **Files** → **FTP Accounts**.
2. **Create a new FTP account**:
   - Directory: `public_html/PrimaryChinese3B` (create this folder first
     if it doesn't exist yet — File Manager → New Folder, inside
     `public_html`).
   - Choose a username and a strong password (or let Hostinger generate
     one) — write the password down now, you won't be able to see it
     again after this step.
3. Note the **FTP hostname** shown (often just `ktailearn.com`, or an IP —
   Hostinger shows it right on this page).

## 2. Add the secrets to GitHub

Repo → **Settings** → **Secrets and variables** → **Actions** → **New
repository secret**, add these three (exact names matter):

| Secret name | Value |
|---|---|
| `FTP_SERVER` | the FTP hostname from step 1 |
| `FTP_USERNAME` | the FTP username from step 1 |
| `FTP_PASSWORD` | the FTP password from step 1 |

(Optional: `FTP_SERVER_DIR` if you want to deploy somewhere other than
`/public_html/PrimaryChinese3B/` — otherwise the workflow defaults to
that path.)

Nobody (including me) can read these back once saved — GitHub only lets
Actions use them during a workflow run.

## 3. Trigger a deploy

Once the secrets are set, either:
- Push any commit to `main`, or
- Go to the repo's **Actions** tab → **Deploy to Hostinger** → **Run
  workflow** (to redeploy without a new commit).

Check the Actions tab for the run's logs if something goes wrong (wrong
password, wrong directory, etc. show up there clearly).

## 4. Point ktailearn.com/PrimaryChinese3B at it

If `public_html/PrimaryChinese3B/` is a normal subfolder of the same
Hostinger site that already serves `ktailearn.com`, this just works —
Apache/LiteSpeed serves whatever's in that folder at that path
automatically, no extra config needed.
