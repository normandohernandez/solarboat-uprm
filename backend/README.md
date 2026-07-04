# Solar Boat UPRM — Backend

Small Flask API that handles the three forms on `index.html` (contact,
recruitment, and event notifications). Submissions are saved to SQLite and,
if SMTP is configured, an email is sent to the team.

## Endpoints

| Method | Path                      | Body                                   | Purpose                        |
|--------|---------------------------|----------------------------------------|--------------------------------|
| GET    | `/api/health`             | —                                      | Liveness + email config status |
| POST   | `/api/contact`            | `nombre, email, asunto?, mensaje`      | Contact form                   |
| POST   | `/api/recruit`            | `email`                                | "Únete al equipo" form         |
| POST   | `/api/notify`             | `nombre?, email`                       | Events mailing list            |
| GET    | `/api/events.ics`         | —                                      | Calendar download (`events.json`) |
| GET    | `/api/admin/submissions`  | header `X-Admin-Token: <ADMIN_TOKEN>`  | View all submissions (JSON)    |
| GET    | `/admin`                  | —                                      | Browser admin dashboard        |

All POST bodies accept JSON or form-encoded data. Responses are JSON:
`{ "ok": true, "message": "..." }` on success, `{ "ok": false, "error": "..." }` on failure.

### Spam protection
- **Rate limiting:** each form endpoint allows 5 requests per 5 minutes per IP
  (returns `429` with a `Retry-After` header beyond that).
- **Honeypot:** the forms include a hidden `website` field. Humans never see
  it; submissions that fill it get a fake success response and are discarded.

### Admin dashboard
Open `https://your-backend/admin`, paste the `ADMIN_TOKEN`, and you get
tables of all contacts/recruits/subscribers plus one-click CSV downloads
(for mailing lists, Excel, etc.). The token is never stored in the browser.

### Team calendar
`backend/events.json` is a hand-editable list of events:

```json
{ "date": "2025-06-14", "title": "Solar Splash 2025",
  "description": "…", "location": "Springfield, Ohio" }
```

The site's "Descargar calendario" button downloads these as a standard
`.ics` file that opens in Google Calendar / Apple Calendar / Outlook.
Edit the JSON and redeploy to update the calendar.

## Tests

```bash
cd backend
source .venv/bin/activate
pip install pytest
pytest -q
```

## Run locally

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

cp .env.example .env      # then edit .env with your values
python app.py             # serves on http://localhost:5000
```

The frontend (`index.html`) points at `http://localhost:5000` via the
`API_BASE` constant in its `<script>` block — change that to your deployed
URL for production.

## Configuration (.env)

See `.env.example`. Key variables:

- `ADMIN_TOKEN` — required to read `/api/admin/submissions`.
- `ALLOWED_ORIGINS` — comma-separated frontend origins (use your real domain
  in production instead of `*`).
- `SMTP_*` / `NOTIFY_TO` — email notifications. If left blank, submissions are
  still saved; only the email step is skipped.

For **Gmail**, use an [App Password](https://support.google.com/accounts/answer/185833),
not your normal password.

## Deploy (production)

Use a real WSGI server (gunicorn is in `requirements.txt`):

```bash
gunicorn app:app --bind 0.0.0.0:$PORT --workers 2
```

Works out of the box on Render, Railway, or Fly.io — set the environment
variables from `.env.example` in the host's dashboard. The SQLite file lives
at `backend/solarboat.db`; on platforms with ephemeral disks, mount a volume
or point `SOLARBOAT_DB` at persistent storage.

## Viewing submissions

```bash
curl -H "X-Admin-Token: YOUR_TOKEN" https://your-backend/api/admin/submissions
```
