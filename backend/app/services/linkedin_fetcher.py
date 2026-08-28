"""Fetch a LinkedIn public profile through an ordered chain of providers.

Providers (first configured one wins):
1. ScrapingDog  -> env `SCRAPINGDOG_API_KEY` (returns structured JSON)
2. RapidAPI     -> env `RAPIDAPI_KEY` + optional `RAPIDAPI_HOST`
3. Direct fetch -> best-effort anonymous scrape of the public profile page
                   (LinkedIn heavily rate-limits this; it may return an
                    auth-wall, in which case a SyncError is raised).
"""
import json
import os

import requests

from app.services.helpers import SyncError

DEFAULT_URL = "https://www.linkedin.com/in/muhammad-faraz-kazmi/"

_HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
        "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36"
    ),
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}

_TIMEOUT = 30


def _via_scrapingdog(linkedin_url):
    """Structured JSON provider: https://scrapingdog.com/linkedin"""
    api_key = os.getenv("SCRAPINGDOG_API_KEY")
    if not api_key:
        return None
    link_id = linkedin_url.rstrip("/").split("/in/")[-1]
    resp = requests.get(
        "https://api.scrapingdog.com/linkedin",
        params={"api_key": api_key, "linkId": link_id},
        timeout=_TIMEOUT,
    )
    if resp.status_code == 429:
        raise SyncError("ScrapingDog credits exhausted (HTTP 429).")
    resp.raise_for_status()
    payload = resp.json()
    # Some plans wrap the profile in a list or under a key.
    if isinstance(payload, list) and payload:
        payload = payload[0]
    if isinstance(payload, dict):
        for key in ("data", "profile", "results"):
            inner = payload.get(key)
            if isinstance(inner, dict):
                payload = inner
                break
    if not isinstance(payload, dict):
        raise SyncError("ScrapingDog returned an unexpected payload shape.")
    return {"kind": "json", "payload": payload}


def _via_rapidapi(linkedin_url):
    """Fetch a LinkedIn profile through RapidAPI's profile-data endpoint."""
    api_key = os.getenv("RAPIDAPI_KEY")
    if not api_key:
        return None
    host = os.getenv("RAPIDAPI_HOST", "linkedin-data-api.p.rapidapi.com")
    try:
        resp = requests.get(
            f"https://{host}/get-profile-data-by-url",
            params={"url": linkedin_url},
            headers={
                "X-RapidAPI-Key": api_key,
                "X-RapidAPI-Host": host,
            },
            timeout=_TIMEOUT,
        )
        resp.raise_for_status()
        payload = json.loads(resp.text)
    except (requests.RequestException, ValueError) as exc:  # pragma: no cover
        raise SyncError(f"RapidAPI fetch failed: {exc}") from exc
    if isinstance(payload, dict):
        for key in ("data", "profile", "results"):
            inner = payload.get(key)
            if isinstance(inner, dict):
                payload = inner
                break
    return {"kind": "json", "payload": payload}


def _direct(linkedin_url):
    """Best-effort anonymous fetch of the public profile HTML."""
    resp = requests.get(linkedin_url, headers=_HEADERS, timeout=_TIMEOUT)
    if resp.status_code in (401, 403, 429) or "authwall" in resp.url:
        raise SyncError(
            "Direct LinkedIn access blocked (LinkedIn requires login/rate-limits "
            "anonymous traffic). Configure SCRAPINGDOG_API_KEY / RAPIDAPI_KEY "
            "or use the manual import endpoint."
        )
    resp.raise_for_status()
    return {"kind": "html", "html": resp.text}


_PROVIDERS = (_via_scrapingdog, _via_rapidapi, _direct)


def fetch_profile_source(linkedin_url=DEFAULT_URL):
    """Return {'kind': 'json'|'html', ...} from the first usable provider."""
    last_error = None
    for provider in _PROVIDERS:
        try:
            result = provider(linkedin_url)
            if result is None:  # provider not configured, skip silently
                continue
            return result
        except SyncError as exc:
            last_error = exc
        except requests.RequestException as exc:
            last_error = SyncError(f"{provider.__name__} failed: {exc}")
    if last_error:
        raise last_error
    raise SyncError(
        "No LinkedIn provider available and no API key configured. "
        "Set SCRAPINGDOG_API_KEY or RAPIDAPI_KEY, or POST the profile JSON to "
        "/api/linkedin/import."
    )
