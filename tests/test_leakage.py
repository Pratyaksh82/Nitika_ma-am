"""
Target Leakage Sanity Test Suite
Guarantees mathematically that features on day t NEVER contain information from rainfall on day t.
"""

import pytest
import pandas as pd
import numpy as np
from src.features import build_feature_matrix


def test_zero_target_leakage_on_isolated_spike():
    """
    Constructs an isolated shock event: 0 mm on days 1..40, 200 mm on day 41, 0 mm on days 42..60.
    Verifies that on day 41, all rolling means, rolling max, and lags are EXACTLY 0.0.
    """
    dates = pd.date_range(start='2020-01-01', periods=60, freq='D')
    rainfall = np.zeros(60)
    spike_idx = 40  # Day 41 (2020-02-10)
    rainfall[spike_idx] = 200.0  # Extreme storm spike

    df_test = pd.DataFrame({
        'Date': dates,
        'Region': 'TEST_REGION',
        'Rainfall': rainfall,
        'Rainfall_Missing_Flag': 0
    })

    df_feat = build_feature_matrix(df_test)

    # Locate day 41 (spike day)
    spike_row = df_feat[df_feat['Date'] == dates[spike_idx]].iloc[0]

    # Target on spike day is 200.0
    assert spike_row['Rainfall'] == 200.0

    # Critical assertions: NO feature on spike day should know about the 200.0 mm rain!
    assert spike_row['Lag_1'] == 0.0, "Leakage detected in Lag_1!"
    assert spike_row['Lag_2'] == 0.0, "Leakage detected in Lag_2!"
    assert spike_row['Rolling_Mean_3'] == 0.0, "Catastrophic Leakage detected in Rolling_Mean_3!"
    assert spike_row['Rolling_Mean_7'] == 0.0, "Catastrophic Leakage detected in Rolling_Mean_7!"
    assert spike_row['Rolling_Max_7'] == 0.0, "Catastrophic Leakage detected in Rolling_Max_7!"

    # Next day (day 42): Lag_1 must reflect the shock (200.0), and Rolling_Mean_3 must be 200/3
    next_row = df_feat[df_feat['Date'] == dates[spike_idx + 1]].iloc[0]
    assert next_row['Lag_1'] == 200.0
    assert pytest.approx(next_row['Rolling_Mean_3'], 0.01) == 200.0 / 3.0


def test_all_regions_encoded():
    df_feat = pd.read_parquet('data/processed/features_matrix.parquet')
    expected_regions = ['BARELI', 'BEGUMGANJ', 'BERASIA', 'BHOPAL', 'GHAIRATGANJ', 'RAISEN', 'Silvani', 'UDAIPURA']
    for reg in expected_regions:
        assert f'Region_{reg}' in df_feat.columns, f"Region {reg} missing from encoded columns!"

