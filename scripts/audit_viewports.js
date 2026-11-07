const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const URL = 'http://localhost:8501';
const OUTPUT_DIR = path.resolve(__dirname, '..', 'outputs');

const VIEWPORTS = [
  { name: 'Standard_Laptop', width: 1366, height: 768 },
  { name: 'Desktop_FHD', width: 1920, height: 1080 },
  { name: 'Split_Screen', width: 1024, height: 768 }
];

async function run() {
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage']
  });

  for (const vp of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport({ width: vp.width, height: vp.height });
    
    console.log(`Navigating for ${vp.name} (${vp.width}x${vp.height})...`);
    await page.goto(URL, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for Streamlit app and plotly chart to render
    await page.waitForSelector('.stApp', { timeout: 10000 });
    await new Promise(r => setTimeout(r, 3500));

    // Capture standard viewport
    const vpPath = path.join(OUTPUT_DIR, `audit_${vp.name}_${vp.width}x${vp.height}.png`);
    await page.screenshot({ path: vpPath });
    console.log(`  [OK] Saved viewport screenshot: ${vpPath}`);

    // If laptop, also capture full page scroll
    if (vp.name === 'Standard_Laptop') {
      const fullPath = path.join(OUTPUT_DIR, `audit_${vp.name}_fullpage.png`);
      await page.screenshot({ path: fullPath, fullPage: true });
      console.log(`  [OK] Saved full-page screenshot: ${fullPath}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('Visual audit completed successfully!');
}

run().catch(err => {
  console.error('Audit failed:', err);
  process.exit(1);
});

