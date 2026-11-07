"""
Explainable AI (XAI) Engine via TreeSHAP
Generates global feature attributions, local single-prediction waterfall breakdowns, and partial dependence curves.
"""

import os
import joblib
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import shap


def load_model_and_data(model_path='models/xgboost_model.joblib', features_path='data/processed/features_matrix.parquet'):
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"{model_path} not found. Run train.py first.")
    
    artifact = joblib.load(model_path)
    model = artifact['model']
    feature_names = artifact['feature_names']

    df = pd.read_parquet(features_path)
    # Use holdout test set (2023-2025) for XAI evaluation
    test_df = df[df['Year'] >= 2023].reset_index(drop=True)
    X_test = test_df[feature_names]
    y_test = test_df['Rainfall']

    return model, X_test, y_test, test_df, feature_names


def run_xai_pipeline(output_dir='outputs', sample_size=1000):
    os.makedirs(output_dir, exist_ok=True)
    model, X_test, y_test, test_df, feature_names = load_model_and_data()

    print(f"\n[XAI] Initializing TreeSHAP Explainer for {type(model).__name__}...")
    explainer = shap.TreeExplainer(model)

    # Sample for manageable computation and clean visualization
    sample_indices = np.random.RandomState(42).choice(len(X_test), size=min(sample_size, len(X_test)), replace=False)
    X_sample = X_test.iloc[sample_indices]

    print(f"[XAI] Computing exact Shapley values on {len(X_sample)} holdout samples...")
    shap_explanation = explainer(X_sample)
    shap_values = shap_explanation.values

    # 1. Global Summary Beeswarm Plot
    print("[XAI] Generating Global SHAP Beeswarm Plot...")
    plt.figure(figsize=(10, 8), dpi=200)
    shap.summary_plot(shap_values, X_sample, feature_names=feature_names, show=False, max_display=12)
    plt.title("TreeSHAP Global Feature Impact (Monsoon & Rainfall Forecasting)", fontsize=13, weight='bold', pad=14)
    plt.tight_layout()
    beeswarm_path = os.path.join(output_dir, 'shap_summary_beeswarm.png')
    plt.savefig(beeswarm_path)
    plt.close()
    print(f"  -> Saved {beeswarm_path}")

    # 2. Mean Absolute SHAP Bar Plot (Global Importance)
    print("[XAI] Generating Global Mean Absolute SHAP Bar Plot...")
    plt.figure(figsize=(10, 6), dpi=200)
    shap.summary_plot(shap_values, X_sample, feature_names=feature_names, plot_type="bar", show=False, max_display=12)
    plt.title("Mean Absolute Feature Attribution (|SHAP Value| in mm)", fontsize=13, weight='bold', pad=14)
    plt.tight_layout()
    bar_path = os.path.join(output_dir, 'shap_feature_importance.png')
    plt.savefig(bar_path)
    plt.close()
    print(f"  -> Saved {bar_path}")

    # 3. Local Single-Prediction Waterfall Plot
    # Find a significant rainy day in the sample to illustrate strong attribution
    wet_day_candidates = np.where(y_test.iloc[sample_indices] > 15.0)[0]
    sample_idx = wet_day_candidates[0] if len(wet_day_candidates) > 0 else 0

    print(f"[XAI] Generating Local Waterfall Plot for Sample #{sample_idx} (Actual Rain: {y_test.iloc[sample_indices[sample_idx]]:.1f} mm)...")
    plt.figure(figsize=(10, 6), dpi=200)
    shap.plots.waterfall(shap_explanation[sample_idx], max_display=10, show=False)
    plt.title("Local Prediction Explanation (TreeSHAP Additive Waterfall)", fontsize=12, weight='bold', pad=14)
    plt.tight_layout()
    waterfall_path = os.path.join(output_dir, 'shap_waterfall_sample.png')
    plt.savefig(waterfall_path)
    plt.close()
    print(f"  -> Saved {waterfall_path}")

    # 4. Partial Dependence Curve (PDP) for Rolling_Mean_7
    print("[XAI] Generating Partial Dependence Plot for Rolling_Mean_7...")
    plt.figure(figsize=(9, 5), dpi=200)
    shap.plots.scatter(shap_explanation[:, "Rolling_Mean_7"], color=shap_explanation[:, "is_monsoon"], show=False)
    plt.title("SHAP Partial Dependence: 7-Day Rolling Rainfall Effect vs. Monsoon State", fontsize=11, weight='bold', pad=12)
    plt.tight_layout()
    pdp_path = os.path.join(output_dir, 'shap_pdp_rolling7.png')
    plt.savefig(pdp_path)
    plt.close()
    print(f"  -> Saved {pdp_path}")

    # Verify Additivity Sanity Check: sum(SHAP) + base_value == model_prediction
    base_val = shap_explanation[sample_idx].base_values
    sum_shap = np.sum(shap_explanation[sample_idx].values)
    pred_val = model.predict(X_sample.iloc[[sample_idx]])[0]
    error = abs((base_val + sum_shap) - pred_val)

    print("\n" + "=" * 65)
    print("TREESHAP MATHEMATICAL ADDITIVITY VERIFICATION")
    print("=" * 65)
    print(f"  • Base Value E[f(x)]       : {base_val:.4f} mm")
    print(f"  • Sum of Shapley Values Σφi : {sum_shap:.4f} mm")
    print(f"  • Reconstructed Prediction : {base_val + sum_shap:.4f} mm")
    print(f"  • Raw Model Output f(x)    : {pred_val:.4f} mm")
    print(f"  • Absolute Additivity Error: {error:.2e} mm")
    assert error < 1e-4, f"SHAP additivity violated! Error = {error}"
    print("[PASS] TreeSHAP satisfies Local Accuracy (Efficiency Axiom) perfectly!")

    return explainer, shap_explanation


def explain_instance(model, explainer, feature_row: pd.Series, feature_names: list):
    """
    Utility function for the dashboard to explain any single user query.
    Returns: base_value, predicted_value, and sorted dictionary of feature impacts.
    """
    # Force float dtype so XGBoost DMatrix receives strict numeric types, avoiding object dtype
    row_df = pd.DataFrame([feature_row[feature_names].to_dict()], columns=feature_names).astype(float)
    exp = explainer(row_df)
    base_val = float(exp.base_values[0])
    shap_vals = exp.values[0]
    pred_val = float(model.predict(row_df)[0])

    contributions = []
    for fname, sval, fval in zip(feature_names, shap_vals, row_df.iloc[0]):
        contributions.append({
            'feature': fname,
            'shap_value_mm': float(sval),
            'feature_value': float(fval),
            'impact': 'Increases Rain' if sval > 0 else 'Decreases Rain'
        })

    contributions.sort(key=lambda x: abs(x['shap_value_mm']), reverse=True)
    return base_val, pred_val, contributions


if __name__ == '__main__':
    run_xai_pipeline()

