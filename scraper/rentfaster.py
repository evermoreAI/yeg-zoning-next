#!/usr/bin/env python3
"""
scraper/rentfaster.py

Scrapes rentfaster.ca Edmonton listings via headless browser (bypasses Cloudflare).
Aggregates per neighbourhood: avg rents by bedroom count, median DOM, vacancy pressure.

Usage:
    python3 scraper/rentfaster.py

Output:
    scraper/rentfaster.json

Run daily via cron or Vercel cron + GitHub Actions.
"""

import asyncio, json, sys, os, statistics
from collections import defaultdict
from datetime import datetime, timezone
from pathlib import Path

OUTPUT = Path(__file__).parent / 'rentfaster.json'


async def fetch_listings() -> list[dict]:
    """Fetch all Edmonton listings from rentfaster.ca/api/map.json via headless browser."""
    from playwright.async_api import async_playwright

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        ctx = await browser.new_context(
            user_agent=(
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) '
                'AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
            )
        )
        page = await ctx.new_page()
        print('[rentfaster] Loading Edmonton listings page...', flush=True)
        await page.goto(
            'https://www.rentfaster.ca/ab/edmonton/rentals/',
            wait_until='domcontentloaded',
            timeout=45_000,
        )
        await page.wait_for_timeout(7_000)

        print('[rentfaster] Fetching map.json via in-page fetch...', flush=True)
        data = await page.evaluate(
            'async () => { const r = await fetch("/api/map.json", {credentials:"same-origin"}); return await r.json(); }'
        )
        await browser.close()

    listings = data.get('listings', [])
    print(f'[rentfaster] Fetched {len(listings)} listings', flush=True)
    return listings


def aggregate(listings: list[dict]) -> dict:
    """Aggregate listings into per-neighbourhood stats."""
    now  = datetime.now(timezone.utc)
    hood = defaultdict(list)

    for l in listings:
        community = (l.get('community') or '').strip().upper()
        if not community:
            continue

        price  = _num(l.get('price'))
        beds   = _beds(l.get('beds'))
        rented = bool(l.get('rented') or l.get('s') == 'RENTED')
        date_s = l.get('date', '')

        days: int | None = None
        if date_s:
            try:
                listed = datetime.strptime(date_s, '%Y-%m-%d').replace(tzinfo=timezone.utc)
                days   = (now - listed).days
            except Exception:
                pass

        hood[community].append({
            'price':  price,
            'beds':   beds,
            'days':   days,
            'rented': rented,
        })

    result: dict[str, dict] = {}
    for name, items in hood.items():
        active  = [x for x in items if not x['rented']]
        total   = len(items)
        n_active = len(active)

        # Rents by bedroom count (active listings only)
        def avg_rent(bed_filter: int | None) -> int | None:
            prices = [
                x['price'] for x in active
                if x['price'] and x['price'] > 300
                and (bed_filter is None or x['beds'] == bed_filter)
            ]
            return round(statistics.median(prices)) if prices else None

        # Days on market — exclude outliers over 90 days, use median
        dom_values = [
            x['days'] for x in active 
            if x['days'] is not None and 0 <= x['days'] <= 90
        ]
        median_dom = round(statistics.median(dom_values)) if dom_values else None

        # Vacancy pressure: % of active listings over 30 days
        over_30    = sum(1 for x in active if x['days'] is not None and x['days'] > 30)
        vacancy_pct = round(over_30 / n_active * 100) if n_active > 0 else None

        result[name] = {
            'listing_count':   n_active,
            'total_in_feed':   total,
            'rent_bachelor':   avg_rent(0),
            'rent_1br':        avg_rent(1),
            'rent_2br':        avg_rent(2),
            'rent_3br':        avg_rent(3),
            'median_dom':      median_dom,
            'vacancy_pressure_pct': vacancy_pct,
            'listings_over_30d': over_30,
        }

    # Also compute city-wide averages (excluding 90+ day outliers)
    all_active = [x for items in hood.values() for x in items if not x['rented']]
    all_dom = [x['days'] for x in all_active if x['days'] is not None and 0 <= x['days'] <= 90]
    result['_EDMONTON_CITYWIDE'] = {
        'listing_count': len(all_active),
        'rent_bachelor': _citywide_avg(all_active, 0),
        'rent_1br':      _citywide_avg(all_active, 1),
        'rent_2br':      _citywide_avg(all_active, 2),
        'rent_3br':      _citywide_avg(all_active, 3),
        'median_dom':    round(statistics.median(all_dom)) if all_dom else None,
        'vacancy_pressure_pct': None,
        'listings_over_30d': sum(1 for x in all_active if x['days'] is not None and x['days'] > 30),
    }

    return result


def _citywide_avg(active: list[dict], beds: int) -> int | None:
    prices = [x['price'] for x in active if x['price'] and x['price'] > 300 and x['beds'] == beds]
    return round(statistics.median(prices)) if prices else None


def _num(v) -> float | None:
    try:
        f = float(str(v).replace(',', ''))
        return f if f > 0 else None
    except Exception:
        return None


def _beds(v) -> int | None:
    try:
        return int(str(v))
    except Exception:
        return None


def main():
    listings  = asyncio.run(fetch_listings())
    stats     = aggregate(listings)
    output    = {
        'updated':    datetime.now(timezone.utc).isoformat(),
        'total_listings': len(listings),
        'neighbourhoods': stats,
    }
    OUTPUT.write_text(json.dumps(output, indent=2))
    print(f'[rentfaster] Wrote {len(stats)} neighbourhoods to {OUTPUT}')

    # Preview a few
    for name in ['DOWNTOWN', 'MCKERNAN', 'GARNEAU', 'ROSENTHAL', '_EDMONTON_CITYWIDE']:
        s = stats.get(name)
        if s:
            print(f'  {name}: count={s["listing_count"]} 2BR={s["rent_2br"]} DOM={s["median_dom"]}d vac={s["vacancy_pressure_pct"]}%')


if __name__ == '__main__':
    main()
