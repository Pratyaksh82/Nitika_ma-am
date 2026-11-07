"""
Dataset Pipeline & Integrity Test Suite
Verifies raw CSV parsing, missing-value handling, and long-format schema consistency.
"""

import os
import glob
import pytest
import pandas as pd
from src.preprocessor import extract_region_name


def test_raw_csv_files_exist():
    raw_files = glob.glob('data/raw/*.csv')
    assert len(raw_files) == 9, f"Expected 9 IMD CSV files, found {len(raw_files)}"


def test_region_name_extraction():
    test_cases = {
        'BARELI (REV)_RAINFALL_DAILY_NDCQ-2025-12-175.csv': 'BARELI',
        'BHOPAL (ARG)_RAINFALL_DAILY_NDCQ-2025-11-257.csv': 'BHOPAL',
        'SALWANI(SILVANI) (REV)_RAINFALL_DAILY_NDCQ-2025-12-175.csv': 'Silvani',
        'RAISEN (AWS)_RAINFALL_DAILY_NDCQ-2025-12-175.csv': 'RAISEN'
    }
    for filename, expected in test_cases.items():
        assert extract_region_name(filename) == expected


def test_processed_dataset_integrity():
    parquet_path = 'data/processed/rainfall_clean.parquet'
    assert os.path.exists(parquet_path), "rainfall_clean.parquet does not exist!"
    df = pd.read_parquet(parquet_path)

    # Required columns
    assert 'Date' in df.columns
    assert 'Region' in df.columns
    assert 'Rainfall' in df.columns
    assert 'Rainfall_Missing_Flag' in df.columns

    # No remaining nulls in Rainfall
    assert df['Rainfall'].isna().sum() == 0, "Null values remain in processed Rainfall!"

    # Physical bounds check
    assert (df['Rainfall'] >= 0.0).all(), "Negative rainfall values detected!"
    assert (df['Rainfall'] <= 350.0).all(), "Unrealistic rainfall spike (>350 mm) detected!"

    # 8 unique regions
    assert df['Region'].nunique() == 8, f"Expected 8 unique regions, found {df['Region'].nunique()}"

