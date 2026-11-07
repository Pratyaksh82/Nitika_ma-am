"""
Leak-Proof Feature Engineering Pipeline
Builds shifted temporal lags, rolling statistics, and cyclical harmonics with ZERO target leakage.
"""

import os
import numpy as np
import pandas as pd


def build_feature_matrix(df_clean: pd.DataFrame) -> pd.DataFrame:
    """
    Constructs leak-proof time-series features strictly conditioned on past data (t-1, t-2, ...).
    """
    df = df_clean.copy()
    df = df.sort_values(by=['Region', 'Date']).reset_index(drop=True)

    # 1. Calendar & Cyclical Harmonic Features
    df['Year'] = df['Date'].dt.year
    df['Month'] = df['Date'].dt.month
    df['Day'] = df['Date'].dt.day
    df['DayOfYear'] = df['Date'].dt.day_of_year
    df['WeekOfYear'] = df['Date'].dt.isocalendar().week.astype(int)

    # Orthogonal trigonometric calendar signals
    df['Month_sin'] = np.sin(2 * np.pi * df['Month'] / 12.0)
    df['Month_cos'] = np.cos(2 * np.pi * df['Month'] / 12.0)
    df['DOY_sin'] = np.sin(2 * np.pi * df['DayOfYear'] / 365.25)
    df['DOY_cos'] = np.cos(2 * np.pi * df['DayOfYear'] / 365.25)

    # Seasonal indicators
    df['is_monsoon'] = df['Month'].isin([6, 7, 8, 9]).astype(int)
    df['is_pre_monsoon'] = (df['Month'] == 5).astype(int)
    df['is_post_monsoon'] = (df['Month'] == 10).astype(int)

    # 2. Shifted Lag Features (Strictly t-1, t-2, etc.)
    for lag in [1, 2, 3, 7, 14, 30]:
        df[f'Lag_{lag}'] = df.groupby('Region')['Rainfall'].shift(lag)

    # 3. Shifted Rolling Windows (ZERO TARGET LEAKAGE)
    # Applying .shift(1) BEFORE .rolling() guarantees that day t's rainfall is never visible!
    for window in [3, 7, 14, 30]:
        df[f'Rolling_Mean_{window}'] = df.groupby('Region')['Rainfall'].transform(
            lambda s: s.shift(1).rolling(window=window, min_periods=1).mean()
        )

    for window in [7, 14]:
        df[f'Rolling_Std_{window}'] = df.groupby('Region')['Rainfall'].transform(
            lambda s: s.shift(1).rolling(window=window, min_periods=1).std().fillna(0.0)
        )
        df[f'Rolling_Max_{window}'] = df.groupby('Region')['Rainfall'].transform(
            lambda s: s.shift(1).rolling(window=window, min_periods=1).max()
        )

    # 4. Regional One-Hot Encoding
    df_encoded = pd.get_dummies(df, columns=['Region'], prefix='Region', dtype=int)

    # Drop earliest rows where initial 30-day lag is undefined
    initial_len = len(df_encoded)
    df_ready = df_encoded.dropna().reset_index(drop=True)
    dropped = initial_len - len(df_ready)
    print(f"Constructed feature matrix. Dropped {dropped} initial burn-in rows for 30-day lag initialization.")
    print(f"Final feature matrix shape: {df_ready.shape}")
    return df_ready


def run_feature_pipeline(clean_path='data/processed/rainfall_clean.parquet', out_dir='data/processed'):
    os.makedirs(out_dir, exist_ok=True)
    if not os.path.exists(clean_path):
        raise FileNotFoundError(f"{clean_path} does not exist. Run preprocessor first.")

    df_clean = pd.read_parquet(clean_path)
    df_features = build_feature_matrix(df_clean)

    out_parquet = os.path.join(out_dir, 'features_matrix.parquet')
    out_csv = os.path.join(out_dir, 'features_matrix.csv')

    df_features.to_parquet(out_parquet, index=False)
    # Save preview sample CSV to prevent gigantic file overhead
    df_features.head(1000).to_csv(os.path.join(out_dir, 'features_matrix_sample.csv'), index=False)

    print(f"[OK] Feature matrix saved to:\n  - {out_parquet}\n  - Sample: {out_dir}/features_matrix_sample.csv")
    return df_features


if __name__ == '__main__':
    run_feature_pipeline()
