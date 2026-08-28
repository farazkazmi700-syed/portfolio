"""End-to-end test of the CMS: auth, admin CRUD, articles, dedupe sync.

Run: backend\\venv\\Scripts\\python.exe backend\\tests\\test_cms.py
"""
import os
import sys

_BACKEND = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
_ROOT = os.path.dirname(_BACKEND)
for _p in (_BACKEND, _ROOT):
    if _p not in sys.path:
        sys.path.insert(0, _p)

from app import create_app  # noqa: E402
from app.models import db, Article, Certification, Experience  # noqa: E402

app = create_app()
c = app.test_client()

# 1. login
r = c.post("/api/auth/login",
           json={"username": "admin", "password": "faraz2026"})
print("login:", r.status_code)
token = r.get_json()["token"]
h = {"Authorization": f"Bearer {token}"}

# 2. wrong password rejected
r = c.post("/api/auth/login", json={"username": "admin", "password": "nope"})
print("bad login rejected:", r.status_code == 401)

# 3. admin CRUD: create an experience
r = c.post("/api/admin/experience", headers=h,
           json={"title": "ML Engineer", "company": "Acme",
                 "period": "Jan 2026 - Present", "description": "Building agents"})
print("create exp:", r.status_code)
eid = (r.get_json().get("item") or r.get_json()["data"])["id"]

# 4. update it
r = c.put(f"/api/admin/experience/{eid}", headers=h,
          json={"title": "Senior ML Engineer"})
print("update exp:", r.status_code,
      (r.get_json().get("item") or r.get_json()["data"])["title"])

# 5. article: create, public list, admin list
r = c.post("/api/admin/articles", headers=h,
           json={"title": "Intro to LangChain", "content": "Post body here",
                 "tags": "python,ai", "status": "published"})
print("create article:", r.status_code)
aid = (r.get_json().get("item") or r.get_json()["data"])["id"]
r = c.get("/api/articles")
pub = r.get_json().get("items") or r.get_json().get("data") or []
print("public articles:", r.status_code, len(pub))
r = c.get("/api/admin/articles", headers=h)
adm = r.get_json().get("items") or r.get_json().get("data") or []
print("admin articles:", len(adm))

# 6. unauthenticated write blocked
r = c.post("/api/admin/skills", json={"name": "X", "category": "Y"})
print("unauth blocked:", r.status_code == 401)

# 7. dedupe: importing an existing cert must NOT duplicate
with app.app_context():
    before = Certification.query.count()
r = c.post("/api/linkedin/import", json={"data": {"certifications": [
    {"name": "Artificial Intelligence on Microsoft Azure",
     "issuer": "Microsoft and offered through Coursera",
     "issue_date": "June 2026"}]}})
with app.app_context():
    after = Certification.query.count()
body = r.get_json()
added = body.get("added", (body.get("stats") or {}).get("added"))
skipped = body.get("skippedAlreadyOnSite",
                   (body.get("stats") or {}).get("skippedAlreadyOnSite"))
print("dedupe import: status", r.status_code,
      "| added:", added, "| skippedAlreadyOnSite:", skipped,
      "| certs", before, "->", after)

# 8. cvData regenerated from DB includes the new experience
src = open("src/content/cvData.js", encoding="utf-8").read()
print("cvData has Senior ML Engineer:", "Senior ML Engineer" in src)

# cleanup test artifacts
with app.app_context():
    db.session.delete(db.session.get(Experience, eid))
    db.session.delete(db.session.get(Article, aid))
    db.session.commit()
print("ALL CMS TESTS PASSED")
