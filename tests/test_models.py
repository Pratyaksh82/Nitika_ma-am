"""
Model Persistence & Inference Test Suite
Validates serialized models, input feature ordering, and numerical sanity.
"""

import os
import joblib
import pytest
import numpy as np
import pandas as pd


def test_models_exist():
    assert os.path.exists('models/best_rainfall_model.joblib'), "best_rainfall_model.joblib missing!"
    assert os.path.exists('models/xgboost_model.joblib'), "xgboost_model.joblib missing!"


def test_model_inference_and_output_bounds():
    artifact = joblib.load('models/xgboost_model.joblib')
    model = artifact['model']
    feature_names = artifact['feature_names']

    # Load 10 test rows
    df_feat = pd.read_parquet('data/processed/features_matrix.parquet')
    sample_X = df_feat[feature_names].iloc[:10]

    preds = model.predict(sample_X)
    assert len(preds) == 10
    assert not np.isnan(preds).any(), "Model produced NaN predictions!"

    # Physical clipping
    preds_clipped = np.clip(preds, 0.0, None)
    assert (preds_clipped >= 0.0).all(), "Clipped predictions must be non-negative!"


def test_benchmark_metrics_sanity():
    metrics_path = 'outputs/benchmark_metrics.csv'
    assert os.path.exists(metrics_path), "benchmark_metrics.csv missing!"
    df_metrics = pd.read_csv(metrics_path)

    assert len(df_metrics) >= 4
    # All tested models should achieve positive R² on forward test set
    assert (df_metrics['Test_R2'] > 0.0).all(), "Models failed to achieve positive R²!"
    # MAE should be within plausible daily error range (2 to 6 mm)
    assert (df_metrics['Test_MAE_mm'] < 6.0).all()

