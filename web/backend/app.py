"""
Solar Boat UPRM — backend API for the index.html forms.

Endpoints
  GET  /api/health              -> liveness check
  POST /api/contact             -> contact form  {nombre, email, asunto?, mensaje}
  POST /api/recruit             -> recruitment    {email}
  POST /api/notify              -> notification signup {nombre?, email, intereses?}
  GET  /api/events.ics          -> team calendar download (from events.json)
  GET  /api/admin/submissions   -> view everything (requires X-Admin-Token)
  GET  /admin                   -> browser dashboard for the endpoint above

Each POST saves to SQLite and emails the team (if SMTP is configured).
All POSTs are rate-limited per IP and honeypot-protected (a hidden
"website" field that only bots fill in).

Run locally:  python app.py    (serves on http://localhost:5000)
"""

import hmac
import json
import os
import re
import logging
from datetime import datetime, timedelta, timezone

# Load .env before importing modules that read env vars at import time.
try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:  # dotenv is optional; real env vars still work
    pass

from flask import Flask, request, jsonify, Response, send_from_directory
from flask_cors import CORS

import db
import emailer
from ratelimit import rate_limit

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("solarboat.app")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EVENTS_FILE = os.path.join(BASE_DIR, "events.json")

app = Flask(__name__)

# Allow the static site to call the API from the browser.
# Set ALLOWED_ORIGINS in .env to a comma-separated list in production;
# defaults to "*" for easy local development.
_origins = os.environ.get("ALLOWED_ORIGINS", "*")
CORS(app, resources={r"/api/*": {"origins": _origins.split(",") if _origins != "*" else "*"}})

ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN")
MAX_LEN = 5000  # cap any single field to keep payloads sane

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# ----------------------------------------------------------------------------
# helpers
# ----------------------------------------------------------------------------
def _payload():
    """Accept JSON or form-encoded bodies; return a plain dict."""
    if request.is_json:
        return request.get_json(silent=True) or {}
    return request.form.to_dict()


def _clean(value):
    if value is None:
        return ""
    return str(value).strip()[:MAX_LEN]


def _valid_email(value):
    return bool(EMAIL_RE.match(value or ""))


def _clean_intereses(value):
    """Normalise the notify form's interests to a comma-separated string.

    The browser sends a list of checkbox values, but a form-encoded POST or a
    hand-rolled client may send a plain string, so both are accepted.
    """
    if isinstance(value, (list, tuple)):
        items = [_clean(v) for v in value]
    else:
        items = [part.strip() for part in _clean(value).split(",")]
    return ", ".join(item for item in items if item)[:MAX_LEN]


def _client_ip():
    fwd = request.headers.get("X-Forwarded-For", "")
    return fwd.split(",")[0].strip() if fwd else request.remote_addr


def _is_bot(data):
    """Honeypot: the 'website' field is hidden from humans on the frontend,
    so anything that fills it is a bot. Callers return a normal success
    response without saving, so the bot never learns it was caught."""
    return bool(_clean(data.get("website")))


# ----------------------------------------------------------------------------
# routes — forms
# ----------------------------------------------------------------------------
@app.get("/api/health")
def health():
    return jsonify(status="ok", email_configured=emailer.is_configured())


@app.post("/api/contact")
@rate_limit(max_requests=5, per_seconds=300)
def contact():
    data = _payload()
    if _is_bot(data):
        return jsonify(ok=True, message="¡Mensaje enviado!")

    nombre = _clean(data.get("nombre"))
    email = _clean(data.get("email"))
    asunto = _clean(data.get("asunto"))
    mensaje = _clean(data.get("mensaje"))

    if not nombre or not mensaje:
        return jsonify(ok=False, error="Nombre y mensaje son requeridos."), 400
    if not _valid_email(email):
        return jsonify(ok=False, error="Correo inválido."), 400

    db.add_contact(nombre, email, asunto, mensaje, ip=_client_ip())
    emailer.send_notification(
        subject=f"[Solar Boat] Nuevo contacto: {asunto or '(sin asunto)'}",
        body=(
            f"Nombre:  {nombre}\n"
            f"Correo:  {email}\n"
            f"Asunto:  {asunto or '(sin asunto)'}\n\n"
            f"Mensaje:\n{mensaje}\n"
        ),
    )
    return jsonify(ok=True, message="¡Mensaje enviado!")


