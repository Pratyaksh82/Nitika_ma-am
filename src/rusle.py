"""
Revised Universal Soil Loss Equation (RUSLE) Engine
Couples forecasted rainfall with regional soil erodibility, topography, and seasonal canopy cover.
"""

from typing import Dict, Any, Tuple


# Soil Erodibility (K-factor) by Region (Raisen district soil survey)
REGION_K_FACTOR = {
    'BARELI': 0.32,       # Deep Black Vertisol
    'BEGUMGANJ': 0.30,    # Medium Black Soil
    'BERASIA': 0.28,      # Loamy Black Soil
    'BHOPAL': 0.28,       # Clay Loam Plateau
    'GHAIRATGANJ': 0.34,  # Weathered Vindhyan Loam
    'RAISEN': 0.31,       # Central District Vertisol
    'Silvani': 0.33,      # Undulating Forest-Margin Clay Loam
    'UDAIPURA': 0.32      # Fertile Alluvial Black Clay
}

# Topographic Slope Length & Steepness (LS-factor)
REGION_LS_FACTOR = {
    'BARELI': 1.35,
    'BEGUMGANJ': 2.20,
    'BERASIA': 1.60,
    'BHOPAL': 1.75,
    'GHAIRATGANJ': 2.45,
    'RAISEN': 2.10,
    'Silvani': 2.60,
    'UDAIPURA': 1.40
}


def calculate_rainfall_erosivity(rainfall_mm: float) -> float:
    """
    Computes Rainfall-Runoff Erosivity Factor (R) using the standard Foster / ICAR formula:
    R = 0.0483 * P^1.610 (for daily rainfall in mm)
    """
    if rainfall_mm <= 0.0:
        return 0.0
    return float(0.0483 * (rainfall_mm ** 1.610))


def get_cover_factor_by_month(month: int) -> float:
    """
    Derives C-factor (Cover Management) based on seasonal NDVI vegetation canopy in Central India.
    Lush monsoon canopy provides highest protection (low C), dry fallow provides lowest (high C).
    """
    if month in [7, 8, 9]:
        return 0.12  # Peak monsoon vegetation & crop canopy
    elif month in [10, 11]:
        return 0.22  # Post-monsoon standing crops
    elif month in [12, 1, 2]:
        return 0.28  # Rabi season (wheat/mustard)
    elif month in [3, 4, 5]:
        return 0.42  # Summer fallow & exposed dry topsoil
    else:  # June
        return 0.25  # Early tillage & pre-monsoon planting


def calculate_soil_loss(rainfall_mm: float, region: str, month: int, p_factor: float = 0.85) -> Dict[str, Any]:
    """
    Calculates the Revised Universal Soil Loss Equation (RUSLE):
      A = R * K * LS * C * P
    Returns:
      A: Estimated soil loss (tons / hectare / year equivalent rate)
      Parameters breakdown (R, K, LS, C, P)
      Severity Class & Recommended Interventions
    """
    # 1. Factors
    r = calculate_rainfall_erosivity(rainfall_mm)
    k = REGION_K_FACTOR.get(region, 0.30)
    ls = REGION_LS_FACTOR.get(region, 1.80)
    c = get_cover_factor_by_month(month)
    p = p_factor

    # 2. Universal Soil Loss
    a = float(r * k * ls * c * p)

    # 3. ICAR Severity Classification
    if a < 5.0:
        severity = "Slight (Low)"
        color = "#10b981"  # Emerald Green
        advice = "Soil loss is within tolerable regeneration limits. Maintain existing conservation tillage."
    elif 5.0 <= a < 10.0:
        severity = "Moderate"
        color = "#f59e0b"  # Amber
        advice = "Moderate erosion risk. Recommended: Strip cropping, mulch cover, and vegetative contour barriers."
    elif 10.0 <= a < 20.0:
        severity = "High"
        color = "#f97316"  # Orange
        advice = "High topsoil detachment risk. Implement earthen contour bunding and broad-bed furrow systems."
    elif 20.0 <= a < 40.0:
        severity = "Very High"
        color = "#ef4444"  # Red
        advice = "Severe erosion hazard. Construct check dams, stone terracing, and permanent grassed waterways."
    else:
        severity = "Severe (Critical)"
        color = "#7f1d1d"  # Dark Crimson
        advice = "Critical emergency threshold! Immediate gully control, afforestation, and diversion ditching required."

    return {
        'rainfall_mm': round(rainfall_mm, 2),
        'region': region,
        'month': month,
        'R_factor': round(r, 4),
        'K_factor': round(k, 3),
        'LS_factor': round(ls, 2),
        'C_factor': round(c, 3),
        'P_factor': round(p, 2),
        'soil_loss_tons_per_ha': round(a, 3),
        'severity': severity,
        'badge_color': color,
        'intervention': advice
    }


if __name__ == '__main__':
    # Test sample with 45mm monsoon storm in Raisen
    res = calculate_soil_loss(rainfall_mm=45.0, region='RAISEN', month=8)
    print("\n[RUSLE TEST CALCULATION]")
    for key, val in res.items():
        print(f"  {key}: {val}")

