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

  const tabInfo = await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('button[data-baseweb="tab"], [role="tab"]'));
    return tabs.map((t, idx) => ({
      index: idx,
      text: t.innerText.trim(),
      tagName: t.tagName,
      className: t.className
    }));
  });
  console.log('Tabs found in DOM:', tabInfo);

  // Let's test clicking tab 1, 2, 3
  const tabElements = await page.$$('button[data-baseweb="tab"], [role="tab"]');
  console.log('tabElements count:', tabElements.length);

  for (let i = 0; i < tabElements.length; i++) {
    console.log(`Clicking tab ${i}: ${tabInfo[i]?.text}`);
    await tabElements[i].click();
    await new Promise(r => setTimeout(r, 2000));
    const title = await page.evaluate(() => document.body.innerText.slice(0, 300));
    console.log(`Tab ${i} content sample:\n`, title.slice(0, 150));
  }

  await browser.close();
})();
