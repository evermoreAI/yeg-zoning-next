#!/usr/bin/env python3
"""
scraper/crawl_hearings.py

Uses crawl4ai to fetch Edmonton's council/committee meetings page and extract
any public hearing notices that mention zone codes (RS, RSF, RM, RH, MU, DC).

Writes results to scraper/amendments.json.
Run manually:  scraper/.venv/bin/python3 scraper/crawl_hearings.py
Scheduled via: app/api/update-amendments (Vercel cron triggers a TS re-scrape;
               this script is for local runs and CI).
"""

import asyncio
import json
import re
import sys
from datetime import datetime
from pathlib import Path

from crawl4ai import AsyncWebCrawler, CrawlerRunConfig

# ── Config ────────────────────────────────────────────────────────────────────

COUNCIL_URL    = "https://www.edmonton.ca/city_government/council-committee-meetings"
BYLAW_URL      = "https://pub-edmonton.escribemeetings.com/"
OUT_FILE       = Path(__file__).parent / "amendments.json"

# Zone codes to watch — order matters: more specific first (DC before D)
WATCH_ZONES    = ["RSF", "RSM", "RSL", "RS", "RH", "RM", "MU", "MUN", "DC"]

# Date patterns to extract from text
DATE_RE = re.compile(
    r"\b(January|February|March|April|May|June|July|August|September|October|November|December)"
    r"\s+\d{1,2},?\s+20\d{2}\b",
    re.IGNORECASE,
)

ZONE_RE = re.compile(r"\b(RSF|RSM|RSL|RS|RH|RM|MUN|MU|DC)\b")

# ── Scrape ────────────────────────────────────────────────────────────────────

async def scrape_hearings() -> dict:
    """
    Fetches Edmonton council meetings page and parses zone hearing notices.
    Returns dict keyed by zone code with warning details.
    """
    found: dict[str, dict] = {}

    config = CrawlerRunConfig(
        word_count_threshold=10,
        excluded_tags=["nav", "footer", "header", "script", "style"],
        only_text=False,
    )

    async with AsyncWebCrawler(verbose=False) as crawler:
        for url in [COUNCIL_URL, BYLAW_URL]:
            print(f"[crawl] Fetching {url}", file=sys.stderr)
            try:
                result = await crawler.arun(url=url, config=config)
                if not result.success:
                    print(f"[crawl] Failed: {url}", file=sys.stderr)
                    continue

                text = result.markdown or result.extracted_content or ""
                _parse_text(text, url, found)
            except Exception as e:
                print(f"[crawl] Error on {url}: {e}", file=sys.stderr)

    return found


def _parse_text(text: str, source_url: str, found: dict) -> None:
    """
    Scans text for zone code mentions near hearing-related keywords.
    Extracts date and description for each zone found.
    """
    hearing_keywords = [
        "public hearing", "bylaw amendment", "rezoning", "zone amendment",
        "zoning bylaw", "charter bylaw", "height limit", "unit cap",
    ]

    lines = text.splitlines()
    for i, line in enumerate(lines):
        line_lower = line.lower()
        if not any(kw in line_lower for kw in hearing_keywords):
            continue

        # Grab a window of lines around the match for context
        window = "\n".join(lines[max(0, i-2) : i+5])

        zones_in_window = ZONE_RE.findall(window)
        if not zones_in_window:
            continue

        dates_in_window = DATE_RE.findall(window)
        # Re-search for full date strings
        full_dates = DATE_RE.findall(window)

        # Build description from the triggering line (truncated)
        desc = line.strip()[:200]

        for zone in set(zones_in_window):
            # Only update if we found a date, or if no entry yet
            if zone not in found or full_dates:
                found[zone] = {
                    "warning":      True,
                    "hearing_date": full_dates[0] if full_dates else "date TBC",
                    "description":  desc,
                    "source_url":   source_url,
                    "scraped_at":   datetime.utcnow().isoformat() + "Z",
                }
                print(f"[crawl] Found {zone}: {desc[:60]}...", file=sys.stderr)


# ── Seed / merge ──────────────────────────────────────────────────────────────

# Known amendments as of Feb 28 2026 — scraper adds/updates on top of this.
# These are only used as fallback if the live scrape finds nothing.
KNOWN_AMENDMENTS: dict[str, dict] = {
    "RS": {
        "warning":      True,
        "hearing_date": "April 7 2026",
        "description":  "Height limit under review — public hearing April 7 2026. Verify with City of Edmonton.",
        "source_url":   "https://www.edmonton.ca",
        "scraped_at":   "2026-02-28T00:00:00Z",
    },
    "RSF": {
        "warning":      True,
        "hearing_date": "April 7 2026",
        "description":  "Height limit under review — public hearing April 7 2026 may affect RSF zone.",
        "source_url":   "https://www.edmonton.ca",
        "scraped_at":   "2026-02-28T00:00:00Z",
    },
}


async def main():
    print("[crawl] Starting hearing scrape...", file=sys.stderr)

    # Start with known amendments as baseline
    amendments = dict(KNOWN_AMENDMENTS)

    # Merge live scraped results on top
    live = await scrape_hearings()
    amendments.update(live)

    amendments["_meta"] = {
        "last_run": datetime.utcnow().isoformat() + "Z",
        "zones_found": list(live.keys()),
    }

    OUT_FILE.write_text(json.dumps(amendments, indent=2))
    print(f"[crawl] Done. Wrote {OUT_FILE}", file=sys.stderr)
    print(json.dumps(amendments, indent=2))


if __name__ == "__main__":
    asyncio.run(main())
