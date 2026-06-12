# Deployment and Operations Checklist

## 1. Security and Configuration

- Use environment variables for backend DB and admin config:
  - `DB_HOST`
  - `DB_USER`
  - `DB_PASS`
  - `DB_NAME`
  - `ADMIN_USERNAME`
- Keep production credentials out of source control.
- Serve the app over HTTPS in production.
- Confirm secure session cookies are active (`HttpOnly`, `SameSite`, `Secure` on HTTPS).

## 2. Build and Verification

- Frontend build:
  - `cd Frontend`
  - `npm run build`
- Frontend tests:
  - `cd Frontend`
  - `npm run test`
- Optional full verification script:
  - Bash: `bash verify.sh`
  - Git Bash on Windows: `./verify.sh`
  - Script now checks: frontend build/tests, PHP lint, health action presence, and upload directory readiness.

## 3. Health and Monitoring

- Health endpoint:
  - `GET /KvalDarbs/api.php?action=health`
- Configure web server and PHP logs:
  - access logs
  - error logs
- Monitor repeated `429` responses (rate-limit events).

## 4. Backups

- Database backup (example with mysqldump):
  - `mysqldump -u root -p KvalDB > KvalDB_backup.sql`
- Keep daily backups and test restore at least once.

## 5. Post-Deploy Smoke Test

- Open home page and product list.
- Register and login test account.
- Add product to cart and complete checkout.
- Submit contact message.
- Verify admin actions with admin account.
