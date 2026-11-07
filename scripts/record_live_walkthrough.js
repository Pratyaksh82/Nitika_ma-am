/**
 * EcoVision AI • High-Definition Interactive MP4 Walkthrough Video Recorder
 * Truly scrolls the Streamlit main viewport (#stMain) smoothly with requestAnimationFrame
 * Interacts with date picker, atmospheric profile generator, all 4 tabs, sliders, and maps.
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

async function smoothScrollEl(page, targetY, durationMs = 1500) {
  await page.evaluate((target, duration) => {
    return new Promise((resolve) => {
      const el = document.getElementById('stMain') || document.querySelector('[data-testid="stMain"]');
      if (!el) return resolve();
      const start = el.scrollTop;
      const diff = target - start;
      const startTime = performance.now();

      function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
        el.scrollTop = start + diff * ease;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(step);
    });
  }, targetY, durationMs);
}

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
    '-b:v', '4.5M',
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
    // ================= SCENE 1: Header & Bento Grid Overview (0s - 12s) =================
    console.log('  -> Scene 1: Command Header & Live Telemetry Bento Grid...');
    await sleep(2500);

    // Hover smoothly over each Bento Card
    const cards = await page.$$('.glass-card');
    if (cards.length > 0) {
      const box0 = await cards[0].boundingBox();
      if (box0) await page.mouse.move(box0.x + box0.width / 2, box0.y + box0.height / 2);
      await sleep(1500);
    }
    if (cards.length > 1) {
      const box1 = await cards[1].boundingBox();
      if (box1) await page.mouse.move(box1.x + box1.width / 2, box1.y + box1.height / 2);
      await sleep(1500);
    }
    if (cards.length > 2) {
      const box2 = await cards[2].boundingBox();
      if (box2) await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2);
      await sleep(1500);
    }
    if (cards.length > 3) {
      const box3 = await cards[3].boundingBox();
      if (box3) await page.mouse.move(box3.x + box3.width / 2, box3.y + box3.height / 2);
      await sleep(1500);
    }

    // ================= SCENE 2: Sidebar Controls — Tehsil, Date & Weather Changes (12s - 40s) =================
    console.log('  -> Scene 2: Sidebar Station Selection & Date Change & Weather Profile Shock...');
    await page.mouse.move(160, 200);
    await sleep(1000);

    // 1. Change Tehsil from Raisen to Bhopal
    const selectBoxes = await page.$$('div[data-baseweb="select"]');
    if (selectBoxes.length > 0) {
      console.log('    Changing Tehsil to BHOPAL...');
      await selectBoxes[0].click();
      await sleep(1200);
      await page.keyboard.press('ArrowDown');
      await sleep(500);
      await page.keyboard.press('ArrowDown');
      await sleep(500);
      await page.keyboard.press('Enter');
      await sleep(2500); // Watch Bento cards update to Bhopal
    }

    // 2. Change Forecast Date (Month spinbutton from August to June)
    console.log('    Changing Forecast Date month...');
    const monthSpan = await page.$('span[data-type="month"]');
    if (monthSpan) {
      await monthSpan.click();
      await sleep(500);
      await page.keyboard.press('ArrowDown');
      await sleep(400);
      await page.keyboard.press('ArrowDown');
      await sleep(400);
      await page.keyboard.press('Enter');
      await sleep(2500); // Watch seasonal date change take effect
    }

    // 3. Change Atmospheric Profile to Cloudburst Event (Extreme)
    if (selectBoxes.length > 1) {
      console.log('    Selecting Cloudburst Event (Extreme)...');
      await selectBoxes[1].click();
      await sleep(1200);
      await page.keyboard.press('ArrowDown');
      await sleep(500);
      await page.keyboard.press('ArrowDown');
      await sleep(500);
      await page.keyboard.press('Enter');
      await sleep(3500); // Watch rainfall jump to 92mm and cards turn RED!

      // Hover over the red alert bento card
      const alertCards = await page.$$('.glass-card');
      if (alertCards.length > 2) {
        const aBox = await alertCards[2].boundingBox();
        if (aBox) await page.mouse.move(aBox.x + aBox.width / 2, aBox.y + aBox.height / 2);
        await sleep(2000);
      }

      // Now switch to Dry Fallow (Heatwave) to show the contrast!
      console.log('    Selecting Dry Fallow (Heatwave)...');
      await selectBoxes[1].click();
      await sleep(1000);
      await page.keyboard.press('ArrowDown');
      await sleep(400);
      await page.keyboard.press('Enter');
      await sleep(3000); // Watch metrics drop to 0mm and safe status!

      // Reset back to Dynamic Monsoon
      console.log('    Resetting to Dynamic Monsoon...');
      await selectBoxes[1].click();
      await sleep(1000);
      await page.keyboard.press('ArrowUp');
      await sleep(300);
      await page.keyboard.press('ArrowUp');
      await sleep(300);
      await page.keyboard.press('ArrowUp');
      await sleep(300);
      await page.keyboard.press('Enter');
      await sleep(2500);
    }

    // ================= SCENE 3: Tab 1 — Catchment Radar & Full Page Scroll (40s - 65s) =================
    console.log('  -> Scene 3: Tab 1 — Geospatial Catchment Radar & Continuous Smooth Scroll...');
    const tabs = await page.$$('[role="tab"]');
    if (tabs.length > 0) {
      await tabs[0].click();
      await sleep(1500);
    }

    // ACTUALLY SMOOTH SCROLL DOWN TO THE MAP IN #stMain!
    console.log('    Smoothly scrolling down to Watershed Map...');
    await smoothScrollEl(page, 450, 1800);
    await sleep(2500);

    // Hover across the map station pins
    await page.mouse.move(680, 500);
    await sleep(2000);
    await page.mouse.move(780, 460);
    await sleep(2000);
    await page.mouse.move(620, 540);
    await sleep(2000);

    // ACTUALLY SMOOTH SCROLL DOWN TO DOSSIER & REGIONAL TELEMETRY STREAM TABLE!
    console.log('    Smoothly scrolling down to Active Node Dossier & Telemetry Table...');
    await smoothScrollEl(page, 950, 1800);
    await sleep(3000);

    // Hover over table rows
    await page.mouse.move(650, 680);
    await sleep(1500);
    await page.mouse.move(650, 750);
    await sleep(2000);

    // Smooth scroll back to top of tabs
    console.log('    Smoothly scrolling back up to Tabs...');
    await smoothScrollEl(page, 0, 1500);
    await sleep(1500);

    // ================= SCENE 4: Tab 2 — 7-Day Trajectory & What-If Sliders (65s - 90s) =================
    console.log('  -> Scene 4: Tab 2 — 7-Day Trajectory Chart & What-If Cloudburst Sliders...');
    if (tabs.length > 1) {
      await tabs[1].click();
      await sleep(2500);

      // Smooth scroll down to 7-day trajectory chart
      console.log('    Smoothly scrolling to 7-day trajectory chart...');
      await smoothScrollEl(page, 280, 1500);
      await sleep(2500);

      // Hover over forecast bars and soil loss line
      await page.mouse.move(580, 420);
      await sleep(1500);
      await page.mouse.move(720, 420);
      await sleep(1500);
      await page.mouse.move(860, 420);
      await sleep(1500);

      // Smooth scroll down to What-If Sandbox
      console.log('    Smoothly scrolling to What-If Climate Shock Simulator...');
      await smoothScrollEl(page, 620, 1500);
      await sleep(2500);

      // Interact with Slider: Cloudburst Downpour
      const sliderThumbs = await page.$$('[role="slider"]');
      if (sliderThumbs.length > 0) {
        console.log('    Interacting with Cloudburst Downpour slider...');
        const sBox = await sliderThumbs[0].boundingBox();
        if (sBox) {
          await page.mouse.move(sBox.x + sBox.width / 2, sBox.y + sBox.height / 2);
          await sleep(600);
          await page.mouse.down();
          await page.mouse.move(sBox.x + 140, sBox.y, { steps: 15 });
          await page.mouse.up();
          await sleep(2500); // Watch simulation outcome recalculate!
        }
      }

      // Smooth scroll back up to tabs
      await smoothScrollEl(page, 0, 1500);
      await sleep(1500);
    }

    // ================= SCENE 5: Tab 3 — TreeSHAP Receipts & Beeswarm (90s - 115s) =================
    console.log('  -> Scene 5: Tab 3 — TreeSHAP Receipts & Global Beeswarm Plot...');
    if (tabs.length > 2) {
      await tabs[2].click();
      await sleep(2500);

      // Smooth scroll down to Waterfall Chart & Itemized Attribution Table
      console.log('    Smoothly scrolling to TreeSHAP Waterfall & Table...');
      await smoothScrollEl(page, 260, 1500);
      await sleep(2500);

      // Hover over waterfall bars
      await page.mouse.move(560, 400);
      await sleep(1500);
      await page.mouse.move(560, 460);
      await sleep(1500);

      // Hover over table on the right
      await page.mouse.move(960, 400);
      await sleep(2000);

      // Smooth scroll down to Global Beeswarm Plot & Feature Importance
      console.log('    Smoothly scrolling to Global Beeswarm & Feature Importance...');
      await smoothScrollEl(page, 720, 1800);
      await sleep(3500);

      // Hover on beeswarm
      await page.mouse.move(600, 600);
      await sleep(2000);

      // Smooth scroll back up to tabs
      await smoothScrollEl(page, 0, 1500);
      await sleep(1500);
    }

    // ================= SCENE 6: Tab 4 — RUSLE Soil Physics & Interventions (115s - 135s) =================
    console.log('  -> Scene 6: Tab 4 — RUSLE Soil Physics & Advisory Bulletin...');
    if (tabs.length > 3) {
      await tabs[3].click();
      await sleep(2500);

      // Smooth scroll down to Gauge & Advisory Bulletin
      console.log('    Smoothly scrolling to Soil Loss Gauge & Farmer Advisory...');
      await smoothScrollEl(page, 280, 1500);
      await sleep(2500);

      // Hover over gauge indicator
      await page.mouse.move(520, 420);
      await sleep(2000);

      // Hover over Remediation Dispatch & Farmer Bulletin
      await page.mouse.move(960, 420);
      await sleep(2500);

      // Scroll slightly more down to full farmer advisory
      await smoothScrollEl(page, 450, 1200);
      await sleep(2500);

      // Smooth scroll back up to closing vista
      console.log('    Smoothly scrolling back up to top grand vista...');
      await smoothScrollEl(page, 0, 1800);
      await sleep(3000);
    }

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
      fs.copyFileSync(OUTPUT_MP4, ROOT_MP4);
      const stats = fs.statSync(OUTPUT_MP4);
      console.log(`✅ VIDEO GENERATION SUCCESS:`);
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
