/**
 * EcoVision AI • High-Definition Interactive MP4 Walkthrough Video Recorder
 * Uses Chrome DevTools Protocol (CDP) Screencast piped to FFmpeg (h264_mf)
 * Records a detailed ~100-second tour showing EVERY element, tab, slider, and feature.
 */

const puppeteer = require('puppeteer-core');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const FFMPEG_PATH = 'C:\\Program Files\\AI ExpertMeet\\resources\\bindings\\FFmpeg\\ffmpeg.exe';
const APP_URL = 'http://localhost:8501';

const OUTPUT_DIR = path.resolve('outputs');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const OUTPUT_MP4 = path.join(OUTPUT_DIR, 'EcoVision_AI_Walkthrough.mp4');
const ROOT_MP4 = path.resolve('EcoVision_AI_Walkthrough.mp4');

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function recordWalkthrough() {
  console.log('[1/5] Launching Chrome Browser...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-gpu',
      '--window-size=1440,900',
      '--disable-notifications'
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log(`[2/5] Navigating to ${APP_URL}...`);
  await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 45000 });
  await page.waitForSelector('.stApp', { timeout: 20000 });
  await sleep(4000);

  console.log('[3/5] Attaching Chrome DevTools Protocol (CDP) screencast...');
  const client = await page.target().createCDPSession();

  let currentFrameBuffer = null;
  client.on('Page.screencastFrame', async ({ data, sessionId }) => {
    currentFrameBuffer = Buffer.from(data, 'base64');
    try {
      await client.send('Page.screencastFrameAck', { sessionId });
    } catch (e) {}
  });

  await client.send('Page.startScreencast', {
    format: 'jpeg',
    quality: 90,
    everyNthFrame: 1
  });

  while (!currentFrameBuffer) {
    await sleep(25);
  }

  const FPS = 20;
  console.log(`[4/5] Spawning FFmpeg encoder (h264_mf) -> ${OUTPUT_MP4}...`);
  const ffmpeg = spawn(FFMPEG_PATH, [
    '-y',
    '-f', 'image2pipe',
    '-vcodec', 'mjpeg',
    '-framerate', String(FPS),
    '-i', '-',
    '-c:v', 'h264_mf',
    '-b:v', '4M',
    '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart',
    OUTPUT_MP4
  ]);

  ffmpeg.stderr.on('data', (d) => {
    const msg = d.toString();
    if (msg.includes('Error') || msg.includes('error')) {
      console.error('[FFmpeg stderr]', msg);
    }
  });

  const intervalMs = Math.round(1000 / FPS);
  const frameInterval = setInterval(() => {
    if (currentFrameBuffer && ffmpeg.stdin.writable) {
      ffmpeg.stdin.write(currentFrameBuffer);
    }
  }, intervalMs);

  console.log('[5/5] Executing Detailed Feature Walkthrough Choreography...');

  try {
    // ================= SCENE 1: Header & Bento Grid Overview (0s - 14s) =================
    console.log('  -> Scene 1: Command Header & Live Telemetry Bento Grid...');
    await sleep(2500);

    // Hover smoothly over each Bento Card
    const cards = await page.$$('.glass-card');
    console.log(`Found ${cards.length} cards`);
    if (cards.length > 0) {
      const box0 = await cards[0].boundingBox();
      if (box0) await page.mouse.move(box0.x + box0.width / 2, box0.y + box0.height / 2);
      await sleep(2000);
    }
    if (cards.length > 1) {
      const box1 = await cards[1].boundingBox();
      if (box1) await page.mouse.move(box1.x + box1.width / 2, box1.y + box1.height / 2);
      await sleep(2000);
    }
    if (cards.length > 2) {
      const box2 = await cards[2].boundingBox();
      if (box2) await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
      await sleep(2000);
    }
    if (cards.length > 3) {
      const box3 = await cards[3].boundingBox();
      if (box3) await page.mouse.move(box3.x + box3.width / 2, box3.y + box3.height / 2);
      await sleep(2000);
    }

    // ================= SCENE 2: Sidebar Parameters & Atmospheric Profiles (14s - 30s) =================
    console.log('  -> Scene 2: Sidebar Station Selection & Atmospheric Generator...');
    await page.mouse.move(160, 200);
    await sleep(1500);

    // Interact with Select Tehsil
    const selectBoxes = await page.$$('div[data-baseweb="select"]');
    if (selectBoxes.length > 0) {
      console.log('Clicking Tehsil selectbox...');
      await selectBoxes[0].click();
      await sleep(1500);
      await page.keyboard.press('ArrowDown');
      await sleep(600);
      await page.keyboard.press('ArrowDown');
      await sleep(600);
      await page.keyboard.press('Enter');
      await sleep(3000); // Allow Streamlit to re-run and show new station metrics
    }

    // Interact with Atmospheric Profile dropdown
    if (selectBoxes.length > 1) {
      console.log('Clicking Atmospheric Profile dropdown...');
      await selectBoxes[1].click();
      await sleep(1500);
      await page.keyboard.press('ArrowDown');
      await sleep(600);
      await page.keyboard.press('Enter'); // Select Cyclonic Storm
      await sleep(3500); // Watch numbers jump in Bento Grid!
    }

    // ================= SCENE 3: Tab 1 - Geospatial Catchment Radar & Telemetry (30s - 50s) =================
    console.log('  -> Scene 3: Tab 1 — Geospatial Catchment Radar & Telemetry Stream...');
    const tabs = await page.$$('[role="tab"]');
    console.log(`Found ${tabs.length} tabs`);

    if (tabs.length > 0) {
      await tabs[0].click();
      await sleep(1500);
    }

    // Scroll to Map
    await page.evaluate(() => window.scrollBy({ top: 380, behavior: 'smooth' }));
    await sleep(3000);

    // Hover across map locations
    await page.mouse.move(680, 520);
    await sleep(2000);
    await page.mouse.move(780, 480);
    await sleep(2000);
    await page.mouse.move(620, 560);
    await sleep(2000);

    // Scroll down to Active Node Telemetry Dossier & Telemetry Table
    await page.evaluate(() => window.scrollBy({ top: 400, behavior: 'smooth' }));
    await sleep(3500);

    // Hover over table rows
    await page.mouse.move(650, 750);
    await sleep(2500);

    // ================= SCENE 4: Tab 2 - 7-Day Trajectory & What-If Sandbox (50s - 75s) =================
    console.log('  -> Scene 4: Tab 2 — 7-Day Trajectory & What-If Cloudburst Sandbox...');
    await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'smooth' }));
    await sleep(1500);

    if (tabs.length > 1) {
      console.log('Clicking Tab 2: 7-Day Trajectory & What-If...');
      await tabs[1].click();
      await sleep(3000);

      // Scroll to 7-day chart
      await page.evaluate(() => window.scrollBy({ top: 180, behavior: 'smooth' }));
      await sleep(2500);

      // Hover over chart data points
      await page.mouse.move(580, 380);
      await sleep(1500);
      await page.mouse.move(720, 380);
      await sleep(1500);
      await page.mouse.move(860, 380);
      await sleep(1500);

      // Scroll down to What-If Sandbox
      await page.evaluate(() => window.scrollBy({ top: 340, behavior: 'smooth' }));
      await sleep(2500);

      // Interact with Slider 1: Cloudburst Downpour
      const sliderThumbs = await page.$$('[role="slider"]');
      console.log(`Found ${sliderThumbs.length} slider thumbs`);
      if (sliderThumbs.length > 0) {
        const thumb0Box = await sliderThumbs[0].boundingBox();
        if (thumb0Box) {
          await page.mouse.move(thumb0Box.x + thumb0Box.width / 2, thumb0Box.y + thumb0Box.height / 2);
          await sleep(800);
          await page.mouse.down();
          await page.mouse.move(thumb0Box.x + 160, thumb0Box.y, { steps: 15 });
          await page.mouse.up();
          await sleep(2500); // Watch simulation outcome recalculate!
        }
      }

      // Interact with Slider 2: Topographic Slope (LS)
      if (sliderThumbs.length > 1) {
        const thumb1Box = await sliderThumbs[1].boundingBox();
        if (thumb1Box) {
          await page.mouse.move(thumb1Box.x + thumb1Box.width / 2, thumb1Box.y + thumb1Box.height / 2);
          await sleep(800);
          await page.mouse.down();
          await page.mouse.move(thumb1Box.x + 100, thumb1Box.y, { steps: 12 });
          await page.mouse.up();
          await sleep(2500); // Watch critical erosion outcome update!
        }
      }
    }

    // ================= SCENE 5: Tab 3 - TreeSHAP Explainability Receipts (75s - 98s) =================
    console.log('  -> Scene 5: Tab 3 — TreeSHAP Explainability Receipts & Beeswarm...');
    await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'smooth' }));
    await sleep(1500);

    if (tabs.length > 2) {
      console.log('Clicking Tab 3: TreeSHAP Explainability Receipt...');
      await tabs[2].click();
      await sleep(3000);

      // Scroll to Waterfall Plot & Factor Attribution
      await page.evaluate(() => window.scrollBy({ top: 160, behavior: 'smooth' }));
      await sleep(2500);

      // Hover over waterfall horizontal bars
      await page.mouse.move(560, 360);
      await sleep(1500);
      await page.mouse.move(560, 420);
      await sleep(1500);

      // Hover over Itemized Table on right
      await page.mouse.move(960, 360);
      await sleep(2000);

      // Scroll down to Global TreeSHAP Beeswarm Plot & Feature Importance
      await page.evaluate(() => window.scrollBy({ top: 380, behavior: 'smooth' }));
      await sleep(3500);

      // Hover on beeswarm
      await page.mouse.move(600, 600);
      await sleep(2000);
    }

    // ================= SCENE 6: Tab 4 - RUSLE Soil Physics & Interventions (98s - 120s) =================
    console.log('  -> Scene 6: Tab 4 — RUSLE Soil Physics & Advisory Bulletin...');
    await page.evaluate(() => window.scrollTo({ top: 200, behavior: 'smooth' }));
    await sleep(1500);

    if (tabs.length > 3) {
      console.log('Clicking Tab 4: RUSLE Soil Physics & Interventions...');
      await tabs[3].click();
      await sleep(3000);

      // Scroll to Gauge Indicator & Remediation Dispatch
      await page.evaluate(() => window.scrollBy({ top: 160, behavior: 'smooth' }));
      await sleep(2500);

      // Hover over gauge needle and threshold
      await page.mouse.move(520, 360);
      await sleep(2000);

      // Hover over Remediation Protocol and Farmer Advisory Bulletin
      await page.mouse.move(960, 360);
      await sleep(2500);

      await page.evaluate(() => window.scrollBy({ top: 200, behavior: 'smooth' }));
      await sleep(2500);
    }

    // ================= SCENE 7: Closing Grand Vista (120s - 126s) =================
    console.log('  -> Scene 7: Smooth scroll back to top vista...');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    await sleep(3500);

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
        console.log(`FFmpeg closed with exit code ${code}`);
        resolve();
      });
    });

    if (fs.existsSync(OUTPUT_MP4)) {
      // Copy to root as well
      fs.copyFileSync(OUTPUT_MP4, ROOT_MP4);
      const stats = fs.statSync(OUTPUT_MP4);
      console.log(`✅ COMPLETE DETAILED VIDEO GENERATED:`);
      console.log(`   - ${OUTPUT_MP4} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
      console.log(`   - ${ROOT_MP4} (${(stats.size / (1024 * 1024)).toFixed(2)} MB)`);
    } else {
      console.error('❌ Failed to create video file.');
    }
  }
}

recordWalkthrough().catch(err => {
  console.error('Fatal recording error:', err);
  process.exit(1);
});
