#!/usr/bin/env python3
"""Fetch Cologne building footprints from OSM and assign synthetic construction years.

The script queries Overpass for four districts (Altstadt, Ehrenfeld, Chorweiler, Mülheim),
picks a random year within a configured range per district, and exports both GeoJSON and CSV
so the visualization can fall back to colorful data even when `building:year_built` is missing.
"""

from __future__ import annotations

import csv
import json
import random
import sys
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Tuple
from urllib import parse, request

OVERPASS_URL = "https://overpass-api.de/api/interpreter"
OUTPUT_GEOJSON = Path("synthetic_building_age.geojson")
OUTPUT_CSV = Path("synthetic_building_age.csv")


@dataclass
class District:
    name: str
    bbox: Tuple[float, float, float, float]  # south, west, north, east
    year_range: Tuple[int, int]
    limit: int = 2000


DISTRICTS: List[District] = [
    District(
        name="Altstadt",
        bbox=(50.9300, 6.9400, 50.9485, 6.9790),
        year_range=(1850, 1950),
    ),
    District(
        name="Ehrenfeld",
        bbox=(50.9400, 6.8900, 50.9850, 6.9650),
        year_range=(1920, 1980),
    ),
    District(
        name="Chorweiler",
        bbox=(50.9900, 6.8600, 51.0700, 6.9600),
        year_range=(1970, 2000),
    ),
    District(
        name="Mülheim",
        bbox=(50.9500, 6.9900, 51.0200, 7.0700),
        year_range=(1930, 2000),
    ),
]


def fetch_overpass(query: str) -> Dict:
    data = parse.urlencode({"data": query}).encode("utf-8")
    req = request.Request(
        OVERPASS_URL,
        data=data,
        headers={"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"},
    )
    with request.urlopen(req, timeout=120) as resp:
        if resp.status != 200:
            raise RuntimeError(f"Overpass returned HTTP {resp.status}")
        payload = resp.read()
    return json.loads(payload)


def overpass_to_geojson(data: Dict) -> Dict:
    features: List[Dict] = []
    for el in data.get("elements", []):
        if el.get("type") != "way":
            continue
        geometry = el.get("geometry") or []
        if len(geometry) < 3:
            continue
        coords = [[pt["lon"], pt["lat"]] for pt in geometry]
        # ensure polygon is closed
        if coords[0] != coords[-1]:
            coords.append(coords[0])
        features.append(
            {
                "type": "Feature",
                "id": f"way/{el.get('id')}",
                "properties": el.get("tags", {}),
                "geometry": {"type": "Polygon", "coordinates": [coords]},
            }
        )
    return {"type": "FeatureCollection", "features": features}


def polygon_centroid(coords: Iterable[Iterable[float]]) -> Tuple[float, float]:
    xs: List[float] = []
    ys: List[float] = []
    for lon, lat in coords:
        xs.append(lon)
        ys.append(lat)
    if not xs:
        return 0.0, 0.0
    return sum(xs) / len(xs), sum(ys) / len(ys)


def assign_year(range_pair: Tuple[int, int]) -> int:
    low, high = range_pair
    return random.randint(low, high)


def load_district_buildings(district: District) -> Dict:
    south, west, north, east = district.bbox
    query = f"""
    [out:json][timeout:60];
    (
      way["building"]({south},{west},{north},{east});
    );
    out geom {district.limit};
    """
    print(f"[overpass] Fetching {district.name} …")
    data = fetch_overpass(query)
    return overpass_to_geojson(data)


def enrich_features(district: District, features: List[Dict]) -> List[Dict]:
    enriched: List[Dict] = []
    low, high = district.year_range
    for feature in features:
        coords = feature["geometry"]["coordinates"][0]
        centroid_lon, centroid_lat = polygon_centroid(coords)
        assigned_year = assign_year((low, high))
        props = feature.get("properties", {}).copy()
        props.update(
            {
                "district": district.name,
                "year_built": assigned_year,
                "year_source": f"synthetic:{district.name}",
                "year_range": f"{low}-{high}",
                "centroid_lon": centroid_lon,
                "centroid_lat": centroid_lat,
            }
        )
        enriched.append(
            {
                "type": "Feature",
                "id": feature.get("id"),
                "properties": props,
                "geometry": feature["geometry"],
            }
        )
    return enriched


def export_geojson(features: List[Dict], path: Path) -> None:
    payload = {"type": "FeatureCollection", "features": features}
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[write] GeoJSON → {path.resolve()}")


def export_csv(features: List[Dict], path: Path) -> None:
    fieldnames = ["id", "district", "year_built", "year_range"]
    with path.open("w", newline="", encoding="utf-8") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        for feature in features:
            props = feature.get("properties", {})
            writer.writerow(
                {
                    "id": feature.get("id"),
                    "district": props.get("district"),
                    "year_built": props.get("year_built"),
                    "year_range": props.get("year_range"),
                }
            )
    print(f"[write] CSV → {path.resolve()}")


def main(seed: int = 42) -> None:
    random.seed(seed)
    all_features: List[Dict] = []
    for district in DISTRICTS:
        gj = load_district_buildings(district)
        enriched = enrich_features(district, gj["features"])
        print(f"[data] {district.name}: {len(enriched)} buildings synthesized ({district.year_range[0]}–{district.year_range[1]})")
        all_features.extend(enriched)
        time.sleep(1.0)  # be polite to Overpass

    if not all_features:
        raise SystemExit("No buildings fetched; adjust bbox or retry later.")

    export_geojson(all_features, OUTPUT_GEOJSON)
    export_csv(all_features, OUTPUT_CSV)


if __name__ == "__main__":
    try:
        seed = int(sys.argv[1]) if len(sys.argv) > 1 else 42
    except ValueError:
        print("Usage: python generate_synthetic_building_age.py [seed]", file=sys.stderr)
        raise SystemExit(2)
    main(seed)
