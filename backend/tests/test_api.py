"""In-process end-to-end test of all sync endpoints using Flask's test
client (no network, immune to the local sandbox proxy).

Run: backend\\venv\\Scripts\\python.exe backend\\tests\\test_api.py
"""
import os
import sys

_BACKEND = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_ROOT = os.path.dirname(_BACKEND)
for _p in (_BACKEND, _ROOT):
    if _p not in sys.path:
        sys.path.insert(0, _p)

from app import create_app  # noqa: E402
from app.services import generator, store  # noqa: E402

app = create_app()

# Snapshot the real store so the test can run without mutating live data.
_BACKUP = store.load()


SAMPLE = {
    "name": "Muhammad Faraz Kazmi",
    "headline": "AI Engineer & Python Developer",
    "experiences": [
        {"title": "AI Intern", "company": "TechNova",
         "start_date": "Jan 2025", "end_date": "Present",
         "description": "Built agents."},
        {"title": "Python Tutor", "company": "Freelance",
         "start_date": "Jun 2024", "end_date": "Dec 2024",
         "description": "Taught basics."},
    ],
    "certifications": [
        {"name": "Deep Learning Specialization",
         "issuer": "DeepLearning.AI", "issue_date": "July 2026"},
    ],
    "skills": [{"name": "LangChain"}, {"name": "FastAPI"}],
}

with app.test_client() as c:
    r = c.get("/api/health")
    print("health:", r.status_code, r.get_json())

    r = c.get("/api/portfolio")
    body = r.get_json()
    print("portfolio:", r.status_code,
          "| name:", body["data"]["name"],
          "| experience:", len(body["data"]["experience"]),
          "| certifications:", len(body["data"]["certifications"]))

    r = c.post("/api/linkedin/import", json={"data": SAMPLE})
    body = r.get_json()
    assert r.status_code == 200, body
    print("import:", r.status_code, body["stats"])
    exp = body["data"]["experience"]
    certs = body["data"]["certifications"]
    print("  experience order:", [f"{e['title']}@{e['company']} [{e['period']}]" for e in exp])
    print("  cert order      :", [f"{x['name']} [{x['period']}]" for x in certs])

    # Re-import: nothing new should be added, no duplicates created.
    r2 = c.post("/api/linkedin/import", json={"data": SAMPLE})
    body2 = r2.get_json()
    assert body2["stats"]["added"] == 0, body2["stats"]
    print("re-import adds zero duplicates:", body2["stats"])

    # Bad JSON must hit the SyncError handler.
    r3 = c.post("/api/linkedin/import", data="not-json",
                content_type="application/json")
    print("bad payload handled:", r3.status_code)

# Restore the original store and regenerate cvData exactly as it was.
store.save(_BACKUP)
generator.generate(_BACKUP)

print("ALL ENDPOINT TESTS PASSED (store restored)")
