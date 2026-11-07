/**
 * Automated High-Definition Walkthrough Video Recorder in MP4 Format
 * Uses Puppeteer CDP Screencast + Native FFmpeg H.264 image2pipe encoding.
 */

const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FFMPEG_PATH = 'C:\\Program Files\\AI ExpertMeet\\resources\\bindings\\FFmpeg\\ffmpeg.exe';
const APP_URL = 'http://localhost:8501'; // ultra-responsive local host
const OUTPUT_MP4 = path.resolve('outputs/EcoVision_AI_Walkthrough.mp4');

const CONFIG = {
  viewport: { width: 1440, height: 900 },
  fps: 24,
  quality: 90,
  crf: 19
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function recordWalkthrough() {
  fs.mkdirSync(path.dirname(OUTPUT_MP4), { recursive: true });
  if (fs.existsSync(OUTPUT_MP4)) {
    try { fs.unlinkSync(OUTPUT_MP4); } catch (e) {}
  }

  console.log(`[1/5] Launching Chrome (${CONFIG.viewport.width}x${CONFIG.viewport.height})...`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport(CONFIG.viewport);

  console.log(`[2/5] Navigating to ${APP_URL}...`);
  await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 45000 });
  await page.waitForSelector('.stApp', { timeout: 15000 });
  await sleep(4000); // Allow Streamlit and Plotly to fully hydrate

  console.log('[3/5] Attaching Chrome DevTools Protocol (CDP) screencast...');
  const client = await page.target().createCDPSession();
  let currentFrameBuffer = null;

  client.on('Page.screencastFrame', async (frame) => {
    currentFrameBuffer = Buffer.from(frame.data, 'base64');
    try {
      await client.send('Page.screencastFrameAck', { sessionId: frame.sessionId });
    } catch (e) {}
  });

  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: CONFIG.quality,
    everyNthFrame: 1
  });

  while (!currentFrameBuffer) {
    await sleep(25);
  }

  console.log(`[4/5] Spawning FFmpeg encoder -> ${OUTPUT_MP4}...`);
  const ffmpeg = spawn(FFMPEG_PATH, [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-framerate', String(CONFIG.fps),
    '-i', '-',
    '-c:v', 'h264_mf',
    '-b:v', '4M',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    OUTPUT_MP4
  ]);

  ffmpeg.stderr.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('Error') || msg.includes('error') || msg.includes('Invalid')) {
      console.error('[FFmpeg stderr]', msg);
    }
  });

  ffmpeg.stdin.on('error', (err) => {
    console.error('[FFmpeg stdin error]', err.message);
  });

  const intervalMs = Math.round(1000 / CONFIG.fps);
  const frameInterval = setInterval(() => {
    if (currentFrameBuffer && ffmpeg.stdin.writable) {
      ffmpeg.stdin.write(currentFrameBuffer);
    }
  }, intervalMs);

  console.log('[5/5] Executing Detailed Feature Walkthrough Choreography...');
  try {
    // ---------------- SCENE 1: Header & Bento Grid Overview (0s - 10s) ----------------
    console.log('  -> Scene 1: Command Header & Live Telemetry Bento Grid...');
    await sleep(3500);

    // Hover over Bento Cards
    const cards = await page.$$('.glass-card');
    if (cards.length > 0) {
      await cards[0].hover();
      await sleep(1500);
      if (cards.length > 1) {
        await cards[1].hover();
        await sleep(1500);
      }
      if (cards.length > 2) {
        await cards[2].hover();
        await sleep(1500);
      }
      if (cards.length > 3) {
        await cards[3].hover();
        await sleep(1500);
      }
    }

    // ---------------- SCENE 2: Sidebar Controls & Weather Profiles (10s - 22s) ----------------
    console.log('  -> Scene 2: Interacting with Sidebar & Atmospheric Profiles...');
    // Scroll sidebar slightly
    await page.evaluate(() => {
      const sidebar = document.querySelector('section[data-testid="stSidebar"]');
      if (sidebar) sidebar.scrollTop = 100;
    });
    await sleep(2000);

    // Click selectbox to change tehsil
    const selectboxes = await page.$$('div[data-baseweb="select"]');
    if (selectboxes.length > 0) {
      await selectboxes[0].click();
      await sleep(1500);
      // Press Down Arrow and Enter
      await page.keyboard.press('ArrowDown');
      await sleep(500);
      await page.keyboard.press('ArrowDown');
      await sleep(500);
      await page.keyboard.press('Enter');
      await sleep(3000);
    }

    // Change Atmospheric Profile if second selectbox exists
    if (selectboxes.length > 1) {
      await selectboxes[1].click();
      await sleep(1500);
      await page.keyboard.press('ArrowDown');
      await sleep(500);
      await page.keyboard.press('ArrowDown');
      await sleep(500);
      await page.keyboard.press('Enter');
      await sleep(3000);
    }

    // ---------------- SCENE 3: Tab 1 - Map, GeoJSON & Telemetry Stream (22s - 38s) ----------------
    console.log('  -> Scene 3: Geospatial Catchment Radar & GeoJSON Polygons...');
    // Smooth scroll down to map
    await page.evaluate(() => {
      window.scrollBy({ top: 400, behavior: 'smooth' });
    });
    await sleep(4000);

    // Hover on map center
    await page.mouse.move(720, 500);
    await sleep(2500);

    // Scroll down to Active Node Dossier & Telemetry Table
    await page.evaluate(() => {
      window.scrollBy({ top: 350, behavior: 'smooth' });
    });
    await sleep(4000);

    // ---------------- SCENE 4: Tab 2 - 7-Day Forecast & What-If Sandbox (38s - 55s) ----------------
    console.log('  -> Scene 4: 7-Day Trajectory & What-If Stress-Test Sandbox...');
    // Scroll back to tabs
    await page.evaluate(() => {
      window.scrollTo({ top: 220, behavior: 'smooth' });
    });
    await sleep(1500);

    // Click Tab 2
    const tabs = await page.$$('button[data-baseweb="tab"]');
    if (tabs.length > 1) {
      await tabs[1].click();
      await sleep(3500);

      // Scroll to chart
      await page.evaluate(() => {
        window.scrollBy({ top: 150, behavior: 'smooth' });
      });
      await sleep(3000);

      // Scroll to What-If sandbox sliders
      await page.evaluate(() => {
        window.scrollBy({ top: 320, behavior: 'smooth' });
      });
      await sleep(4000);
    }

    // ---------------- SCENE 5: Tab 3 - TreeSHAP Explainability Receipts (55s - 72s) ----------------
    console.log('  -> Scene 5: TreeSHAP Explainability Receipts & Global Insights...');
    await page.evaluate(() => {
      window.scrollTo({ top: 220, behavior: 'smooth' });
    });
    await sleep(1500);

    if (tabs.length > 2) {
      await tabs[2].click();
      await sleep(3500);

      // Show Waterfall Chart & Itemized table
      await page.evaluate(() => {
        window.scrollBy({ top: 180, behavior: 'smooth' });
      });
      await sleep(3500);

      // Scroll to Global TreeSHAP Insights
      await page.evaluate(() => {
        window.scrollBy({ top: 380, behavior: 'smooth' });
      });
      await sleep(4500);
    }

    // ---------------- SCENE 6: Tab 4 - RUSLE Soil Physics & Interventions (72s - 85s) ----------------
    console.log('  -> Scene 6: RUSLE Soil Physics, Gauge Indicator & Advisory...');
    await page.evaluate(() => {
      window.scrollTo({ top: 220, behavior: 'smooth' });
    });
    await sleep(1500);

    if (tabs.length > 3) {
      await tabs[3].click();
      await sleep(3500);

      // Show gauge and remediation dispatch
      await page.evaluate(() => {
        window.scrollBy({ top: 180, behavior: 'smooth' });
      });
      await sleep(4500);
    }

    // Scroll back to top for closing vista
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    await sleep(3000);

  } finally {
    clearInterval(frameInterval);

    try {
      await client.send('Page.stopScreencast');
    } catch (e) {}

    await browser.close();

    console.log('Finalizing FFmpeg encoding...');
    ffmpeg.stdin.end();

    await new Promise((resolve) => {
      ffmpeg.on('close', (code) => {
        console.log(`FFmpeg closed with code ${code}`);
        resolve();
      });
    });

    if (fs.existsSync(OUTPUT_MP4)) {
      const stats = fs.statSync(OUTPUT_MP4);
      console.log(`✅ VIDEO GENERATION SUCCESS: ${OUTPUT_MP4} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
    } else {
      console.error('❌ Failed to generate MP4 file.');
    }
  }
}

recordWalkthrough().catch(err => {
  console.error('Fatal recording error:', err);
  process.exit(1);
});
