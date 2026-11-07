"""
TreeSHAP Explainability Test Suite
Tests exact local accuracy, base value extraction, and explanation generation.
"""

import os
import joblib
import pytest
import numpy as np
import pandas as pd
import shap
from src.xai import explain_instance


def test_xai_plots_generated():
    expected_plots = [
        'outputs/shap_summary_beeswarm.png',
        'outputs/shap_feature_importance.png',
        'outputs/shap_waterfall_sample.png',
        'outputs/shap_pdp_rolling7.png'
    ]
    for p in expected_plots:
        assert os.path.exists(p), f"XAI plot missing: {p}"
        assert os.path.getsize(p) > 10000, f"XAI plot file suspiciously small: {p}"


def test_single_instance_explanation_additivity():
    artifact = joblib.load('models/xgboost_model.joblib')
    model = artifact['model']
    feature_names = artifact['feature_names']
    explainer = shap.TreeExplainer(model)

    df_feat = pd.read_parquet('data/processed/features_matrix.parquet')
    sample_row = df_feat.iloc[100]

    base_val, pred_val, contributions = explain_instance(model, explainer, sample_row, feature_names)

    sum_shap = sum(c['shap_value_mm'] for c in contributions)
    reconstructed = base_val + sum_shap

    # TreeSHAP exact additivity axiom check
    assert abs(reconstructed - pred_val) < 1e-4, f"Additivity error: {abs(reconstructed - pred_val)}"
    assert len(contributions) == len(feature_names)

