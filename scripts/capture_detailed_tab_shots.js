const puppeteer = require('puppeteer-core');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const APP_URL = 'http://localhost:8501';
const OUTPUT_DIR = path.resolve('outputs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function capture() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--window-size=1600,1050']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1050 });

  console.log('Navigating to app...');
  await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
  await page.waitForSelector('.stApp', { timeout: 15000 });
  await sleep(4000);

  // Tab buttons: let's query all buttons
  const buttons = await page.evaluate(() => {
    const elList = Array.from(document.querySelectorAll('button[data-baseweb="tab"], [role="tab"], div[data-testid="stTabs"] button'));
    return elList.map(e => ({ text: e.innerText.trim(), tag: e.tagName }));
  });
  console.log('Found tab elements:', buttons);

  const tabButtons = await page.$$('button[data-baseweb="tab"], [role="tab"]');
  console.log('tabButtons count:', tabButtons.length);

  // 1. Header & Bento
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'screen_header_bento.png'),
    clip: { x: 330, y: 0, width: 1250, height: 420 }
  });
  console.log('Captured screen_header_bento.png');

  // 2. Tab 1: Spatial Radar
  await page.evaluate(() => window.scrollTo(0, 260));
  await sleep(1500);
  await page.screenshot({
    path: path.join(OUTPUT_DIR, 'screen_tab1_spatial.png'),
    clip: { x: 330, y: 260, width: 1250, height: 750 }
  });
  console.log('Captured screen_tab1_spatial.png');

  // 3. Tab 2: Trajectory & What-If
  if (tabButtons.length > 1) {
    await tabButtons[1].click();
    await sleep(3000);
    await page.evaluate(() => window.scrollTo(0, 260));
    await sleep(1000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'screen_tab2_trajectory.png'),
      clip: { x: 330, y: 260, width: 1250, height: 780 }
    });
    console.log('Captured screen_tab2_trajectory.png');
  }

  // 4. Tab 3: TreeSHAP Receipts
  if (tabButtons.length > 2) {
    await tabButtons[2].click();
    await sleep(3000);
    await page.evaluate(() => window.scrollTo(0, 260));
    await sleep(1000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'screen_tab3_treeshap.png'),
      clip: { x: 330, y: 260, width: 1250, height: 780 }
    });
    console.log('Captured screen_tab3_treeshap.png');
  }

  // 5. Tab 4: RUSLE Soil Physics
  if (tabButtons.length > 3) {
    await tabButtons[3].click();
    await sleep(3000);
    await page.evaluate(() => window.scrollTo(0, 260));
    await sleep(1000);
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'screen_tab4_rusle.png'),
      clip: { x: 330, y: 260, width: 1250, height: 780 }
    });
    console.log('Captured screen_tab4_rusle.png');
  }

  await browser.close();
  console.log('All tab screenshots complete!');
}

capture().catch(console.error);
