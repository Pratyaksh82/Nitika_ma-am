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

  const inputEl = await page.$('[data-testid="stDateInput"] input');
  console.log('Clicking date input...');
  await inputEl.click();
  await new Promise(r => setTimeout(r, 500));

  // Press ArrowLeft or ArrowRight to change day or month
  await page.keyboard.press('ArrowUp');
  await new Promise(r => setTimeout(r, 500));
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 3000));

  const valAfter = await page.evaluate(() => {
    return document.querySelector('[data-testid="stDateInput"] input')?.value;
  });
  console.log('Date after ArrowUp + Enter:', valAfter);

  await browser.close();
})();
