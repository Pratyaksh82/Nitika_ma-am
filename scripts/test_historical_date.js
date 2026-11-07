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

  const initialDate = await page.evaluate(() => {
    const input = document.querySelector('[data-testid="stDateInput"] input');
    return input ? input.value : null;
  });
  console.log('Initial date:', initialDate);

  // Click on date input and press Down arrow or type
  const input = await page.$('[data-testid="stDateInput"] input');
  await input.click();
  await new Promise(r => setTimeout(r, 500));
  
  // Use keyboard backspace and type
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press('Backspace');
  }
  await page.keyboard.type('1998/08/15');
  await page.keyboard.press('Enter');
  await new Promise(r => setTimeout(r, 3000));

  const afterDate = await page.evaluate(() => {
    const input = document.querySelector('[data-testid="stDateInput"] input');
    const metric = document.querySelector('.glass-metric-val');
    const footer = document.querySelector('.metric-footer-pill');
    return {
      date: input ? input.value : null,
      metric: metric ? metric.innerText.trim() : null,
      footer: footer ? footer.innerText.trim() : null
    };
  });
  console.log('After typing 1998/08/15 (Historical IMD match):', afterDate);

  await browser.close();
})();
