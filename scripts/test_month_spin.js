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

  const monthSpan = await page.$('span[data-type="month"]');
  if (monthSpan) {
    console.log('Focusing month span...');
    await monthSpan.click();
    await new Promise(r => setTimeout(r, 300));
    await page.keyboard.press('ArrowDown');
    await new Promise(r => setTimeout(r, 300));
    await page.keyboard.press('ArrowDown');
    await new Promise(r => setTimeout(r, 300));
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 3000));
  }

  const res = await page.evaluate(() => {
    const hidden = document.querySelector('input[type="date"]');
    const m1 = document.querySelector('.glass-metric-val');
    return { date: hidden ? hidden.value : null, metric: m1 ? m1.innerText.trim() : null };
  });
  console.log('Result after month change:', res);

  await browser.close();
})();
