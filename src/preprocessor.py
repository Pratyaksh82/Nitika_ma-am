"""
Meteorological Data Ingestion & Preprocessing Module
Transforms wide-format IMD rainfall tables into verified, clean long-format time series.
"""

import os
import glob
import pandas as pd
import numpy as np


def extract_region_name(filename: str) -> str:
    """Extract and standardize tehsil/region name from filename."""
    base = os.path.basename(filename)
    region = base.split('_')[0]
    region = region.replace("(REV)", "").replace("(ARG)", "").replace("(AWS)", "").strip()
    region = region.replace("SALWANI(SILVANI)", "Silvani")
    return region


def load_and_preprocess_raw_data(raw_dir: str = 'data/raw') -> pd.DataFrame:
    """
    Reads all raw IMD CSV files, transforms from wide to long format,
    standardizes dates, and handles missing observations with domain integrity.
    """
    csv_files = glob.glob(os.path.join(raw_dir, '*.csv'))
    if not csv_files:
        raise FileNotFoundError(f"No CSV files found in {raw_dir}. Run data_generator.py first.")

    print(f"Discovered {len(csv_files)} CSV files in {raw_dir}")
    melted_frames = []

    for fpath in csv_files:
        region = extract_region_name(fpath)
        try:
            # Skip first 2 metadata rows as per IMD standard
            df_wide = pd.read_csv(fpath, skiprows=2, on_bad_lines='skip')
            # Drop unnamed trailing columns
            df_wide = df_wide.loc[:, ~df_wide.columns.str.contains('Unnamed', case=False)]
            df_wide['Region'] = region

            # Melt DRF01-DRF31 into rows
            id_cols = ['YEAR', 'MONTH', 'Region']
            day_cols = [c for c in df_wide.columns if c.startswith('DRF')]

            df_melt = df_wide.melt(
                id_vars=id_cols,
                value_vars=day_cols,
                var_name='Day_Col',
                value_name='Rainfall'
            )

            # Extract day number
            df_melt['Day'] = df_melt['Day_Col'].str.extract(r'(\d+)').astype(int)
            melted_frames.append(df_melt)
            print(f"  [+] Loaded & transformed {os.path.basename(fpath)} -> Region: {region}")
        except Exception as e:
            print(f"  [-] Error loading {fpath}: {e}")

    df_combined = pd.concat(melted_frames, ignore_index=True)

    # Convert to standard timestamp; invalid dates (e.g. Feb 31) become NaT
    df_combined['Date'] = pd.to_datetime(
        df_combined[['YEAR', 'MONTH', 'Day']],
        errors='coerce'
    )

    # Remove calendar-impossible dates
    initial_count = len(df_combined)
    df_clean = df_combined.dropna(subset=['Date']).copy()
    dropped_invalid_dates = initial_count - len(df_clean)
    print(f"\nDropped {dropped_invalid_dates} invalid calendar day slots (e.g., Feb 30/31, Apr 31).")

    # Missing rainfall handling
    missing_mask = df_clean['Rainfall'].isna()
    missing_count = missing_mask.sum()
    print(f"Identified {missing_count} missing rainfall records ({missing_count / len(df_clean):.2%}).")

    # Add missing indicator feature to preserve information
    df_clean['Rainfall_Missing_Flag'] = missing_mask.astype(int)

    # Clean ordering: Sort strictly by Date then Region
    df_clean = df_clean.sort_values(by=['Date', 'Region']).reset_index(drop=True)

    # Fill missing values per region: forward-fill short gaps up to 2 days, remainder filled with 0.0
    df_clean['Rainfall'] = df_clean.groupby('Region')['Rainfall'].transform(
        lambda s: s.ffill(limit=2).fillna(0.0)
    )

    # Standardize types and column layout
    df_final = df_clean[['Date', 'Region', 'Rainfall', 'Rainfall_Missing_Flag']].copy()
    df_final['Rainfall'] = df_final['Rainfall'].astype(float)

    print(f"[OK] Preprocessing complete. Final long-format shape: {df_final.shape}")
    print(f"     Date range: {df_final['Date'].min().date()} to {df_final['Date'].max().date()}")
    print(f"     Regions: {sorted(df_final['Region'].unique().tolist())}")
    print(f"     Mean daily rainfall: {df_final['Rainfall'].mean():.2f} mm | Max: {df_final['Rainfall'].max():.1f} mm")

    return df_final


def run_pipeline(raw_dir='data/raw', out_dir='data/processed'):
    os.makedirs(out_dir, exist_ok=True)
    df = load_and_preprocess_raw_data(raw_dir)

    parquet_path = os.path.join(out_dir, 'rainfall_clean.parquet')
    csv_path = os.path.join(out_dir, 'rainfall_clean.csv')

    df.to_parquet(parquet_path, index=False)
    df.to_csv(csv_path, index=False)
    print(f"\nSaved processed data to:\n  - {parquet_path}\n  - {csv_path}")
    return df


if __name__ == '__main__':
    run_pipeline()

