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

  console.log('Testing clicking calendar button...');
  const calBtn = await page.$('button[data-testid="stDateInputCalendarButton"]');
  if (calBtn) {
    await calBtn.click();
    await new Promise(r => setTimeout(r, 1000));
    console.log('Calendar dialog opened!');
    // Click a day button inside the calendar
    const dayButtons = await page.$$('div[role="dialog"] [role="gridcell"]');
    console.log(`Found ${dayButtons.length} gridcells in calendar!`);
    if (dayButtons.length > 10) {
      console.log('Clicking day cell 20...');
      await dayButtons[20].click();
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  const afterVal = await page.evaluate(() => {
    const hidden = document.querySelector('input[type="date"]');
    const metric = document.querySelector('.glass-metric-val');
    return { date: hidden ? hidden.value : null, metric: metric ? metric.innerText.trim() : null };
  });
  console.log('After calendar cell click:', afterVal);

  await browser.close();
})();
