"""
Backend test suite. Run from backend/:  pytest -q

Uses a temp SQLite DB per test session and Flask's test client — no server,
no network, no SMTP (email is unconfigured in tests and skips gracefully).
"""

import importlib
import os
import sys
import tempfile

import pytest

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))


@pytest.fixture()
def client(monkeypatch, tmp_path):
    monkeypatch.setenv("SOLARBOAT_DB", str(tmp_path / "test.db"))
    monkeypatch.setenv("ADMIN_TOKEN", "test-token")

    # Reload modules so they pick up the patched environment.
    import db as db_module
    import ratelimit
    import app as app_module

    importlib.reload(db_module)
    importlib.reload(app_module)
    ratelimit.reset()

    app_module.app.config["TESTING"] = True
    with app_module.app.test_client() as test_client:
        yield test_client


# ---------------------------------------------------------------- health ----
def test_health(client):
    res = client.get("/api/health")
    assert res.status_code == 200
    assert res.get_json()["status"] == "ok"


# --------------------------------------------------------------- contact ----
def test_contact_valid(client):
    res = client.post("/api/contact", json={
        "nombre": "Ana", "email": "ana@uprm.edu",
        "asunto": "Hola", "mensaje": "Buen trabajo",
    })
    assert res.status_code == 200
    assert res.get_json()["ok"] is True


def test_contact_rejects_bad_email(client):
    res = client.post("/api/contact", json={
        "nombre": "Ana", "email": "not-an-email", "mensaje": "Hola",
    })
    assert res.status_code == 400


def test_contact_rejects_missing_fields(client):
    res = client.post("/api/contact", json={"email": "a@b.co"})
    assert res.status_code == 400


def test_contact_accepts_form_encoded(client):
    res = client.post("/api/contact", data={
        "nombre": "Luis", "email": "luis@uprm.edu", "mensaje": "Saludos",
    })
    assert res.status_code == 200


# -------------------------------------------------------------- honeypot ----
def test_honeypot_pretends_success_but_saves_nothing(client):
    res = client.post("/api/contact", json={
        "nombre": "Bot", "email": "bot@spam.io", "mensaje": "Buy now",
        "website": "http://spam.example",   # only bots fill this
    })
    assert res.status_code == 200
    assert res.get_json()["ok"] is True    # bot sees success…

    admin = client.get(
        "/api/admin/submissions", headers={"X-Admin-Token": "test-token"}
    ).get_json()
    assert admin["contacts"] == []          # …but nothing was stored


# --------------------------------------------------------------- recruit ----
def test_recruit_and_duplicate_stays_friendly(client):
    first = client.post("/api/recruit", json={"email": "joe@uprm.edu"})
    duplicate = client.post("/api/recruit", json={"email": "joe@uprm.edu"})
    assert first.status_code == 200
    assert duplicate.status_code == 200     # duplicates still succeed

    admin = client.get(
        "/api/admin/submissions", headers={"X-Admin-Token": "test-token"}
    ).get_json()
    assert len(admin["recruits"]) == 1      # …but stored only once


# ---------------------------------------------------------------- notify ----
def test_notify_subscribes(client):
    res = client.post("/api/notify", json={
        "nombre": "Mia", "email": "mia@upr.edu",
    })
    assert res.status_code == 200


def test_notify_rejects_bad_email(client):
    res = client.post("/api/notify", json={"nombre": "X", "email": "nope"})
    assert res.status_code == 400


# ------------------------------------------------------------ rate limit ----
def test_rate_limit_kicks_in_after_five(client):
    payload = {"nombre": "N", "email": "n@u.edu", "mensaje": "spam?"}
    for _ in range(5):
        assert client.post("/api/contact", json=payload).status_code == 200
    res = client.post("/api/contact", json=payload)
    assert res.status_code == 429
    assert "Retry-After" in res.headers


def test_rate_limit_is_per_endpoint(client):
    payload = {"nombre": "N", "email": "n@u.edu", "mensaje": "hola"}
    for _ in range(5):
        client.post("/api/contact", json=payload)
    # contact is now limited, but notify still works for the same IP
    res = client.post("/api/notify", json={"email": "n@u.edu"})
    assert res.status_code == 200


# ----------------------------------------------------------------- admin ----
def test_admin_requires_token(client):
    assert client.get("/api/admin/submissions").status_code == 401


def test_admin_rejects_wrong_token(client):
    res = client.get(
        "/api/admin/submissions", headers={"X-Admin-Token": "wrong"}
    )
    assert res.status_code == 401


def test_admin_returns_submissions(client):
    client.post("/api/contact", json={
        "nombre": "Ana", "email": "ana@uprm.edu", "mensaje": "Hola",
    })
    res = client.get(
        "/api/admin/submissions", headers={"X-Admin-Token": "test-token"}
    )
    body = res.get_json()
    assert res.status_code == 200
    assert len(body["contacts"]) == 1
    assert body["contacts"][0]["nombre"] == "Ana"


def test_admin_page_is_served(client):
    res = client.get("/admin")
    assert res.status_code == 200
    assert b"Panel de administraci" in res.data


# -------------------------------------------------------------- calendar ----
def test_events_ics_is_valid_calendar(client):
    res = client.get("/api/events.ics")
    text = res.get_data(as_text=True)
    assert res.status_code == 200
    assert res.mimetype == "text/calendar"
    assert text.startswith("BEGIN:VCALENDAR")
    assert text.rstrip().endswith("END:VCALENDAR")
    assert "BEGIN:VEVENT" in text            # events.json has entries
    assert "SUMMARY:" in text


def test_events_ics_all_day_format(client):
    text = client.get("/api/events.ics").get_data(as_text=True)
    assert "DTSTART;VALUE=DATE:" in text