@app.post("/api/recruit")
@rate_limit(max_requests=5, per_seconds=300)
def recruit():
    data = _payload()
    if _is_bot(data):
        return jsonify(ok=True, message="¡Recibido! Nos comunicamos contigo pronto.")

    email = _clean(data.get("email"))

    if not _valid_email(email):
        return jsonify(ok=False, error="Correo inválido."), 400

    new_id = db.add_recruit(email, ip=_client_ip())
    if new_id:
        emailer.send_notification(
            subject="[Solar Boat] Nueva solicitud de reclutamiento",
            body=f"Alguien quiere unirse al equipo.\n\nCorreo: {email}\n",
        )
    # Whether new or duplicate, respond success so the UI stays friendly.
    return jsonify(ok=True, message="¡Recibido! Nos comunicamos contigo pronto.")


@app.post("/api/notify")
@rate_limit(max_requests=5, per_seconds=300)
def notify():
    data = _payload()
    if _is_bot(data):
        return jsonify(ok=True, message="¡Listo! Te avisaremos de próximos eventos.")

    nombre = _clean(data.get("nombre"))
    email = _clean(data.get("email"))
    intereses = _clean_intereses(data.get("intereses"))

    if not _valid_email(email):
        return jsonify(ok=False, error="Correo inválido."), 400

    new_id = db.add_subscriber(nombre, email, intereses, ip=_client_ip())
    if new_id:
        emailer.send_notification(
            subject="[Solar Boat] Nueva suscripción a notificaciones",
            body=(
                f"Nombre:     {nombre or '(no dio nombre)'}\n"
                f"Correo:     {email}\n"
                f"Le interesa: {intereses or '(no especificó)'}\n"
            ),
        )
    return jsonify(ok=True, message="¡Listo! Te avisaremos.")


# ----------------------------------------------------------------------------
# routes — calendar
# ----------------------------------------------------------------------------
def _load_events():
    """Events the team maintains by hand in backend/events.json."""
    try:
        with open(EVENTS_FILE, encoding="utf-8") as fh:
            events = json.load(fh)
        return events if isinstance(events, list) else []
    except (OSError, json.JSONDecodeError) as exc:
        log.warning("Could not load events.json: %s", exc)
        return []


def _ics_escape(text):
    return (
        str(text)
        .replace("\\", "\\\\")
        .replace(";", "\\;")
        .replace(",", "\\,")
        .replace("\n", "\\n")
    )


@app.get("/api/events.ics")
def events_ics():
    """iCalendar export of events.json — the site's 'Descargar calendario'
    button points here. All-day events; dates are YYYY-MM-DD strings."""
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Solar Boat UPRM//Eventos//ES",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "X-WR-CALNAME:Solar Boat UPRM",
    ]
    stamp = datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")

    for i, event in enumerate(_load_events()):
        try:
            start = datetime.strptime(event["date"], "%Y-%m-%d")
        except (KeyError, TypeError, ValueError):
            continue
        end = start + timedelta(days=1)  # all-day DTEND is exclusive
        title = _ics_escape(event.get("title", "Evento Solar Boat"))
        lines += [
            "BEGIN:VEVENT",
            f"UID:solarboat-uprm-{start:%Y%m%d}-{i}@solarboatuprm",
            f"DTSTAMP:{stamp}",
            f"DTSTART;VALUE=DATE:{start:%Y%m%d}",
            f"DTEND;VALUE=DATE:{end:%Y%m%d}",
            f"SUMMARY:{title}",
        ]
        if event.get("description"):
            lines.append(f"DESCRIPTION:{_ics_escape(event['description'])}")
        if event.get("location"):
            lines.append(f"LOCATION:{_ics_escape(event['location'])}")
        lines.append("END:VEVENT")

    lines.append("END:VCALENDAR")
    return Response(
        "\r\n".join(lines) + "\r\n",
        mimetype="text/calendar",
        headers={
            "Content-Disposition": 'attachment; filename="solarboat-uprm.ics"'
        },
    )


# ----------------------------------------------------------------------------
# routes — admin
# ----------------------------------------------------------------------------
@app.get("/api/admin/submissions")
@rate_limit(max_requests=20, per_seconds=300)
def admin_submissions():
    if not ADMIN_TOKEN:
        return jsonify(ok=False, error="ADMIN_TOKEN no configurado en el servidor."), 503
    # compare_digest instead of != so the comparison takes the same time
    # whether the token is wrong on the first character or the last one.
    if not hmac.compare_digest(request.headers.get("X-Admin-Token", ""), ADMIN_TOKEN):
        return jsonify(ok=False, error="No autorizado."), 401

    return jsonify(
        ok=True,
        contacts=db.get_contacts(),
        recruits=db.get_recruits(),
        subscribers=db.get_subscribers(),
    )


@app.get("/admin")
def admin_page():
    """Browser dashboard. The page itself is public but empty — data only
    loads after the viewer enters the admin token, which is checked by
    /api/admin/submissions on every request."""
    return send_from_directory(BASE_DIR, "admin.html")


# ----------------------------------------------------------------------------
# startup
# ----------------------------------------------------------------------------
db.init_db()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
