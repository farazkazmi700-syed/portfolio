"""Small shared helpers used across the sync services."""
import re


MONTHS = {
    m.lower(): i
    for i, m in enumerate(
        [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December",
        ],
        start=1,
    )
}

_ABBREV = {
    "jan": 1, "feb": 2, "mar": 3, "apr": 4, "may": 5, "jun": 6,
    "jul": 7, "aug": 8, "sep": 9, "sept": 9, "oct": 10, "nov": 11, "dec": 12,
}


class SyncError(Exception):
    """Raised when a LinkedIn profile cannot be fetched or parsed."""


def period_sort_key(period):
    """Return a sortable tuple for human date strings like
    'June, 2026', 'Feb 2024 – May 2026', '2023-Present'.

    Higher tuples mean more recent. Unknown strings sort oldest.
    """
    if not period or not isinstance(period, str):
        return (0, 0)
    # Use the LAST year/month mentioned (usually the end date).
    years = [int(y) for y in re.findall(r"(20\d{2}|\d{4})", period)]
    year = max(years) if years else 0
    month = 0
    for token in re.findall(r"[A-Za-z]+", period.lower()):
        if token[:3] in _ABBREV:
            m = _ABBREV[token[:3]]
        elif token in MONTHS:
            m = MONTHS[token]
        else:
            continue
        month = max(month, m)
    return (year, month)


def years_for_period(period):
    """Best-effort integer year extracted from a period string (0 if none)."""
    return period_sort_key(period)[0]


def clean(value):
    """Normalize whitespace and strip empties."""
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value)).strip()
