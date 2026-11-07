"""
GeoJSON Catchment & Watershed Boundary Definitions
For Raisen District and Surrounding Catchments (Central Madhya Pradesh, India).
Provides polygon boundaries for District Perimeter and 8 Sub-watershed / Tehsil Catchments.
"""

import json
import os
from typing import Dict, Any, List


# 8 Sub-Watershed / Tehsil Polygon Coordinates (Lon, Lat) in WGS84
# Reflecting real geographic zones of Raisen District, MP and western Bhopal catchment boundary.
TEHSIL_POLYGONS: Dict[str, Dict[str, Any]] = {
    'RAISEN': {
        'name': 'Raisen Headquarters Catchment',
        'code': 'RAISEN',
        'river_basin': 'Upper Betwa River Basin',
        'area_sqkm': 1185,
        'dominant_soil': 'Deep Vertisol (Black Clay)',
        'polygon': [
            [77.62, 23.46],
            [77.88, 23.48],
            [77.96, 23.35],
            [77.92, 23.18],
            [77.68, 23.16],
            [77.60, 23.28],
            [77.62, 23.46]
        ]
    },
    'BHOPAL': {
        'name': 'Bhopal Border Watershed',
        'code': 'BHOPAL',
        'river_basin': 'Kaliasot - Halali Catchment',
        'area_sqkm': 840,
        'dominant_soil': 'Clay Loam Plateau',
        'polygon': [
            [77.28, 23.38],
            [77.58, 23.42],
            [77.60, 23.22],
            [77.48, 23.12],
            [77.26, 23.18],
            [77.28, 23.38]
        ]
    },
    'BERASIA': {
        'name': 'Berasia Northern Watershed',
        'code': 'BERASIA',
        'river_basin': 'Halali - Bah River Catchment',
        'area_sqkm': 920,
        'dominant_soil': 'Medium Vertisol',
        'polygon': [
            [77.28, 23.75],
            [77.60, 23.78],
            [77.65, 23.50],
            [77.38, 23.45],
            [77.25, 23.58],
            [77.28, 23.75]
        ]
    },
    'GHAIRATGANJ': {
        'name': 'Ghairatganj Vindhyan Basin',
        'code': 'GHAIRATGANJ',
        'river_basin': 'Bina - Baigun Sub-Basin',
        'area_sqkm': 1045,
        'dominant_soil': 'Vindhyan Loam / Stony Clay',
        'polygon': [
            [77.90, 23.56],
            [78.22, 23.55],
            [78.26, 23.32],
            [77.98, 23.30],
            [77.90, 23.42],
            [77.90, 23.56]
        ]
    },
    'BEGUMGANJ': {
        'name': 'Begumganj Highland Watershed',
        'code': 'BEGUMGANJ',
        'river_basin': 'Upper Bina River Headwaters',
        'area_sqkm': 1210,
        'dominant_soil': 'Medium Black & Red Gravelly',
        'polygon': [
            [78.18, 23.78],
            [78.48, 23.76],
            [78.50, 23.48],
            [78.22, 23.45],
            [78.18, 23.62],
            [78.18, 23.78]
        ]
    },
    'Silvani': {
        'name': 'Silvani Forest Margin Catchment',
        'code': 'Silvani',
        'river_basin': 'Barna - Tendoni River Basin',
        'area_sqkm': 1340,
        'dominant_soil': 'Undulating Forest Clay Loam',
        'polygon': [
            [78.26, 23.45],
            [78.62, 23.44],
            [78.65, 23.15],
            [78.35, 23.12],
            [78.25, 23.28],
            [78.26, 23.45]
        ]
    },
    'BARELI': {
        'name': 'Bareli Southern Narmada Plain',
        'code': 'BARELI',
        'river_basin': 'Narmada - Barna Confluence',
        'area_sqkm': 1120,
        'dominant_soil': 'Deep Alluvial Vertisol',
        'polygon': [
            [78.02, 23.05],
            [78.38, 23.08],
            [78.42, 22.76],
            [78.10, 22.75],
            [77.95, 22.88],
            [78.02, 23.05]
        ]
    },
    'UDAIPURA': {
        'name': 'Udaipura Alluvial Valley',
        'code': 'UDAIPURA',
        'river_basin': 'Narmada Eastern Tributary Basin',
        'area_sqkm': 960,
        'dominant_soil': 'Heavy Alluvial Black Clay',
        'polygon': [
            [78.36, 23.22],
            [78.68, 23.20],
            [78.70, 22.95],
            [78.38, 22.92],
            [78.34, 23.08],
            [78.36, 23.22]
        ]
    }
}

# Raisen District Administrative & Catchment Boundary Outer Perimeter
RAISEN_DISTRICT_PERIMETER = [
    [77.40, 23.15],
    [77.28, 23.38],
    [77.28, 23.75],
    [77.60, 23.78],
    [78.18, 23.78],
    [78.48, 23.76],
    [78.62, 23.44],
    [78.68, 23.20],
    [78.70, 22.95],
    [78.42, 22.76],
    [78.10, 22.75],
    [77.95, 22.88],
    [77.68, 23.16],
    [77.48, 23.12],
    [77.40, 23.15]
]


def generate_catchments_geojson(output_path: str = "data/processed/raisen_catchments.geojson") -> Dict[str, Any]:
    """Generates standard RFC 7946 GeoJSON FeatureCollection."""
    features = []

    # 1. District Outer Perimeter Feature
    features.append({
        "type": "Feature",
        "id": "RAISEN_DISTRICT_BOUNDARY",
        "properties": {
            "name": "Raisen District Hydrological Perimeter",
            "type": "District Boundary",
            "state": "Madhya Pradesh",
            "basin": "Betwa - Narmada Inter-Basin Corridor",
            "total_area_sqkm": 8395
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [RAISEN_DISTRICT_PERIMETER]
        }
    })

    # 2. Individual Tehsil / Catchment Features
    for code, info in TEHSIL_POLYGONS.items():
        features.append({
            "type": "Feature",
            "id": code,
            "properties": {
                "name": info['name'],
                "tehsil_code": code,
                "river_basin": info['river_basin'],
                "area_sqkm": info['area_sqkm'],
                "dominant_soil": info['dominant_soil']
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [info['polygon']]
            }
        })

    geojson_data = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {"name": "urn:ogc:def:crs:OGC:1.3:CRS84"}
        },
        "features": features
    }

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(geojson_data, f, indent=2)

    return geojson_data


def get_catchment_polygons():
    """Returns the polygon dictionary directly for rapid Plotly trace generation."""
    return TEHSIL_POLYGONS, RAISEN_DISTRICT_PERIMETER


if __name__ == "__main__":
    gj = generate_catchments_geojson()
    print(f"Generated GeoJSON with {len(gj['features'])} features.")

