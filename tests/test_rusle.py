"""
RUSLE Soil Erosion Sanity Tests
"""

import pytest
from src.rusle import calculate_rainfall_erosivity, calculate_soil_loss, REGION_K_FACTOR, REGION_LS_FACTOR


def test_rainfall_erosivity_zero():
    assert calculate_rainfall_erosivity(0.0) == 0.0
    assert calculate_rainfall_erosivity(-5.0) == 0.0


def test_rainfall_erosivity_positive():
    r = calculate_rainfall_erosivity(50.0)
    # 0.0483 * 50^1.610 ~ 26.07
    assert 20.0 < r < 35.0


def test_rusle_all_regions_defined():
    expected_regions = ['BARELI', 'BEGUMGANJ', 'BERASIA', 'BHOPAL', 'GHAIRATGANJ', 'RAISEN', 'Silvani', 'UDAIPURA']
    for reg in expected_regions:
        assert reg in REGION_K_FACTOR
        assert reg in REGION_LS_FACTOR
        res = calculate_soil_loss(rainfall_mm=25.0, region=reg, month=7)
        assert res['soil_loss_tons_per_ha'] >= 0.0
        assert res['severity'] in ["Slight (Low)", "Moderate", "High", "Very High", "Severe (Critical)"]

