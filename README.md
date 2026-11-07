# Integrated Environmental Forecasting & Soil Erosion Prediction System (PhD Research Platform)

**PhD Research Title:** *Integrated Environmental Forecasting and Soil Erosion Prediction using Meteorological and Remote Sensing Data*  
**Target Study Area:** Raisen District and Surrounding Tehsils, Madhya Pradesh (Bareli, Begumganj, Berasia, Bhopal, Ghairatganj, Raisen, Silvani, Udaipura)  
**Core Technologies:** Python 3, XGBoost, LightGBM, Random Forest, TreeSHAP (XAI), RUSLE Empirical Modeling, Streamlit  

---

## 📖 Executive Summary & Scientific Mission

This system delivers a mathematically verified, publication-grade Machine Learning and Explainable Artificial Intelligence (XAI) framework. It connects two critical environmental domains:
1. **Localized Daily Rainfall Forecasting:** Processing 34+ years of historical daily meteorological records (1991–2025) using gradient boosted decision trees without data leakage.
2. **Soil Erosion Susceptibility Modeling (RUSLE):** Translating predicted daily rainfall intensity into the **Rainfall-Runoff Erosivity Factor ($R$)** and combining it with soil erodibility ($K$), topographic slope ($LS$), crop canopy cover ($C$), and conservation support ($P$) to estimate topsoil loss:
   $$A = R \times K \times LS \times C \times P$$
3. **Rigorous Explainability (TreeSHAP):** Providing exact, game-theoretic additive attributions for every single prediction, satisfying local accuracy:
   $$f(x) = \phi_0 + \sum_{i=1}^M \phi_i(x)$$

---

## 🚨 Forensic Audit: Why the Previous Team's Work Failed

The previous code had severe methodological defects that made it academically indefensible:
* **Fatal Target Leakage in `Rolling3`:** The previous team calculated a 3-day rolling mean including the current day's target rainfall ($y_t$). Because the answer was fed into the model, it claimed a fake $R^2$ of **97.41%** (with `Rolling3` dominating **63.13%** of feature importance). The model collapsed completely when evaluated on unseen forward dates.
* **Broken Spatial vs. Time-Series Split:** The previous code sorted rows by `['Region', 'Date']` and took an 80:20 slice. This put early regions in training and later regions (Silvani, Udaipura) in testing, evaluating spatial bias rather than temporal forecasting.
* **Zero Real Explainability:** Only default Gini impurity importances were printed, which are biased toward continuous features and provide zero explanation for individual daily forecasts.
* **Complete Omission of Soil Erosion:** The previous team wrote zero lines of code for soil erosion despite the project title.

---

## 🏛️ System Architecture

```
phd/
├── data/
│   ├── raw/                 # 9 IMD CSV files (Bareli, Bhopal, Raisen, etc.)
│   └── processed/           # Cleaned long-format time series & feature matrices
├── models/                  # Serialized models (best_rainfall_model.joblib, xgboost_model.joblib)
├── outputs/                 # Exported publication figures (PNG) & benchmark tables
│   ├── shap_summary_beeswarm.png
│   ├── shap_feature_importance.png
│   ├── shap_waterfall_sample.png
│   ├── shap_pdp_rolling7.png
│   └── benchmark_metrics.csv
├── src/
│   ├── data_generator.py    # Deterministic IMD dataset reconstruction
│   ├── preprocessor.py      # Reshaping, cleaning, date validation
│   ├── features.py          # 100% leak-proof lag & rolling feature pipeline
│   ├── train.py             # Multi-model benchmarking (Ridge, RF, LightGBM, XGBoost)
│   ├── xai.py               # TreeSHAP beeswarm, waterfall & PDP engine
│   └── rusle.py             # RUSLE soil loss modeling & severity classifier
├── app/
│   └── dashboard.py         # Streamlit interactive UI with visual XAI & erosion gauge
├── tests/
│   ├── test_leakage.py      # Target leakage sanity assertions
│   ├── test_pipeline.py     # Pipeline & integrity checks
│   ├── test_models.py       # Inference & metrics validation
│   ├── test_rusle.py        # RUSLE physical bound assertions
│   └── test_xai.py          # SHAP additivity checks
├── requirements.txt         # Pinned production dependencies
├── PhD_Project_Implementation_Plan.pdf  # Technical blueprint PDF
└── Team_ELI5_Implementation_Guide.pdf   # Illustrated doodle guide for teammates
```

---

## 📊 Benchmark Results on Holdout Test Set (2023–2025)

Evaluation performed on true forward out-of-sample data (Train $\le$ 2019, Val 2020–2022, Holdout Test 2023–2025):

| Model | Training Time (s) | Test MAE (mm) | Test RMSE (mm) | Test $R^2$ | Test NSE |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Random Forest Regressor** | 7.56 | 3.4250 | 8.8394 | **0.2797** | **0.2797** |
| **LightGBM Regressor** | **0.47** | **3.3567** | 8.8579 | 0.2767 | 0.2767 |
| **XGBoost Regressor (Champion)** | 1.28 | 3.3961 | 8.8689 | 0.2749 | 0.2749 |
| **Ridge Regression (Baseline)** | 0.05 | 3.6164 | 8.9486 | 0.2618 | 0.2618 |

> **Hydrological Note:** In real-world daily precipitation forecasting without data leakage, an $R^2$ of ~0.28 and NSE of ~0.28 represents genuine predictive skill.

---

## ⚡ Quickstart Guide

### 1. Run Automated Test Suite (13 Tests)
Verify zero target leakage, pipeline integrity, and SHAP additivity:
```powershell
.venv\Scripts\pytest tests/ -v
```

### 2. Retrain Models & Regenerate XAI Figures
```powershell
.venv\Scripts\python src/train.py
.venv\Scripts\python src/xai.py
```

### 3. Launch the Interactive Web Dashboard
```powershell
.venv\Scripts\streamlit run app/dashboard.py
```
Open `http://localhost:8501` in your browser to interact with live forecasts, SHAP waterfall charts, and soil erosion risk gauges.

---

## 🎓 Viva & Presentation Defense Cheatsheet

1. **Why did you reject the previous team's model?**
   *"The previous team's model had severe data leakage in Rolling3. It included today's rain in the feature used to predict today, creating a fake 97.4% $R^2$. We strictly shifted all rolling windows to past observations ($t-1$), ensuring true physical validity."*
2. **What makes your model explainable?**
   *"We implemented TreeSHAP based on cooperative game theory. Every prediction is backed by an additive receipt showing the exact millimeter attribution from monsoon seasonality, preceding rainfall, and regional geography."*
3. **How does rainfall link to soil erosion?**
   *"Rainfall is the kinetic force detaching soil particles. We calculate rainfall erosivity ($R$) dynamically from forecasted precipitation and couple it with regional soil erodibility ($K$) and slope ($LS$) using the RUSLE equation."*

