/**
 * EcoVision AI • Publication-Grade Multi-Page Presentation Manual PDF Compiler
 * Fully Updated with Date Change Engine, Atmospheric Profile Shocks, Scroll Architecture,
 * Hinglish Doodle Notes, and Complete Video Walkthrough Index.
 */

const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const OUTPUT_DIR = path.resolve('outputs');
const OUTPUT_PDF = path.join(OUTPUT_DIR, 'EcoVision_AI_Website_and_Feature_Guide.pdf');
const ROOT_PDF = path.resolve('EcoVision_AI_Website_and_Feature_Guide.pdf');

function getBase64Image(filename) {
  const filePath = path.join(OUTPUT_DIR, filename);
  if (fs.existsSync(filePath)) {
    return `data:image/png;base64,${fs.readFileSync(filePath).toString('base64')}`;
  }
  return '';
}

const b64HeaderBento = getBase64Image('screen_header_bento.png');
const b64Tab1Spatial = getBase64Image('screen_tab1_spatial.png');
const b64Tab2Trajectory = getBase64Image('screen_tab2_trajectory.png');
const b64Tab3TreeSHAP = getBase64Image('screen_tab3_treeshap.png');
const b64Tab4Rusle = getBase64Image('screen_tab4_rusle.png');
const b64ShapBeeswarm = getBase64Image('shap_summary_beeswarm.png');

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>EcoVision AI • Website & Feature Presentation Manual with Hinglish Doodle Notes</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=JetBrains+Mono:wght@400;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: #030712;
      color: #f1f5f9;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 210mm;
      height: 297mm;
      padding: 10mm 13mm 9mm 13mm;
      page-break-after: always;
      position: relative;
      background: #060911 radial-gradient(rgba(139, 92, 246, 0.05) 1px, transparent 1px);
      background-size: 20px 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .page:last-child {
      page-break-after: avoid;
    }

    /* Header & Footer */
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 5px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      font-size: 7.8pt;
      color: #94a3b8;
    }
    .doc-header .brand {
      display: flex;
      align-items: center;
      gap: 6px;
      font-weight: 700;
      color: #38bdf8;
      letter-spacing: 0.5px;
    }
    .doc-header .badge {
      background: rgba(14, 165, 233, 0.15);
      color: #38bdf8;
      border: 1px solid rgba(14, 165, 233, 0.35);
      padding: 2px 7px;
      border-radius: 999px;
      font-size: 6.5pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .doc-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 5px;
      border-top: 1px solid rgba(148, 163, 184, 0.15);
      font-size: 7pt;
      color: #64748b;
    }
    .doc-footer a {
      color: #38bdf8;
      text-decoration: none;
    }

    /* Content Area */
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding-top: 6px;
      gap: 7px;
    }

    /* Typography */
    h1 {
      font-size: 16pt;
      font-weight: 800;
      line-height: 1.15;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    h2 {
      font-size: 11pt;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.2px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    h3 {
      font-size: 8.5pt;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    p {
      font-size: 7.8pt;
      line-height: 1.38;
      color: #cbd5e1;
    }

    /* Cards & Containers */
    .card {
      background: rgba(15, 23, 42, 0.82);
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 8px;
      padding: 7px 10px;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
    }
    .card-glow {
      border: 1px solid rgba(56, 189, 248, 0.35);
      background: linear-gradient(180deg, rgba(14, 165, 233, 0.08) 0%, rgba(15, 23, 42, 0.85) 100%);
    }

    /* DOODLE & STICKY NOTE STYLES */
    .sticky-note {
      background: #fef08a;
      color: #422006;
      padding: 6px 10px;
      border-radius: 5px;
      box-shadow: 2px 4px 10px rgba(0,0,0,0.3);
      border-left: 5px solid #eab308;
      transform: rotate(-0.5deg);
      font-size: 7.5pt;
      line-height: 1.35;
    }
    .sticky-note strong {
      color: #713f12;
      font-size: 8pt;
    }
    .sticky-note-cyan {
      background: #cffafe;
      color: #164e63;
      padding: 6px 10px;
      border-radius: 5px;
      box-shadow: 2px 4px 10px rgba(0,0,0,0.3);
      border-left: 5px solid #06b6d4;
      transform: rotate(0.5deg);
      font-size: 7.5pt;
      line-height: 1.35;
    }
    .sticky-note-cyan strong {
      color: #155e75;
      font-size: 8pt;
    }
    .sticky-note-pink {
      background: #fce7f3;
      color: #831843;
      padding: 6px 10px;
      border-radius: 5px;
      box-shadow: 2px 4px 10px rgba(0,0,0,0.3);
      border-left: 5px solid #ec4899;
      transform: rotate(-0.4deg);
      font-size: 7.5pt;
      line-height: 1.35;
    }
    .sticky-note-pink strong {
      color: #9d174d;
      font-size: 8pt;
    }

    .doodle-box {
      border: 1.8px dashed rgba(245, 158, 11, 0.75);
      border-radius: 7px;
      padding: 6px 10px;
      background: rgba(245, 158, 11, 0.06);
    }
    .doodle-box-cyan {
      border: 1.8px dashed rgba(6, 182, 212, 0.75);
      border-radius: 7px;
      padding: 6px 10px;
      background: rgba(6, 182, 212, 0.06);
    }
    .doodle-box-green {
      border: 1.8px dashed rgba(16, 185, 129, 0.75);
      border-radius: 7px;
      padding: 6px 10px;
      background: rgba(16, 185, 129, 0.06);
    }
    .doodle-title {
      font-size: 7.8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 3px;
    }
    .doodle-tag {
      font-family: 'Caveat', cursive;
      font-size: 10.5pt;
      font-weight: 700;
      color: #f59e0b;
      margin-left: 4px;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 7px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 5px;
    }

    /* Screenshot Container */
    .screenshot-frame {
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid rgba(56, 189, 248, 0.3);
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
      background: #090d16;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .screenshot-frame img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
    }

    /* Numbered Callout Badges */
    .badge-num {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 15px;
      height: 15px;
      border-radius: 50%;
      background: #0284c7;
      color: #ffffff;
      font-size: 6.8pt;
      font-weight: 700;
      margin-right: 4px;
      flex-shrink: 0;
    }
    .tag {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 6.2pt;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tag-cyan { background: rgba(6, 182, 212, 0.2); color: #67e8f9; border: 1px solid rgba(6, 182, 212, 0.4); }
    .tag-emerald { background: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.4); }
    .tag-amber { background: rgba(245, 158, 11, 0.2); color: #fde68a; border: 1px solid rgba(245, 158, 11, 0.4); }
    .tag-rose { background: rgba(244, 63, 94, 0.2); color: #fda4af; border: 1px solid rgba(244, 63, 94, 0.4); }
    .tag-violet { background: rgba(139, 92, 246, 0.2); color: #c4b5fd; border: 1px solid rgba(139, 92, 246, 0.4); }

    /* Tables */
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 7pt;
    }
    th {
      background: rgba(30, 41, 59, 0.85);
      color: #94a3b8;
      font-weight: 700;
      text-align: left;
      padding: 3px 6px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.25);
      text-transform: uppercase;
      font-size: 6.2pt;
      letter-spacing: 0.5px;
    }
    td {
      padding: 3px 6px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.12);
      color: #e2e8f0;
      vertical-align: top;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .code-span {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.5pt;
      background: rgba(15, 23, 42, 0.7);
      color: #38bdf8;
      padding: 1px 3px;
      border-radius: 3px;
    }
  </style>
</head>
<body>

  <!-- ================= PAGE 1: TITLE & HINGLISH OVERVIEW ================= -->
  <div class="page">
    <div class="doc-header">
      <div class="brand">
        <span>🌐</span> EcoVision AI • Integrated Environmental Research
      </div>
      <div class="badge">PhD Dissertation System • Cloud Edition</div>
    </div>

    <div class="content">
      <!-- Title Hero -->
      <div class="card card-glow" style="padding: 10px 13px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="display: flex; gap: 5px; margin-bottom: 3px;">
              <span class="tag tag-cyan">Live Production Web App</span>
              <span class="tag tag-emerald">Render Web Service</span>
              <span class="tag tag-violet">Explainable AI (TreeSHAP)</span>
            </div>
            <h1>EcoVision AI: Integrated Watershed & Soil Erosion Command Center</h1>
            <p style="font-size: 8.5pt; color: #94a3b8; margin-top: 2px;">
              Multi-Day Predictive Meteorological Forecasting, Game-Theoretic TreeSHAP Attribution, and RUSLE Physical Erosion Risk Triage
            </p>
          </div>
          <div style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 7pt; color: #64748b;">
            <div>DATE: Nov 2026</div>
            <div style="color: #38bdf8; font-weight: 700; margin-top: 1px;">STATUS: 200 OK</div>
          </div>
        </div>
      </div>

      <!-- Links Badges -->
      <div class="grid-2">
        <div class="card">
          <div style="font-size: 6.5pt; color: #94a3b8; text-transform: uppercase;">🌐 Live Cloud URL</div>
          <div style="font-size: 8pt; font-weight: 700; color: #38bdf8;">https://nitika-ma-am.onrender.com/</div>
          <div style="font-size: 6.2pt; color: #10b981; margin-top: 1px;">● Deployed on Render • Live & Accessible Online</div>
        </div>
        <div class="card">
          <div style="font-size: 6.5pt; color: #94a3b8; text-transform: uppercase;">💻 GitHub Source Code</div>
          <div style="font-size: 8pt; font-weight: 700; color: #38bdf8;">https://github.com/Pratyaksh82/Nitika_ma-am</div>
          <div style="font-size: 6.2pt; color: #a855f7; margin-top: 1px;">● Synchronized on branch main (Includes Video & PDF)</div>
        </div>
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note">
        <strong>📝 Bhai Yeh Website Aakhir Karti Kya Hai? (Simple Summary in Hinglish):</strong><br>
        EcoVision AI hamare Raisen aur Bhopal ke 8 tehsils (Raisen, Bhopal, Bareli, Begumganj, Silvani, Gairatganj, Udaipur, Berasia) ke liye ek <strong>Smart Environmental Watchtower</strong> hai. Yeh do bade kaam karti hai:
        <ul style="margin-left: 14px; margin-top: 2px; line-height: 1.3;">
          <li><strong>Pehla (ML Forecast):</strong> Aane wale 7 dino mein kab kitni tez baarish hogi (XGBoost aur Random Forest AI models se).</li>
          <li><strong>Doosra (Soil Loss Physics):</strong> Uss baarish ki wajah se kisaano ke khet ki kitni upjau mitti (topsoil) beh kar barbaad ho jayegi (RUSLE physical formula se).</li>
          <li><strong>Teesra (AI Ka Bill / Receipt):</strong> TreeSHAP se har prediction ka transparent hisaab-kitaab milta hai ki model ne yeh faisla kyun liya!</li>
        </ul>
      </div>

      <!-- 4 Core Pillars Grid -->
      <div class="grid-4">
        <div class="card" style="border-left: 3px solid #38bdf8;">
          <div class="tag tag-cyan" style="margin-bottom: 2px;">Tab 1</div>
          <div style="font-weight: 700; font-size: 7.5pt; color: #f8fafc;">Catchment Radar</div>
          <div style="font-size: 6.8pt; color: #94a3b8; margin-top: 1px;">
            Raisen-Bhopal 3D Map + Glowing Station Pins + Live Table.
          </div>
        </div>
        <div class="card" style="border-left: 3px solid #10b981;">
          <div class="tag tag-emerald" style="margin-bottom: 2px;">Tab 2</div>
          <div style="font-weight: 700; font-size: 7.5pt; color: #f8fafc;">7-Day Trajectory</div>
          <div style="font-size: 6.8pt; color: #94a3b8; margin-top: 1px;">
            Forward forecast curve + What-If Tufaan & Slope Simulator.
          </div>
        </div>
        <div class="card" style="border-left: 3px solid #a855f7;">
          <div class="tag tag-violet" style="margin-bottom: 2px;">Tab 3</div>
          <div style="font-weight: 700; font-size: 7.5pt; color: #f8fafc;">TreeSHAP Receipts</div>
          <div style="font-size: 6.8pt; color: #94a3b8; margin-top: 1px;">
            AI decision ka hisaab (waterfall chart + feature impact).
          </div>
        </div>
        <div class="card" style="border-left: 3px solid #f59e0b;">
          <div class="tag tag-amber" style="margin-bottom: 2px;">Tab 4</div>
          <div style="font-weight: 700; font-size: 7.5pt; color: #f8fafc;">RUSLE Interventions</div>
          <div style="font-size: 6.8pt; color: #94a3b8; margin-top: 1px;">
            Soil loss speed gauge + Kisaan Salah Advisory Bulletin.
          </div>
        </div>
      </div>

      <!-- Architectural Dataflow Box -->
      <div class="doodle-box-cyan">
        <div class="doodle-title" style="color: #38bdf8;">
          ⚙️ End-to-End Pipeline (Data Kaise Flow Hota Hai) <span class="doodle-tag">~ 4-Step Architecture</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: 6.5pt; margin-top: 3px;">
          <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(56, 189, 248, 0.3); padding: 4px 6px; border-radius: 4px; flex: 1; text-align: center;">
            <div style="color: #38bdf8; font-weight: 700;">1. IMD WEATHER DATA</div>
            <div style="font-size: 5.8pt; color: #94a3b8;">1991-2024 Historical Feeds</div>
          </div>
          <div style="color: #38bdf8;">➔</div>
          <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(16, 185, 129, 0.3); padding: 4px 6px; border-radius: 4px; flex: 1; text-align: center;">
            <div style="color: #10b981; font-weight: 700;">2. XGBOOST ENSEMBLE</div>
            <div style="font-size: 5.8pt; color: #94a3b8;">Daily Precipitation (mm)</div>
          </div>
          <div style="color: #10b981;">➔</div>
          <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(168, 85, 247, 0.3); padding: 4px 6px; border-radius: 4px; flex: 1; text-align: center;">
            <div style="color: #a855f7; font-weight: 700;">3. TREESHAP EXPLAINER</div>
            <div style="font-size: 5.8pt; color: #94a3b8;">Game-Theoretic Attribution</div>
          </div>
          <div style="color: #a855f7;">➔</div>
          <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(245, 158, 11, 0.3); padding: 4px 6px; border-radius: 4px; flex: 1; text-align: center;">
            <div style="color: #f59e0b; font-weight: 700;">4. RUSLE PHYSICS</div>
            <div style="font-size: 5.8pt; color: #94a3b8;">A = R·K·LS·C·P Soil Triage</div>
          </div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 1: Overview & Hinglish Summary</div>
      <div>Page 1 of 7</div>
    </div>
  </div>

  <!-- ================= PAGE 2: HEADER, DATE & ATMOSPHERIC PROFILES ================= -->
  <div class="page">
    <div class="doc-header">
      <div class="brand">
        <span>🧭</span> Feature Suite 1: Command Header & Weather Mode Generator
      </div>
      <div class="badge">Sidebar & Weather Controls</div>
    </div>

    <div class="content">
      <div class="card" style="padding: 6px 10px;">
        <h2>Date Engine & Atmospheric Weather Shock Modes</h2>
        <p style="font-size: 7.5pt; color: #94a3b8; margin-top: 1px;">
          How selecting different dates and triggering atmospheric profiles directly alters the live prediction engine and topsoil hazard classification.
        </p>
      </div>

      <!-- Screenshot Frame -->
      <div class="screenshot-frame" style="height: 52mm;">
        <img src="${b64HeaderBento}" alt="Header and Bento Grid" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note-cyan">
        <strong>💡 Date Badalne Aur Mausam Change Karne Ka Asli Asar (Hinglish Notes):</strong><br>
        Sidebar mein 2 powerful controls hain jo poore dashboard ka mausam badal dete hain:
        <ul style="margin-left: 14px; margin-top: 2px; line-height: 1.3;">
          <li><strong>1. Date Picker (📅 Forecast Date):</strong> Agar aap monsoon ka mahina (June ya August) chunte ho, toh zameen mein pehle se nami hoti hai (high antecedent moisture), jisse baarish aur mitti katan badh jata hai. Winter ya summer date chunne par rainfall auto-drop ho jata hai!</li>
          <li><strong>2. Historical vs Future:</strong> Agar 1991-2024 ki date chuni, toh IMD ka ground truth match dikhega. Agar future date (2026/2030) chuni, toh AI simulation engine chalega!</li>
          <li><strong>3. Atmospheric Generator:</strong> Niche diye 4 modes dekho — ek click mein tufaan ya sookha create hota hai!</li>
        </ul>
      </div>

      <!-- Atmospheric Profiles Comparison Table -->
      <div class="card">
        <h3>Weather Profile Shocks Comparison (Kya Select Karne Par Kya Hota Hai?)</h3>
        <table style="margin-top: 3px;">
          <thead>
            <tr>
              <th style="width: 130px;">Weather Mode Profile</th>
              <th style="width: 90px;">Rainfall Forecast</th>
              <th style="width: 110px;">Soil Loss Detachment</th>
              <th>System Reaction & Real-World Meaning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>🌦️ Dynamic Monsoon (Auto)</strong></td>
              <td><span class="code-span">28.44 mm</span></td>
              <td><span class="code-span">4.82 t/ha/yr</span></td>
              <td>Baseline seasonal normal. Zameen par safe limit ke andar runoff hota hai (Green status).</td>
            </tr>
            <tr>
              <td><strong>⚡ Cloudburst Event (Extreme)</strong></td>
              <td><span class="code-span" style="color: #ef4444; font-weight: 700;">92.00 mm</span></td>
              <td><span class="code-span" style="color: #ef4444; font-weight: 700;">18.50+ t/ha/yr</span></td>
              <td><strong>▲ Severe Detachment Breach:</strong> Card 3 aur 4 red alert ho jate hain! Mitti beh kar nadiyo mein jaati hai.</td>
            </tr>
            <tr>
              <td><strong>☀️ Dry Fallow (Heatwave)</strong></td>
              <td><span class="code-span">0.00 mm</span></td>
              <td><span class="code-span">0.00 t/ha/yr</span></td>
              <td>Sookha aur tez dhoop. Zameen mein koi runoff nahi hota, topsoil loss zero ho jata hai (Safe).</td>
            </tr>
            <tr>
              <td><strong>⛈️ Cyclonic Storm (Heavy)</strong></td>
              <td><span class="code-span">64.50 mm</span></td>
              <td><span class="code-span">11.20 t/ha/yr</span></td>
              <td>Continuous cyclone downpour. Zameen saturation point cross kar leti hai, moderate to severe triage.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Doodle Pro Tip Box -->
      <div class="doodle-box">
        <div class="doodle-title" style="color: #f59e0b;">
          ✎ Video Mein Dekho! <span class="doodle-tag">~ Live Weather Changes</span>
        </div>
        <p style="font-size: 7.2pt; color: #fde68a;">
          Video mein humne pehle <strong>Bhopal</strong> select kiya, fir Date ka month change kiya, fir <strong>"Cloudburst Event"</strong> chun kar cards ko <strong>92mm rain</strong> aur red alert hote dikhaya, aur fir <strong>"Dry Fallow"</strong> karke 0mm safe state dikhaya!
        </p>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 2: Date Engine & Atmospheric Profiles</div>
      <div>Page 2 of 7</div>
    </div>
  </div>

  <!-- ================= PAGE 3: TAB 1 - GEOSPATIAL RADAR & SCROLL ================= -->
  <div class="page">
    <div class="doc-header">
      <div class="brand">
        <span>🗺️</span> Feature Suite 2: Tab 1 — Geospatial Radar & Live Telemetry Stream
      </div>
      <div class="badge">Spatial Analytics</div>
    </div>

    <div class="content">
      <div class="card" style="padding: 6px 10px;">
        <h2>Raisen Catchment 3D Watershed Radar & Regional Stream</h2>
        <p style="font-size: 7.5pt; color: #94a3b8; margin-top: 1px;">
          Interactive spatial visualization combining polygon GeoJSON catchment boundaries, glowing station markers, and real-time regional telemetry stream.
        </p>
      </div>

      <!-- Screenshot Frame -->
      <div class="screenshot-frame" style="height: 94mm;">
        <img src="${b64Tab1Spatial}" alt="Geospatial Catchment Radar" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note">
        <strong>🗺️ Map Aur Table Ka Asli Fundaa (Hinglish Notes):</strong><br>
        Jab aap Tab 1 khol kar neeche scroll karte hain, yeh 3 cheezein step-by-step samne aati hain:
        <ul style="margin-left: 14px; margin-top: 2px; line-height: 1.3;">
          <li><strong>1. 3D Watershed Radar (Map):</strong> Bhopal, Raisen, Bareli, Begumganj ke glowing pins dikhte hain. Golden Star Pin aapki active tehsil ko mark karta hai. Pin par mouse le jane se instant tooltip aati hai!</li>
          <li><strong>2. Active Node Dossier (Scroll Level 1):</strong> Map ke theek neeche selected tehsil ki zameen ki kundli aati hai — GPS Coordinates, Topography Dhalan (<code class="code-span">LS = 2.10</code>), aur Mitti ki Pakad (<code class="code-span">K = 0.31 SI</code>).</li>
          <li><strong>3. Regional Telemetry Stream (Scroll Level 2):</strong> Poore page ke bottom par ek live table hai jo sabhi 8 tehsils ki baarish, kinetic energy (R), aur soil loss (A) ko compare karti hai!</li>
        </ul>
      </div>

      <!-- Dossier Breakdown -->
      <div class="doodle-box-green">
        <div class="doodle-title" style="color: #10b981;">
          📌 Scroll Architecture — Tab 1 Mein Kaise Ghumein? <span class="doodle-tag">~ Viewport Tour</span>
        </div>
        <div class="grid-3" style="margin-top: 2px; font-size: 7pt;">
          <div style="background: rgba(15,23,42,0.8); padding: 4px 6px; border-radius: 4px;">
            <strong style="color: #38bdf8;">Top: 3D Radar Map</strong><br>
            Pin hovering + GeoJSON borders
          </div>
          <div style="background: rgba(15,23,42,0.8); padding: 4px 6px; border-radius: 4px;">
            <strong style="color: #f59e0b;">Mid: Node Dossier</strong><br>
            LS=2.10, K=0.31 SI, SYNCED Tag
          </div>
          <div style="background: rgba(15,23,42,0.8); padding: 4px 6px; border-radius: 4px;">
            <strong style="color: #10b981;">Bottom: Telemetry Table</strong><br>
            All 8 tehsils ranked live
          </div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 3: Geospatial Radar & Regional Table</div>
      <div>Page 3 of 7</div>
    </div>
  </div>

  <!-- ================= PAGE 4: TAB 2 - MULTI-DAY TRAJECTORY & WHAT-IF ================= -->
  <div class="page">
    <div class="doc-header">
      <div class="brand">
        <span>📈</span> Feature Suite 3: Tab 2 — 7-Day Trajectory & What-If Sandbox
      </div>
      <div class="badge">Predictive Simulation</div>
    </div>

    <div class="content">
      <div class="card" style="padding: 6px 10px;">
        <h2>Autoregressive 7-Day Forecast & What-If Stress-Test Sandbox</h2>
        <p style="font-size: 7.5pt; color: #94a3b8; margin-top: 1px;">
          Multi-horizon rainfall trajectory coupled with interactive sensitivity sliders enabling researchers to simulate conservation interventions and extreme storm shocks.
        </p>
      </div>

      <!-- Screenshot Frame -->
      <div class="screenshot-frame" style="height: 94mm;">
        <img src="${b64Tab2Trajectory}" alt="7-Day Trajectory and What-If Sandbox" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note-pink">
        <strong>⚡ 7-Day Graph Aur Tufaan Simulator Ka Fundaa (Hinglish Notes):</strong><br>
        Tab 2 mein jab aap scroll karte hain, toh do zabardast interactive tools milte hain:
        <ul style="margin-left: 14px; margin-top: 2px; line-height: 1.3;">
          <li><strong>1. 7-Day Trajectory Graph (Scroll Level 1):</strong> Blue Bars batate hain ki aane wale 7 dino mein har din kitne mm baarish hogi. Red Line batati hai ki uss baarish se mitti kitni bhati jayegi. Mouse hover karne par har din ka exact data popup hota hai!</li>
          <li><strong>2. What-If Cloudburst Downpour Slider (Scroll Level 2):</strong> Slider ko pakad kar 120mm ya 150mm par kheencho! Neeche turant card ka rang laal ho kar warning aayegi: <strong style="color:#be123c;">CRITICAL EROSION COLLAPSE</strong>!</li>
          <li><strong>3. Slope Slider (LS Factor):</strong> Agar pahadi khet ka dhalan 1.8 se badhkar 3.5 ho jaye, toh mitti 3x tezi se bhati hai.</li>
        </ul>
      </div>

      <!-- Interactive Sandbox Box -->
      <div class="doodle-box">
        <div class="doodle-title" style="color: #f59e0b;">
          💡 Scroll Karke Sliders Dekho! <span class="doodle-tag">~ Video Mein Shown</span>
        </div>
        <p style="font-size: 7.2pt; color: #fde68a;">
          Video mein humne Tab 2 khol kar pehle chart par mouse hover kiya, fir neeche scroll karke <strong>"Simulate Cloudburst Downpour (mm)"</strong> slider ko drag karke live soil erosion collapse calculate hote dikhaya hai!
        </p>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 4: 7-Day Trajectory & What-If Sliders</div>
      <div>Page 4 of 7</div>
    </div>
  </div>

  <!-- ================= PAGE 5: TAB 3 - TREESHAP EXPLAINABILITY ================= -->
  <div class="page">
    <div class="doc-header">
      <div class="brand">
        <span>🧾</span> Feature Suite 4: Tab 3 — TreeSHAP Explainability Receipts
      </div>
      <div class="badge">Responsible AI & XAI</div>
    </div>

    <div class="content">
      <div class="card" style="padding: 6px 10px;">
        <h2>Game-Theoretic TreeSHAP Attribution & Algorithmic Receipts</h2>
        <p style="font-size: 7.5pt; color: #94a3b8; margin-top: 1px;">
          Local waterfall explanations and global feature attribution ensuring full compliance with AI transparency and auditability standards.
        </p>
      </div>

      <!-- Screenshot Frame -->
      <div class="screenshot-frame" style="height: 90mm;">
        <img src="${b64Tab3TreeSHAP}" alt="TreeSHAP Receipts and Beeswarm" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note">
        <strong>🧾 TreeSHAP Ka Asli Matlab: AI Ka Pakka Bill / Receipt (Hinglish Notes):</strong><br>
        Aksar log sochte hain ki Machine Learning ek <em>"Black Box"</em> (kaala dabba) hai jahan andar kya ho raha hai kisi ko nahi pata. Par TreeSHAP ek ek pie ka hisaab deta hai:
        <ul style="margin-left: 14px; margin-top: 2px; line-height: 1.3;">
          <li><strong>Baseline (Base Value):</strong> Raisen ki aam dino ki average baarish (e.g. 2.45 mm).</li>
          <li><strong>Green Bar (+ Impact):</strong> Mausam ke wo clues jinhone baarish badhayi (jaise pichle 7 din ki nami aur hawa ka rukh).</li>
          <li><strong>Red Bar (- Impact):</strong> Wo factors jinhone baarish ko kam kiya (jaise tez dhoop ya dry heatwave).</li>
          <li><strong>Global Beeswarm (Scroll Down):</strong> Neeche scroll karne par 1,000 instances ka Beeswarm chart dikhta hai jo prove karta hai ki 7-day rolling rain sabse bada governing factor hai.</li>
        </ul>
      </div>

      <!-- Global Insights Doodle Box -->
      <div class="doodle-box-cyan">
        <div class="doodle-title" style="color: #38bdf8;">
          🌐 Scroll Down Karke Beeswarm Plot Dekhein! <span class="doodle-tag">~ Video Walkthrough</span>
        </div>
        <p style="font-size: 7.2pt; color: #cbd5e1;">
          Tab 3 mein jab aap scroll karte hain, upar local instance ka waterfall bar chart dikhta hai aur neeche scroll karne par pooray model ka <strong>Global TreeSHAP Beeswarm Plot</strong> aur <strong>Feature Importance Bar Chart</strong> dikhai deta hai!
        </p>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 5: TreeSHAP Receipts & Beeswarm</div>
      <div>Page 5 of 7</div>
    </div>
  </div>

  <!-- ================= PAGE 6: TAB 4 - RUSLE SOIL PHYSICS & ADVISORY ================= -->
  <div class="page">
    <div class="doc-header">
      <div class="brand">
        <span>🌱</span> Feature Suite 5: Tab 4 — RUSLE Soil Physics & Interventions
      </div>
      <div class="badge">Agricultural Triage</div>
    </div>

    <div class="content">
      <div class="card" style="padding: 6px 10px;">
        <h2>RUSLE Physical Erosion Triage & Farmer Advisory Bulletin</h2>
        <p style="font-size: 7.5pt; color: #94a3b8; margin-top: 1px;">
          Deterministic soil conservation physics, dynamic dial gauge, and automated agricultural engineering advisory bulletin.
        </p>
      </div>

      <!-- Screenshot Frame -->
      <div class="screenshot-frame" style="height: 70mm;">
        <img src="${b64Tab4Rusle}" alt="RUSLE Soil Physics and Gauge" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note-cyan">
        <strong>🌾 Mitti Bachao Formula & Speedometer Ka Fundaa (Hinglish Notes):</strong><br>
        Tab 4 mein physical science aur kisaano ke liye live field advice hai:
        <ul style="margin-left: 14px; margin-top: 2px; line-height: 1.3;">
          <li><strong>Speedometer Gauge:</strong> Bike ke speedometer jaisa gauge meter dikhata hai ki kitne ton mitti beh rahi hai. Agar needle green zone (0-5) mein hai toh safe hai. Agar needle red zone (20+) mein gayi toh mitti khatam ho jayegi!</li>
          <li><strong>RUSLE Formula (A = R &times; K &times; LS &times; C &times; P):</strong>
            <br>&bull; <strong>R:</strong> Baarish ka thappad (Rain kinetic force)
            <br>&bull; <strong>K:</strong> Mitti ka type (Black cotton soil)
            <br>&bull; <strong>LS:</strong> Khet ki dhalan aur slope
            <br>&bull; <strong>C & P:</strong> Kisaan ki kheti aur medh-bandi (bunding) ka bachav.
          </li>
        </ul>
      </div>

      <!-- Farmer Bulletin Doodle Box -->
      <div class="doodle-box-green">
        <div class="doodle-title" style="color: #10b981;">
          🌱 Kisaan Bhaiyo Ke Liye Live Salah (Farmer Advisory Bulletin) <span class="doodle-tag">~ Field Actions</span>
        </div>
        <div class="grid-2" style="font-size: 7pt; margin-top: 2px;">
          <div style="background: rgba(15,23,42,0.8); padding: 4px 7px; border-radius: 4px;">
            <strong style="color: #f59e0b;">⚠️ Baarish Ke Alert Par:</strong><br>
            Tez baarish se 24 ghante pehle khet mein chemical khad (fertilizer) mat daalein, warna paani sab baha le jayega aur nadi gandi ho jayegi!
          </div>
          <div style="background: rgba(15,23,42,0.8); padding: 4px 7px; border-radius: 4px;">
            <strong style="color: #10b981;">🛡️ Mitti Rokne Ka Upay:</strong><br>
            Dhalan wale khet ke kinaare <strong>Vetiver Ghaas (Khus)</strong> lagayein aur patthar ki medh (stone bunds) banayein taaki mitti khet mein hi ruki rahe.
          </div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 6: RUSLE Physics & Farmer Bulletin</div>
      <div>Page 6 of 7</div>
    </div>
  </div>

  <!-- ================= PAGE 7: VIDEO INDEX & EVALUATION GUIDE ================= -->
  <div class="page">
    <div class="doc-header">
      <div class="brand">
        <span>🎬</span> Multimodal Feature Walkthrough & Evaluation Guide
      </div>
      <div class="badge">Walkthrough Video Guide</div>
    </div>

    <div class="content">
      <div class="card" style="padding: 6px 10px;">
        <h2>Walkthrough Video Feature Index & Evaluation Roadmap</h2>
        <p style="font-size: 7.5pt; color: #94a3b8; margin-top: 1px;">
          Minute-by-minute index correlating scenes in EcoVision_AI_Walkthrough.mp4 directly to platform components for examiners and researchers.
        </p>
      </div>

      <!-- Walkthrough Video Timestamp Index Table -->
      <div class="card" style="border: 1px solid rgba(56, 189, 248, 0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px;">
          <h3 style="color: #38bdf8;">Video Feature Index (EcoVision_AI_Walkthrough.mp4)</h3>
          <span class="tag tag-emerald">Duration: 85 Seconds (1m 25s) • 1440x900 H.264 MP4</span>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 75px;">Timestamp</th>
              <th style="width: 140px;">Feature Demonstrated</th>
              <th>Interactive Actions, Scrolling & UI Elements Captured in Walkthrough</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="code-span">00:00 - 00:12</span></td>
              <td><strong>Command Header & Bento Grid</strong></td>
              <td>Continuous telemetry ticker, Active Prediction Engine stats, and smooth mouse hovers across all 4 Bento KPI cards (Precipitation, Erosivity R, Soil Loss A, and ICAR Hazard Tier).</td>
            </tr>
            <tr>
              <td><span class="code-span">00:12 - 00:40</span></td>
              <td><strong>Sidebar: Tehsil, Date & Weather</strong></td>
              <td>Switching station to Bhopal, changing forecast month, triggering Cloudburst Event (cards jump to 92mm rain & red alert), switching to Dry Fallow (cards drop to 0mm safe), and resetting.</td>
            </tr>
            <tr>
              <td><span class="code-span">00:40 - 01:05</span></td>
              <td><strong>Tab 1: Radar & Full Scroll</strong></td>
              <td>Switching to Tab 1, smoothly scrolling down to Watershed Map, hovering over glowing pins, smoothly scrolling down to Active Node Dossier and Regional Telemetry table, and scrolling back up.</td>
            </tr>
            <tr>
              <td><span class="code-span">01:05 - 01:15</span></td>
              <td><strong>Tab 2: Trajectory & What-If</strong></td>
              <td>Switching to Tab 2, smoothly scrolling to 7-day trajectory chart, hovering across bars/lines, scrolling down to What-If Climate Shock Simulator, and interacting with Cloudburst slider.</td>
            </tr>
            <tr>
              <td><span class="code-span">01:15 - 01:20</span></td>
              <td><strong>Tab 3: TreeSHAP Receipts</strong></td>
              <td>Switching to Tab 3, smoothly scrolling to TreeSHAP waterfall bar chart & itemized table, and scrolling down to Global Beeswarm summary plot and feature importance chart.</td>
            </tr>
            <tr>
              <td><span class="code-span">01:20 - 01:25</span></td>
              <td><strong>Tab 4: RUSLE & Grand Vista</strong></td>
              <td>Switching to Tab 4, smoothly scrolling to Soil Loss dial gauge and Farmer Advisory Bulletin, and smoothly scrolling back up to top grand vista for closing shot.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note">
        <strong>🎯 Final Reviewer / Teacher / Evaluator Guide (Hinglish):</strong><br>
        Agar koi evaluator ya teacher aapse poochhe ki <strong>"Is project mein kya special hai?"</strong>, toh yeh 3 baatein zaroor batayein:
        <ul style="margin-left: 14px; margin-top: 2px; line-height: 1.3;">
          <li><strong>1. Real Physics & Real Weather:</strong> Sirf hawa mein baarish predict nahi karta, balki kisaan ke khet ki mitti katan (soil loss) ka physical formula (RUSLE) se real-world impact batata hai.</li>
          <li><strong>2. Complete Explainability (TreeSHAP):</strong> Har prediction ke peeche ka reason clear hai (Game Theory Shapley values), jo responsible AI ke PhD standards ko satisfy karta hai.</li>
          <li><strong>3. Live Cloud Web App:</strong> Render cloud par 24/7 live deployed hai aur poora interactive hai!</li>
        </ul>
      </div>

      <!-- Quick Links Card -->
      <div class="card" style="border-left: 4px solid #38bdf8;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 7pt;">
          <div>
            <strong>Live Deployed Application:</strong> <a href="https://nitika-ma-am.onrender.com/" target="_blank">https://nitika-ma-am.onrender.com/</a>
          </div>
          <div>
            <strong>GitHub Repository:</strong> <a href="https://github.com/Pratyaksh82/Nitika_ma-am" target="_blank">https://github.com/Pratyaksh82/Nitika_ma-am</a>
          </div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 7: Walkthrough Video Index & Evaluation Guide</div>
      <div>Page 7 of 7</div>
    </div>
  </div>

</body>
</html>
`;

async function compilePDF() {
  console.log('[1/4] Writing HTML template to scripts/presentation_manual.html...');
  const htmlPath = path.resolve('scripts', 'presentation_manual.html');
  fs.writeFileSync(htmlPath, htmlContent, 'utf-8');
  console.log(`[OK] HTML written (${(htmlContent.length / 1024).toFixed(1)} KB)`);

  console.log('[2/4] Launching Puppeteer browser in print mode...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 1920 });

  console.log('[3/4] Loading HTML template into page...');
  await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 35000 });

  // Allow Google Fonts (Caveat, JetBrains Mono, Plus Jakarta Sans) to settle
  await new Promise(r => setTimeout(r, 2500));

  console.log('[4/4] Printing multi-page A4 PDF...');
  const pdfBuffer = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: { top: '0', right: '0', bottom: '0', left: '0' },
    preferCSSPageSize: true
  });

  fs.writeFileSync(OUTPUT_PDF, pdfBuffer);
  fs.writeFileSync(ROOT_PDF, pdfBuffer);
  console.log(`[OK] Successfully saved:`);
  console.log(`   - ${OUTPUT_PDF} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);
  console.log(`   - ${ROOT_PDF} (${(pdfBuffer.length / 1024).toFixed(1)} KB)`);

  await browser.close();
  console.log('PDF compilation with Hinglish & Doodle Notes completed successfully!');
}

compilePDF().catch(err => {
  console.error('[Error compiling PDF]', err);
  process.exit(1);
});
