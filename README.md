# UPRM Solar Boat Team website

The repository contains the team's public website and a Flask API for contact,
recruitment, and event-notification submissions. The contact page currently
opens the visitor's email application with a prefilled message using `mailto:`.
The Join page links to the team's Linktree; the backend recruitment and
notification endpoints are available for integrations.

## Repository layout

```text
.github/workflows/deploy-pages.yml  Publishes the static frontend to GitHub Pages
web/frontend/                       Static HTML, CSS, JavaScript, and images
web/backend/                        Flask API, SQLite persistence, and deployment config
PENDIENTES.md                       Project tasks and status
```

See the [frontend guide](web/frontend/README.md) for page and asset conventions,
and the [backend guide](web/backend/README.md) for API setup and deployment.

## Run locally

Use two terminals from the repository root. Python 3 is needed for both servers;
the backend also needs the packages in `web/backend/requirements.txt`.

```sh
# Terminal 1: start the API
cd web/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # optional; edit settings as needed
python app.py

# Terminal 2: serve the website
cd web/frontend
python3 -m http.server 8000
```

Open <http://localhost:8000>. The contact form opens the user's email
application. The Join page opens Linktree. The backend API is available at
`http://localhost:5000` for integrations; `API_BASE` is configured in
`web/frontend/js/api.js`.

## Checks

```sh
# Frontend logic tests (Node.js)
cd web/frontend
node --test tests/*.test.js

# Backend tests (activate the backend virtual environment first)
cd ../backend
pip install pytest
pytest -q
```

## Deployment

GitHub Actions publishes `web/frontend/` to GitHub Pages on pushes to `main`
after Pages is configured to use GitHub Actions. The backend is configured for
Render in `web/backend/render.yaml`; set its environment variables in the
hosting dashboard. If frontend forms are connected to the API, set `API_BASE`
to the deployed backend URL and set `ALLOWED_ORIGINS` to the website's origin.
Keep secrets in the host's environment settings, never in the repository.
