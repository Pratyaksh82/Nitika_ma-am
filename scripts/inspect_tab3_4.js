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

  const tabs = await page.$$('[role="tab"]');

  // Check Tab 3
  await tabs[2].click();
  await new Promise(r => setTimeout(r, 2000));
  const tab3Text = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1, h2, h3, h4, .stMarkdown, .stPlotlyChart')).map(e => e.innerText || e.className).slice(0, 10);
  });
  console.log('Tab 3 elements:', tab3Text);

  // Check Tab 4
  await tabs[3].click();
  await new Promise(r => setTimeout(r, 2000));
  const tab4Text = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('h1, h2, h3, h4, .stMarkdown, .stPlotlyChart')).map(e => e.innerText || e.className).slice(0, 10);
  });
  console.log('Tab 4 elements:', tab4Text);

  await browser.close();
})();
