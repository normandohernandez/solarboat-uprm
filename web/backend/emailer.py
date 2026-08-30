"""
Email notifications for new form submissions.

Sends a plain-text email to the team whenever someone submits a form.
Configured entirely through environment variables (see .env.example).

If SMTP is not configured, send_notification() logs a warning and returns
False instead of raising — form submissions are still saved to the DB, so
a missing/broken mail setup never blocks the user.
"""

import os
import smtplib
import ssl
import logging
from email.message import EmailMessage

log = logging.getLogger("solarboat.emailer")

SMTP_HOST = os.environ.get("SMTP_HOST")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "587"))
SMTP_USER = os.environ.get("SMTP_USER")
SMTP_PASS = os.environ.get("SMTP_PASS")
# Where notifications are sent (the team inbox).
NOTIFY_TO = os.environ.get("NOTIFY_TO", "solarboat@uprm.edu")
# From address; defaults to the authenticated SMTP user.
NOTIFY_FROM = os.environ.get("NOTIFY_FROM", SMTP_USER or "no-reply@solarboatuprm.org")


def is_configured():
    return bool(SMTP_HOST and SMTP_USER and SMTP_PASS)


def send_notification(subject, body):
    """Send a notification email. Returns True on success, False otherwise."""
    if not is_configured():
        log.warning("SMTP not configured — skipping email notification.")
        return False

    msg = EmailMessage()
    msg["Subject"] = subject
    msg["From"] = NOTIFY_FROM
    msg["To"] = NOTIFY_TO
    msg.set_content(body)

    try:
        context = ssl.create_default_context()
        if SMTP_PORT == 465:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT, context=context) as server:
                server.login(SMTP_USER, SMTP_PASS)
                server.send_message(msg)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
                server.starttls(context=context)
                server.login(SMTP_USER, SMTP_PASS)
                server.send_message(msg)
        log.info("Notification email sent: %s", subject)
        return True
    except Exception as exc:  # noqa: BLE001 - never let email break a submission
        log.error("Failed to send notification email: %s", exc)
        return False
