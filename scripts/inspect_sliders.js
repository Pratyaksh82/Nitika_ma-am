const puppeteer = require('puppeteer-core');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--window-size=1440,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.goto('http://localhost:8501', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));

  // Click Tab 2
  const tabs = await page.$$('[role="tab"]');
  await tabs[1].click();
  await new Promise(r => setTimeout(r, 2000));

  // Find sliders
  const sliders = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('[data-testid="stSlider"]')).map((s, idx) => ({
      index: idx,
      label: s.querySelector('label')?.innerText.trim(),
      val: s.querySelector('[role="slider"]')?.getAttribute('aria-valuenow')
    }));
  });
  console.log('Sliders in Tab 2:', sliders);

  await browser.close();
})();
