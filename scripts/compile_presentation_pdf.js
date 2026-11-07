/**
 * EcoVision AI • Publication-Grade Multi-Page Presentation Manual PDF Compiler
 * Enhanced with Hinglish Notes, Doodle Boxes, Sticky Notes, and Simple Component Guides.
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
      padding: 11mm 14mm 10mm 14mm;
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
      padding-bottom: 6px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.18);
      font-size: 8pt;
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
      font-size: 6.8pt;
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
      font-size: 7.2pt;
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
      padding-top: 7px;
      gap: 8px;
    }

    /* Typography */
    h1 {
      font-size: 17pt;
      font-weight: 800;
      line-height: 1.15;
      background: linear-gradient(135deg, #ffffff 0%, #cbd5e1 50%, #94a3b8 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: -0.5px;
    }
    h2 {
      font-size: 11.5pt;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.2px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    h3 {
      font-size: 8.8pt;
      font-weight: 700;
      color: #38bdf8;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }
    p {
      font-size: 8pt;
      line-height: 1.4;
      color: #cbd5e1;
    }

    /* Cards & Containers */
    .card {
      background: rgba(15, 23, 42, 0.82);
      border: 1px solid rgba(148, 163, 184, 0.18);
      border-radius: 8px;
      padding: 8px 11px;
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
      padding: 7px 11px;
      border-radius: 5px;
      box-shadow: 2px 4px 10px rgba(0,0,0,0.3);
      border-left: 5px solid #eab308;
      transform: rotate(-0.6deg);
      font-size: 7.8pt;
      line-height: 1.35;
    }
    .sticky-note strong {
      color: #713f12;
      font-size: 8.2pt;
    }
    .sticky-note-cyan {
      background: #cffafe;
      color: #164e63;
      padding: 7px 11px;
      border-radius: 5px;
      box-shadow: 2px 4px 10px rgba(0,0,0,0.3);
      border-left: 5px solid #06b6d4;
      transform: rotate(0.6deg);
      font-size: 7.8pt;
      line-height: 1.35;
    }
    .sticky-note-cyan strong {
      color: #155e75;
      font-size: 8.2pt;
    }
    .sticky-note-pink {
      background: #fce7f3;
      color: #831843;
      padding: 7px 11px;
      border-radius: 5px;
      box-shadow: 2px 4px 10px rgba(0,0,0,0.3);
      border-left: 5px solid #ec4899;
      transform: rotate(-0.5deg);
      font-size: 7.8pt;
      line-height: 1.35;
    }
    .sticky-note-pink strong {
      color: #9d174d;
      font-size: 8.2pt;
    }

    .doodle-box {
      border: 1.8px dashed rgba(245, 158, 11, 0.75);
      border-radius: 8px;
      padding: 8px 11px;
      background: rgba(245, 158, 11, 0.06);
    }
    .doodle-box-cyan {
      border: 1.8px dashed rgba(6, 182, 212, 0.75);
      border-radius: 8px;
      padding: 8px 11px;
      background: rgba(6, 182, 212, 0.06);
    }
    .doodle-box-green {
      border: 1.8px dashed rgba(16, 185, 129, 0.75);
      border-radius: 8px;
      padding: 8px 11px;
      background: rgba(16, 185, 129, 0.06);
    }
    .doodle-title {
      font-size: 8pt;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: flex;
      align-items: center;
      gap: 5px;
      margin-bottom: 4px;
    }
    .doodle-tag {
      font-family: 'Caveat', cursive;
      font-size: 11pt;
      font-weight: 700;
      color: #f59e0b;
      margin-left: 4px;
    }

    /* Grid Layouts */
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
    }
    .grid-3 {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 7px;
    }
    .grid-4 {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 6px;
    }

    /* Screenshot Container */
    .screenshot-frame {
      border-radius: 7px;
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
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: #0284c7;
      color: #ffffff;
      font-size: 7pt;
      font-weight: 700;
      margin-right: 4px;
      flex-shrink: 0;
    }
    .tag {
      display: inline-block;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 6.5pt;
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
      font-size: 7.2pt;
    }
    th {
      background: rgba(30, 41, 59, 0.85);
      color: #94a3b8;
      font-weight: 700;
      text-align: left;
      padding: 4px 7px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.25);
      text-transform: uppercase;
      font-size: 6.5pt;
      letter-spacing: 0.5px;
    }
    td {
      padding: 4px 7px;
      border-bottom: 1px solid rgba(148, 163, 184, 0.12);
      color: #e2e8f0;
      vertical-align: top;
    }
    tr:last-child td {
      border-bottom: none;
    }
    .code-span {
      font-family: 'JetBrains Mono', monospace;
      font-size: 6.8pt;
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
      <div class="card card-glow" style="padding: 11px 14px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start;">
          <div>
            <div style="display: flex; gap: 5px; margin-bottom: 4px;">
              <span class="tag tag-cyan">Live Production Web App</span>
              <span class="tag tag-emerald">Render Web Service</span>
              <span class="tag tag-violet">Explainable AI (TreeSHAP)</span>
            </div>
            <h1>EcoVision AI: Integrated Watershed & Soil Erosion Command Center</h1>
            <p style="font-size: 8.8pt; color: #94a3b8; margin-top: 3px;">
              Multi-Day Predictive Meteorological Forecasting, Game-Theoretic TreeSHAP Attribution, and RUSLE Physical Erosion Risk Triage
            </p>
          </div>
          <div style="text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 7.2pt; color: #64748b;">
            <div>DATE: Nov 2026</div>
            <div style="color: #38bdf8; font-weight: 700; margin-top: 2px;">STATUS: 200 OK</div>
          </div>
        </div>
      </div>

      <!-- Links Badges -->
      <div class="grid-2">
        <div class="card">
          <div style="font-size: 6.8pt; color: #94a3b8; text-transform: uppercase;">🌐 Live Cloud URL</div>
          <div style="font-size: 8.2pt; font-weight: 700; color: #38bdf8;">https://nitika-ma-am.onrender.com/</div>
          <div style="font-size: 6.5pt; color: #10b981; margin-top: 1px;">● Deployed on Render • Live & Accessible Online</div>
        </div>
        <div class="card">
          <div style="font-size: 6.8pt; color: #94a3b8; text-transform: uppercase;">💻 GitHub Source Code</div>
          <div style="font-size: 8.2pt; font-weight: 700; color: #38bdf8;">https://github.com/Pratyaksh82/Nitika_ma-am</div>
          <div style="font-size: 6.5pt; color: #a855f7; margin-top: 1px;">● Synchronized on branch main (Includes Video & PDF)</div>
        </div>
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note">
        <strong>📝 Bhai Yeh Website Aakhir Karti Kya Hai? (Simple Summary in Hinglish):</strong><br>
        EcoVision AI hamare Raisen aur Bhopal ke 8 tehsils (Raisen, Bhopal, Bareli, Begumganj, Silvani, Gairatganj, Udaipur, Berasia) ke liye ek <strong>Smart Environmental Watchtower</strong> hai. Yeh do bade kaam karti hai:
        <ul style="margin-left: 14px; margin-top: 3px; line-height: 1.35;">
          <li><strong>Pehla (ML Forecast):</strong> Aane wale 7 dino mein kab kitni tez baarish hogi (XGBoost aur Random Forest AI models se).</li>
          <li><strong>Doosra (Soil Loss Physics):</strong> Uss baarish ki wajah se kisaano ke khet ki kitni upjau mitti (topsoil) beh kar barbaad ho jayegi (RUSLE physical formula se).</li>
          <li><strong>Teesra (AI Ka Bill / Receipt):</strong> TreeSHAP se har prediction ka transparent hisaab-kitaab milta hai ki model ne yeh faisla kyun liya!</li>
        </ul>
      </div>

      <!-- 4 Core Pillars Grid -->
      <div class="grid-4">
        <div class="card" style="border-left: 3px solid #38bdf8;">
          <div class="tag tag-cyan" style="margin-bottom: 3px;">Tab 1</div>
          <div style="font-weight: 700; font-size: 7.8pt; color: #f8fafc;">Catchment Radar</div>
          <div style="font-size: 7pt; color: #94a3b8; margin-top: 2px;">
            Raisen-Bhopal 3D Map + Glowing Station Pins + Live Table.
          </div>
        </div>
        <div class="card" style="border-left: 3px solid #10b981;">
          <div class="tag tag-emerald" style="margin-bottom: 3px;">Tab 2</div>
          <div style="font-weight: 700; font-size: 7.8pt; color: #f8fafc;">7-Day Trajectory</div>
          <div style="font-size: 7pt; color: #94a3b8; margin-top: 2px;">
            Forward forecast curve + What-If Tufaan & Slope Simulator.
          </div>
        </div>
        <div class="card" style="border-left: 3px solid #a855f7;">
          <div class="tag tag-violet" style="margin-bottom: 3px;">Tab 3</div>
          <div style="font-weight: 700; font-size: 7.8pt; color: #f8fafc;">TreeSHAP Receipts</div>
          <div style="font-size: 7pt; color: #94a3b8; margin-top: 2px;">
            AI decision ka hisaab (waterfall chart + feature impact).
          </div>
        </div>
        <div class="card" style="border-left: 3px solid #f59e0b;">
          <div class="tag tag-amber" style="margin-bottom: 3px;">Tab 4</div>
          <div style="font-weight: 700; font-size: 7.8pt; color: #f8fafc;">RUSLE Interventions</div>
          <div style="font-size: 7pt; color: #94a3b8; margin-top: 2px;">
            Soil loss speed gauge + Kisaan Salah Advisory Bulletin.
          </div>
        </div>
      </div>

      <!-- Architectural Dataflow Box -->
      <div class="doodle-box-cyan">
        <div class="doodle-title" style="color: #38bdf8;">
          ⚙️ End-to-End Pipeline (Data Kaise Flow Hota Hai) <span class="doodle-tag">~ 4-Step Architecture</span>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; gap: 5px; font-family: 'JetBrains Mono', monospace; font-size: 6.8pt; margin-top: 4px;">
          <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(56, 189, 248, 0.3); padding: 5px 6px; border-radius: 4px; flex: 1; text-align: center;">
            <div style="color: #38bdf8; font-weight: 700;">1. IMD WEATHER DATA</div>
            <div style="font-size: 6pt; color: #94a3b8;">1991-2024 Historical Feeds</div>
          </div>
          <div style="color: #38bdf8;">➔</div>
          <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(16, 185, 129, 0.3); padding: 5px 6px; border-radius: 4px; flex: 1; text-align: center;">
            <div style="color: #10b981; font-weight: 700;">2. XGBOOST ENSEMBLE</div>
            <div style="font-size: 6pt; color: #94a3b8;">Daily Precipitation (mm)</div>
          </div>
          <div style="color: #10b981;">➔</div>
          <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(168, 85, 247, 0.3); padding: 5px 6px; border-radius: 4px; flex: 1; text-align: center;">
            <div style="color: #a855f7; font-weight: 700;">3. TREESHAP EXPLAINER</div>
            <div style="font-size: 6pt; color: #94a3b8;">Game-Theoretic Attribution</div>
          </div>
          <div style="color: #a855f7;">➔</div>
          <div style="background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(245, 158, 11, 0.3); padding: 5px 6px; border-radius: 4px; flex: 1; text-align: center;">
            <div style="color: #f59e0b; font-weight: 700;">4. RUSLE PHYSICS</div>
            <div style="font-size: 6pt; color: #94a3b8;">A = R·K·LS·C·P Soil Triage</div>
          </div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 1: Overview & Hinglish Summary</div>
      <div>Page 1 of 7</div>
    </div>
  </div>

  <!-- ================= PAGE 2: HEADER & BENTO GRID ================= -->
  <div class="page">
    <div class="doc-header">
      <div class="brand">
        <span>🧭</span> Feature Suite 1: Command Header & Live Bento Grid
      </div>
      <div class="badge">Component Manual</div>
    </div>

    <div class="content">
      <div class="card" style="padding: 7px 11px;">
        <h2>Executive Telemetry & Ambient Observation Controls</h2>
        <p style="font-size: 7.8pt; color: #94a3b8; margin-top: 1px;">
          Top navigation deck with continuous telemetry stream, active prediction engine stats, and the 4 primary Bento metric cards.
        </p>
      </div>

      <!-- Screenshot Frame -->
      <div class="screenshot-frame" style="height: 60mm;">
        <img src="${b64HeaderBento}" alt="Header and Bento Grid" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note-cyan">
        <strong>💡 Upar Ke 4 Magic Cards Ka Asli Fundaa (Hinglish Notes):</strong><br>
        Jab aap website kholte hain, upar yeh 4 dabbe (cards) dikhte hain. Har ek dabba ek critical cheez batata hai:
        <ul style="margin-left: 14px; margin-top: 3px; line-height: 1.35;">
          <li><strong>Card 1 (Daily Rain Forecast):</strong> AI ne calculate kiya ki aaj ya chuni hui date par kitne mm paani barsega (e.g. 28.44 mm).</li>
          <li><strong>Card 2 (Kinetic Erosivity - R):</strong> Baarish ki boondon mein kitni taakat (kinetic energy) hai mitti ko zameen se ukhadne ki!</li>
          <li><strong>Card 3 (Topsoil Detachment - A):</strong> Ek saal mein per-hectare kitne ton mitti beh jayegi. 5 ton se kam = Safe, 15+ = Red Alert!</li>
          <li><strong>Card 4 (ICAR Hazard Tier):</strong> Kisaano aur sarkar ke liye seedha rang-biranga warning signal (Slight, Moderate, High, Severe).</li>
        </ul>
      </div>

      <!-- Table Breakdown -->
      <div class="card">
        <h3>Component Guide & Operational Blueprint</h3>
        <table style="margin-top: 4px;">
          <thead>
            <tr>
              <th style="width: 25px;">#</th>
              <th style="width: 130px;">UI Component</th>
              <th style="width: 160px;">Operational Trigger</th>
              <th>Scientific & Diagnostic Role</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="badge-num">1</span></td>
              <td><strong>Telemetry Ticker & Header</strong></td>
              <td>Always active on cloud runtime.</td>
              <td>Shows active node [RAISEN-HEADQUARTERS], GPS coordinates, inference latency (1.4ms), and continual active status.</td>
            </tr>
            <tr>
              <td><span class="badge-num">2</span></td>
              <td><strong>Sidebar: Station Selector</strong></td>
              <td>Selectbox with 8 central tehsils.</td>
              <td>Changes catchment parameters (K-factor, LS-factor, base elevation) across Raisen, Bhopal, Bareli, Begumganj, etc.</td>
            </tr>
            <tr>
              <td><span class="badge-num">3</span></td>
              <td><strong>Sidebar: Weather Generator</strong></td>
              <td>Atmospheric profile dropdown.</td>
              <td>Allows simulating extreme scenarios: <span class="tag tag-amber">Heatwave</span>, <span class="tag tag-cyan">Monsoon</span>, or <span class="tag tag-rose">Cloudburst Event</span>.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Doodle Pro Tip Box -->
      <div class="doodle-box">
        <div class="doodle-title" style="color: #f59e0b;">
          ✎ Live Try Karke Dekhein! <span class="doodle-tag">~ Sidebar Controls</span>
        </div>
        <p style="font-size: 7.5pt; color: #fde68a;">
          Sidebar mein jaakar <strong>"⚡ Cloudburst Event (Extreme)"</strong> chuniye! Aap dekhenge ki Card 1 turant 92mm baarish dikhayega aur Card 3 mein Topsoil Detachment red ho kar <strong>"▲ Severe Detachment Breach"</strong> ka emergency warning de dega!
        </p>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 2: Header & Bento Grid</div>
      <div>Page 2 of 7</div>
    </div>
  </div>

  <!-- ================= PAGE 3: TAB 1 - GEOSPATIAL RADAR ================= -->
  <div class="page">
    <div class="doc-header">
      <div class="brand">
        <span>🗺️</span> Feature Suite 2: Tab 1 — Geospatial Catchment Radar
      </div>
      <div class="badge">Spatial Analytics</div>
    </div>

    <div class="content">
      <div class="card" style="padding: 7px 11px;">
        <h2>Raisen Catchment 3D Watershed Radar & Regional Stream</h2>
        <p style="font-size: 7.8pt; color: #94a3b8; margin-top: 1px;">
          Interactive spatial visualization combining polygon GeoJSON catchment boundaries, glowing station markers, and real-time regional telemetry stream.
        </p>
      </div>

      <!-- Screenshot Frame -->
      <div class="screenshot-frame" style="height: 98mm;">
        <img src="${b64Tab1Spatial}" alt="Geospatial Catchment Radar" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note">
        <strong>🗺️ Map Aur Table Ka Asli Fundaa (Hinglish Notes):</strong><br>
        Yahan par aap poore Raisen aur Bhopal district ke 8 tehsils ko map pe ek sath dekh sakte ho:
        <ul style="margin-left: 14px; margin-top: 3px; line-height: 1.35;">
          <li><strong>Glowing Pins (Bhopal, Raisen, Bareli, etc.):</strong> Pin ka rang batata hai ki uss area mein mitti katan ka kitna khatra hai (Green = Safe, Yellow = Moderate, Red = Severe).</li>
          <li><strong>Golden Star Marker:</strong> Jis tehsil ko aapne sidebar se chuna hai, wo map par alag se <strong>★ ACTIVE OBSERVATORY</strong> ban kar chamakta hai.</li>
          <li><strong>Hovering Mouse Magic:</strong> Kisi bhi station par mouse le jao, turant ek card khulega jo uss station ki baarish, dhalan (slope), aur mitti ka loss batayega.</li>
          <li><strong>Regional Telemetry Stream:</strong> Map ke neeche ek real-time table hai jo sabhi 8 tehsils ka data compare karta hai.</li>
        </ul>
      </div>

      <!-- Dossier Breakdown -->
      <div class="doodle-box-green">
        <div class="doodle-title" style="color: #10b981;">
          📌 Active Node Dossier — Zameen Ki Kundli <span class="doodle-tag">~ Station Metrics</span>
        </div>
        <div class="grid-3" style="margin-top: 3px; font-size: 7.2pt;">
          <div style="background: rgba(15,23,42,0.8); padding: 5px 7px; border-radius: 4px;">
            <strong style="color: #38bdf8;">GPS Coordinates:</strong><br>
            23.3315°N, 77.7831°E (Raisen HQ)
          </div>
          <div style="background: rgba(15,23,42,0.8); padding: 5px 7px; border-radius: 4px;">
            <strong style="color: #f59e0b;">Topography (LS):</strong><br>
            2.10 (Pahadi dhalan ki lambai aur angle)
          </div>
          <div style="background: rgba(15,23,42,0.8); padding: 5px 7px; border-radius: 4px;">
            <strong style="color: #10b981;">Soil Erodibility (K):</strong><br>
            0.31 SI (Black cotton soil ki pakad)
          </div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 3: Geospatial Catchment Radar</div>
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
      <div class="card" style="padding: 7px 11px;">
        <h2>Autoregressive 7-Day Forecast & What-If Stress-Test Sandbox</h2>
        <p style="font-size: 7.8pt; color: #94a3b8; margin-top: 1px;">
          Multi-horizon rainfall trajectory coupled with interactive sensitivity sliders enabling researchers to simulate conservation interventions and extreme storm shocks.
        </p>
      </div>

      <!-- Screenshot Frame -->
      <div class="screenshot-frame" style="height: 98mm;">
        <img src="${b64Tab2Trajectory}" alt="7-Day Trajectory and What-If Sandbox" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note-pink">
        <strong>⚡ 7-Day Graph Aur Tufaan Simulator Ka Fundaa (Hinglish Notes):</strong><br>
        Aksar kisaan aur officer poochte hain: "Bhai kal aur parson kya hoga?" Yeh tab uska jawab deta hai:
        <ul style="margin-left: 14px; margin-top: 3px; line-height: 1.35;">
          <li><strong>Blue Bars (Rainfall):</strong> Aane wale 7 dino mein har din kitne mm baarish hogi (e.g. Mon 28mm, Tue 15mm, etc.).</li>
          <li><strong>Red Line (Soil Loss):</strong> Baarish ke hisaab se kitni mitti bhati jayegi. Agar baarish ka bar bada hoga, toh red line bhi upar chadh jayegi!</li>
          <li><strong>What-If Slider (Tufaan Simulator):</strong> Yeh is dashboard ka sabse zabardast tool hai! Slider ko drag karke 120mm ya 200mm baarish set karo, neeche turant live result aayega ki zameen bachegi ya <strong>CRITICAL EROSION COLLAPSE</strong> ho jayega!</li>
          <li><strong>Slope Slider (LS):</strong> Agar pahad ka slope 1.8 se badhakar 3.5 ho jaye, toh mitti 3 guna tezi se behne lagti hai.</li>
        </ul>
      </div>

      <!-- Interactive Sandbox Box -->
      <div class="doodle-box">
        <div class="doodle-title" style="color: #f59e0b;">
          💡 Try It In The App! <span class="doodle-tag">~ Sliders Drag Karke Dekho</span>
        </div>
        <p style="font-size: 7.5pt; color: #fde68a;">
          Tab 2 mein scroll karke <strong>"Simulate Cloudburst Downpour (mm)"</strong> slider ko right drag karke 150mm karo. Aap dekhenge ki estimated topsoil erosion <strong>32.4 tons/ha/year</strong> cross kar jayega aur card ka border laal ho jayega!
        </p>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 4: 7-Day Trajectory & What-If</div>
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
      <div class="card" style="padding: 7px 11px;">
        <h2>Game-Theoretic TreeSHAP Attribution & Algorithmic Receipts</h2>
        <p style="font-size: 7.8pt; color: #94a3b8; margin-top: 1px;">
          Local waterfall explanations and global feature attribution ensuring full compliance with AI transparency and auditability standards.
        </p>
      </div>

      <!-- Screenshot Frame -->
      <div class="screenshot-frame" style="height: 94mm;">
        <img src="${b64Tab3TreeSHAP}" alt="TreeSHAP Receipts and Beeswarm" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note">
        <strong>🧾 TreeSHAP Ka Asli Matlab: AI Ka Pakka Bill / Receipt (Hinglish Notes):</strong><br>
        Aksar log sochte hain ki Machine Learning ek <em>"Black Box"</em> (kaala dabba) hai jahan andar kya ho raha hai kisi ko nahi pata. Par TreeSHAP ek ek pie ka hisaab deta hai:
        <ul style="margin-left: 14px; margin-top: 3px; line-height: 1.35;">
          <li><strong>Baseline (Base Value):</strong> Raisen ki aam dino ki average baarish (e.g. 2.45 mm).</li>
          <li><strong>Green Bar (+ Impact):</strong> Mausam ke wo clues jinhone baarish badhayi (jaise pichle 7 din ki nami aur hawa ka rukh).</li>
          <li><strong>Red Bar (- Impact):</strong> Wo factors jinhone baarish ko kam kiya (jaise tez dhoop ya dry heatwave).</li>
          <li><strong>Net Output:</strong> Base Value + Saare Clues = Final Forecasted Rain! Poora hisaab receipt ki tarah clear hai!</li>
        </ul>
      </div>

      <!-- Global Insights Doodle Box -->
      <div class="doodle-box-cyan">
        <div class="doodle-title" style="color: #38bdf8;">
          🌐 Global Beeswarm Graph — 1000 Dino Ka Sabut <span class="doodle-tag">~ Model Insights</span>
        </div>
        <p style="font-size: 7.5pt; color: #cbd5e1;">
          Neeche scroll karne par Beeswarm plot dikhta hai. Isse yeh saaf saabit hota hai ki <strong>"Rolling Mean 7" (pichle 7 din ki baarish)</strong> sabse bada clue hai jo 42% prediction tay karta hai. Iska matlab: agar pichle hafte tez baarish hui thi, toh agle tufaan mein mitti behne ka khatra double ho jata hai!
        </p>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 5: TreeSHAP Explainability Receipts</div>
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
      <div class="card" style="padding: 7px 11px;">
        <h2>RUSLE Physical Erosion Triage & Farmer Advisory Bulletin</h2>
        <p style="font-size: 7.8pt; color: #94a3b8; margin-top: 1px;">
          Deterministic soil conservation physics, dynamic dial gauge, and automated agricultural engineering advisory bulletin.
        </p>
      </div>

      <!-- Screenshot Frame -->
      <div class="screenshot-frame" style="height: 74mm;">
        <img src="${b64Tab4Rusle}" alt="RUSLE Soil Physics and Gauge" style="width: 100%; height: 100%; object-fit: cover;">
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note-cyan">
        <strong>🌾 Mitti Bachao Formula & Speedometer Ka Fundaa (Hinglish Notes):</strong><br>
        Tab 4 mein physical science aur kisaano ke liye live salah hai:
        <ul style="margin-left: 14px; margin-top: 3px; line-height: 1.35;">
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
        <div class="grid-2" style="font-size: 7.2pt; margin-top: 3px;">
          <div style="background: rgba(15,23,42,0.8); padding: 5px 8px; border-radius: 4px;">
            <strong style="color: #f59e0b;">⚠️ Baarish Ke Alert Par:</strong><br>
            Tez baarish se 24 ghante pehle khet mein chemical khad (fertilizer) mat daalein, warna paani sab baha le jayega aur nadi gandi ho jayegi!
          </div>
          <div style="background: rgba(15,23,42,0.8); padding: 5px 8px; border-radius: 4px;">
            <strong style="color: #10b981;">🛡️ Mitti Rokne Ka Upay:</strong><br>
            Dhalan wale khet ke kinaare <strong>Vetiver Ghaas (Khus)</strong> lagayein aur patthar ki medh (stone bunds) banayein taaki mitti khet mein hi ruki rahe.
          </div>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <div>EcoVision AI Documentation • Page 6: RUSLE Soil Physics & Farmer Bulletin</div>
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
      <div class="card" style="padding: 7px 11px;">
        <h2>Walkthrough Video Feature Index & Evaluation Roadmap</h2>
        <p style="font-size: 7.8pt; color: #94a3b8; margin-top: 1px;">
          Minute-by-minute index correlating scenes in EcoVision_AI_Walkthrough.mp4 directly to platform components for examiners and researchers.
        </p>
      </div>

      <!-- Walkthrough Video Timestamp Index Table -->
      <div class="card" style="border: 1px solid rgba(56, 189, 248, 0.3);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
          <h3 style="color: #38bdf8;">Video Feature Index (EcoVision_AI_Walkthrough.mp4)</h3>
          <span class="tag tag-emerald">Duration: 74 Seconds • 1440x900 H.264 MP4</span>
        </div>
        <table>
          <thead>
            <tr>
              <th style="width: 75px;">Timestamp</th>
              <th style="width: 140px;">Feature Demonstrated</th>
              <th>Interactive Actions & UI Elements Captured in Walkthrough</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="code-span">00:00 - 00:14</span></td>
              <td><strong>Command Header & Bento Grid</strong></td>
              <td>Continuous telemetry ticker, Active Prediction Engine stats, and smooth mouse hovers across all 4 Bento KPI cards (Precipitation, Erosivity R, Soil Loss A, and ICAR Hazard Tier).</td>
            </tr>
            <tr>
              <td><span class="code-span">00:14 - 00:30</span></td>
              <td><strong>Sidebar & Weather Generators</strong></td>
              <td>Switching observatory stations across the 8 tehsils, triggering the Atmospheric Profile generator (Cyclonic Storm mode), and observing dynamic Bento card recalculations.</td>
            </tr>
            <tr>
              <td><span class="code-span">00:30 - 00:50</span></td>
              <td><strong>Tab 1: Watershed Radar</strong></td>
              <td>Switching to Tab 1, exploring the Raisen-Bhopal 3D catchment radar, hovering over glowing station pins (Bhopal, Bareli, Raisen), reviewing Active Node Dossier and Regional Telemetry table.</td>
            </tr>
            <tr>
              <td><span class="code-span">00:50 - 01:05</span></td>
              <td><strong>Tab 2: Trajectory & What-If</strong></td>
              <td>Switching to Tab 2, examining the 7-day autoregressive rainfall curve with dual-axis soil loss line, hovering over chart bars, and exploring the What-If Cloudburst & Slope Simulator.</td>
            </tr>
            <tr>
              <td><span class="code-span">01:05 - 01:10</span></td>
              <td><strong>Tab 3: TreeSHAP Receipts</strong></td>
              <td>Switching to Tab 3, review of model mathematical additivity ticker, inspecting the horizontal TreeSHAP waterfall attribution bar chart, and scrolling to Global Beeswarm summary plot.</td>
            </tr>
            <tr>
              <td><span class="code-span">01:10 - 01:14</span></td>
              <td><strong>Tab 4: RUSLE Soil Physics</strong></td>
              <td>Switching to Tab 4, reviewing dynamic soil loss dial gauge, examining Remediation Dispatch protocol, and reading the practical Farmer Advisory Bulletin.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- HINGLISH DOODLE STICKY NOTE -->
      <div class="sticky-note">
        <strong>🎯 Final Reviewer / Teacher / Evaluator Guide (Hinglish):</strong><br>
        Agar koi evaluator ya teacher aapse poochhe ki <strong>"Is project mein kya special hai?"</strong>, toh yeh 3 baatein zaroor batayein:
        <ul style="margin-left: 14px; margin-top: 3px; line-height: 1.35;">
          <li><strong>1. No Blind Predictions:</strong> Yeh sirf baarish predict nahi karta, balki kisaan ke khet ki mitti katan (soil loss) ka physical formula (RUSLE) se real-world impact batata hai.</li>
          <li><strong>2. Complete Explainability (TreeSHAP):</strong> Har prediction ke peeche ka reason clear hai (Game Theory Shapley values), jo responsible AI ke PhD standards ko satisfy karta hai.</li>
          <li><strong>3. Live Cloud Web App:</strong> Project sirf Jupyter notebook ya code file nahi hai—yeh Render cloud par 24/7 live deployed hai aur poora interactive hai!</li>
        </ul>
      </div>

      <!-- Quick Links Card -->
      <div class="card" style="border-left: 4px solid #38bdf8;">
        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 7.2pt;">
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
