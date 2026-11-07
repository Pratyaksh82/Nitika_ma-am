@echo off
title PhD Environmental Forecasting & Soil Erosion System
echo ======================================================================
echo Launching PhD Environmental Forecasting & Soil Erosion System...
echo ======================================================================
cd /d "%~dp0"
call .venv\Scripts\activate.bat
echo Starting Streamlit Web App...
streamlit run app\dashboard.py
pause

