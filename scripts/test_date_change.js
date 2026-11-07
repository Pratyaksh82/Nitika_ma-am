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

  // Inspect sidebar date input
  const dateInfo = await page.evaluate(() => {
    const dateInput = document.querySelector('[data-testid="stDateInput"] input');
    return {
      found: !!dateInput,
      value: dateInput ? dateInput.value : null
    };
  });
  console.log('Date Input info:', dateInfo);

  // Test typing a new date into the date input
  if (dateInfo.found) {
    const input = await page.$('[data-testid="stDateInput"] input');
    await input.click();
    // Select all and type new date: 2026/07/20
    await page.keyboard.down('Control');
    await page.keyboard.press('KeyA');
    await page.keyboard.up('Control');
    await page.keyboard.type('2026/07/20');
    await page.keyboard.press('Enter');
    console.log('Typed new date: 2026/07/20');
    await new Promise(r => setTimeout(r, 3000));

    const newMetricVal = await page.evaluate(() => {
      const m1 = document.querySelector('.glass-metric-val');
      return m1 ? m1.innerText.trim() : null;
    });
    console.log('New Daily Precipitation Metric Value after date change:', newMetricVal);
  }

  await browser.close();
})();
