"""
SQLite persistence for Solar Boat UPRM form submissions.

Three tables, one per form on index.html:
  - contacts     : contact form (nombre, email, asunto, mensaje)
  - recruits     : recruitment form (email)
  - subscribers  : events notify form (nombre, email)

The database file lives next to this module (solarboat.db) unless the
SOLARBOAT_DB env var points somewhere else.
"""

import os
import sqlite3
from contextlib import contextmanager
from datetime import datetime, timezone

DB_PATH = os.environ.get(
    "SOLARBOAT_DB",
    os.path.join(os.path.dirname(os.path.abspath(__file__)), "solarboat.db"),
)


@contextmanager
def _connect():
    """Yield a connection with row access by column name."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db():
    """Create tables if they don't exist. Safe to call on every startup."""
    with _connect() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS contacts (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre   TEXT NOT NULL,
                email    TEXT NOT NULL,
                asunto   TEXT,
                mensaje  TEXT NOT NULL,
                ip       TEXT,
                created  TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS recruits (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                email    TEXT NOT NULL UNIQUE,
                ip       TEXT,
                created  TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS subscribers (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre   TEXT,
                email    TEXT NOT NULL UNIQUE,
                ip       TEXT,
                created  TEXT NOT NULL
            );
            """
        )


def _now():
    return datetime.now(timezone.utc).isoformat()


def add_contact(nombre, email, asunto, mensaje, ip=None):
    with _connect() as conn:
        cur = conn.execute(
            "INSERT INTO contacts (nombre, email, asunto, mensaje, ip, created) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (nombre, email, asunto, mensaje, ip, _now()),
        )
        return cur.lastrowid


def add_recruit(email, ip=None):
    """Insert a recruit email. Returns row id, or None if already present."""
    with _connect() as conn:
        cur = conn.execute(
            "INSERT OR IGNORE INTO recruits (email, ip, created) VALUES (?, ?, ?)",
            (email, ip, _now()),
        )
        return cur.lastrowid if cur.rowcount else None


def add_subscriber(nombre, email, ip=None):
    """Insert a subscriber. Returns row id, or None if the email already exists."""
    with _connect() as conn:
        cur = conn.execute(
            "INSERT OR IGNORE INTO subscribers (nombre, email, ip, created) "
            "VALUES (?, ?, ?, ?)",
            (nombre, email, ip, _now()),
        )
        return cur.lastrowid if cur.rowcount else None


def _all(table):
    with _connect() as conn:
        rows = conn.execute(
            f"SELECT * FROM {table} ORDER BY created DESC"  # noqa: S608 (fixed names)
        ).fetchall()
        return [dict(r) for r in rows]


def get_contacts():
    return _all("contacts")


def get_recruits():
    return _all("recruits")


def get_subscribers():
    return _all("subscribers")
