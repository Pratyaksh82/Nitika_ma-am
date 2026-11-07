"""
Multi-Model Training, Benchmarking & Chronological Validation Suite
Evaluates Ridge, Random Forest, LightGBM, and XGBoost on true forward time-series splits.
"""

import os
import time
import joblib
import numpy as np
import pandas as pd
from sklearn.linear_model import Ridge
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import lightgbm as lgb
import xgboost as xgb


def calculate_nse(y_true: np.ndarray, y_pred: np.ndarray) -> float:
    """
    Nash-Sutcliffe Efficiency (NSE): Standard hydrological metric.
    1.0 = Perfect prediction, 0.0 = Model performs as well as mean of observations, <0 = Unacceptable.
    """
    denominator = np.sum((y_true - np.mean(y_true)) ** 2)
    if denominator == 0:
        return 0.0
    numerator = np.sum((y_true - y_pred) ** 2)
    return float(1.0 - (numerator / denominator))


def load_and_split_data(features_path: str = 'data/processed/features_matrix.parquet'):
    """
    Loads features and performs strict chronological splitting across all regions:
      - Train: <= 2019
      - Validation: 2020 - 2022
      - Test (Holdout): 2023 - 2025
    """
    if not os.path.exists(features_path):
        raise FileNotFoundError(f"{features_path} not found. Run features pipeline first.")

    df = pd.read_parquet(features_path)
    df = df.sort_values(by='Date').reset_index(drop=True)

    # Exclude non-feature columns
    drop_cols = ['Date', 'Rainfall', 'Rainfall_Missing_Flag']
    feature_cols = [c for c in df.columns if c not in drop_cols]

    train_mask = df['Year'] <= 2019
    val_mask = (df['Year'] >= 2020) & (df['Year'] <= 2022)
    test_mask = df['Year'] >= 2023

    X_train, y_train = df.loc[train_mask, feature_cols], df.loc[train_mask, 'Rainfall']
    X_val, y_val = df.loc[val_mask, feature_cols], df.loc[val_mask, 'Rainfall']
    X_test, y_test = df.loc[test_mask, feature_cols], df.loc[test_mask, 'Rainfall']

    print(f"Data Splitting Completed (Chronological Forward Splits):")
    print(f"  • Train Set (1991-2019): {len(X_train):,} samples")
    print(f"  • Val Set   (2020-2022): {len(X_val):,} samples")
    print(f"  • Test Set  (2023-2025): {len(X_test):,} samples")
    print(f"  • Total Feature Count  : {len(feature_cols)} features")

    return (X_train, y_train), (X_val, y_val), (X_test, y_test), feature_cols


def train_and_benchmark(data_path: str = 'data/processed/features_matrix.parquet', models_dir: str = 'models'):
    os.makedirs(models_dir, exist_ok=True)
    (X_train, y_train), (X_val, y_val), (X_test, y_test), feature_cols = load_and_split_data(data_path)

    # Combine Train + Val for final model training after hyperparameter inspection
    X_train_full = pd.concat([X_train, X_val], axis=0)
    y_train_full = pd.concat([y_train, y_val], axis=0)

    candidate_models = {
        'Ridge Regression (Baseline)': Ridge(alpha=1.0, random_state=42),
        'Random Forest Regressor': RandomForestRegressor(
            n_estimators=150,
            max_depth=12,
            min_samples_leaf=4,
            n_jobs=-1,
            random_state=42
        ),
        'LightGBM Regressor': lgb.LGBMRegressor(
            n_estimators=250,
            learning_rate=0.05,
            num_leaves=31,
            max_depth=8,
            random_state=42,
            verbose=-1
        ),
        'XGBoost Regressor (Champion)': xgb.XGBRegressor(
            n_estimators=250,
            learning_rate=0.05,
            max_depth=6,
            subsample=0.85,
            colsample_bytree=0.85,
            reg_alpha=0.1,
            reg_lambda=1.0,
            random_state=42,
            n_jobs=-1
        )
    }

    benchmark_records = []
    trained_instances = {}

    print("\n" + "=" * 70)
    print("BEGINNING MULTI-MODEL BENCHMARKING ON FORWARD TEST SET (2023-2025)")
    print("=" * 70)

    for name, model in candidate_models.items():
        t0 = time.time()
        print(f"\nTraining {name}...")
        model.fit(X_train_full, y_train_full)
        elapsed = time.time() - t0

        y_pred = model.predict(X_test)
        # Rainfall cannot be physically negative
        y_pred = np.clip(y_pred, 0.0, None)

        mae = mean_absolute_error(y_test, y_pred)
        rmse = np.sqrt(mean_squared_error(y_test, y_pred))
        r2 = r2_score(y_test, y_pred)
        nse = calculate_nse(y_test.values, y_pred)

        print(f"  -> Training Time: {elapsed:.2f}s")
        print(f"  -> Test MAE     : {mae:.4f} mm")
        print(f"  -> Test RMSE    : {rmse:.4f} mm")
        print(f"  -> Test R²      : {r2:.4f}")
        print(f"  -> Test NSE     : {nse:.4f}")

        benchmark_records.append({
            'Model': name,
            'Train_Time_s': round(elapsed, 2),
            'Test_MAE_mm': round(mae, 4),
            'Test_RMSE_mm': round(rmse, 4),
            'Test_R2': round(r2, 4),
            'Test_NSE': round(nse, 4)
        })
        trained_instances[name] = model

    results_df = pd.DataFrame(benchmark_records).sort_values(by='Test_R2', ascending=False)
    print("\n" + "=" * 70)
    print("FINAL BENCHMARK COMPARISON TABLE")
    print("=" * 70)
    print(results_df.to_string(index=False))

    # Persist the Best Model & Metadata
    best_model_name = results_df.iloc[0]['Model']
    best_model = trained_instances[best_model_name]

    model_artifact = {
        'model_name': best_model_name,
        'model': best_model,
        'feature_names': feature_cols,
        'benchmark_results': results_df.to_dict(orient='records'),
        'trained_date': time.strftime("%Y-%m-%d %H:%M:%S")
    }

    save_path = os.path.join(models_dir, 'best_rainfall_model.joblib')
    joblib.dump(model_artifact, save_path)
    print(f"\n[OK] Saved champion model ({best_model_name}) to: {save_path}")

    # Also persist XGBoost specifically for TreeSHAP local waterfall & fast GPU/CPU explainer
    xgb_artifact = {
        'model_name': 'XGBoost Regressor (Champion)',
        'model': trained_instances['XGBoost Regressor (Champion)'],
        'feature_names': feature_cols,
        'benchmark_results': results_df.to_dict(orient='records'),
        'trained_date': time.strftime("%Y-%m-%d %H:%M:%S")
    }
    xgb_path = os.path.join(models_dir, 'xgboost_model.joblib')
    joblib.dump(xgb_artifact, xgb_path)
    print(f"[OK] Saved XGBoost model for TreeSHAP to: {xgb_path}")

    # Also save comparison table to CSV
    results_csv = os.path.join('outputs', 'benchmark_metrics.csv')
    os.makedirs('outputs', exist_ok=True)
    results_df.to_csv(results_csv, index=False)
    print(f"[OK] Saved metrics table to: {results_csv}")

    return model_artifact, results_df


if __name__ == '__main__':
    train_and_benchmark()
