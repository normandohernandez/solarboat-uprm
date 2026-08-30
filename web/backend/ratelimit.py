"""
Tiny in-memory per-IP rate limiter — no external dependencies.

Good enough for a small team site: each gunicorn worker keeps its own
counters, so the real-world limit is (limit × workers), which is fine as a
spam brake. If the site ever needs strict global limits, swap this for a
Redis-backed limiter without changing the decorator interface.
"""

import time
import threading
from collections import defaultdict, deque
from functools import wraps

from flask import jsonify, request

_hits = defaultdict(deque)  # key -> deque[timestamps]
_lock = threading.Lock()

# Periodically drop stale keys so memory can't grow forever.
_CLEANUP_EVERY = 500
_calls_since_cleanup = 0


def _client_ip():
    fwd = request.headers.get("X-Forwarded-For", "")
    return fwd.split(",")[0].strip() if fwd else (request.remote_addr or "?")


def _cleanup(window):
    now = time.monotonic()
    stale = [key for key, dq in _hits.items() if not dq or now - dq[-1] > window]
    for key in stale:
        del _hits[key]


def rate_limit(max_requests, per_seconds):
    """Allow at most `max_requests` per `per_seconds` per client IP per route."""

    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            global _calls_since_cleanup
            key = (_client_ip(), request.endpoint)
            now = time.monotonic()

            with _lock:
                dq = _hits[key]
                # Drop entries that fell out of the window.
                while dq and now - dq[0] > per_seconds:
                    dq.popleft()

                if len(dq) >= max_requests:
                    retry_in = int(per_seconds - (now - dq[0])) + 1
                    response = jsonify(
                        ok=False,
                        error="Demasiadas solicitudes. Intenta de nuevo en un momento.",
                    )
                    response.status_code = 429
                    response.headers["Retry-After"] = str(retry_in)
                    return response

                dq.append(now)

                _calls_since_cleanup += 1
                if _calls_since_cleanup >= _CLEANUP_EVERY:
                    _calls_since_cleanup = 0
                    _cleanup(per_seconds)

            return fn(*args, **kwargs)

        return wrapper

    return decorator


def reset():
    """Clear all counters — used by tests."""
    with _lock:
        _hits.clear()
