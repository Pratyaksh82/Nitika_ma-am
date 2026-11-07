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

  const scrollInfo = await page.evaluate(() => {
    const winYBefore = window.scrollY;
    window.scrollBy(0, 500);
    const winYAfter = window.scrollY;

    const mainEl = document.querySelector('section.main') || document.querySelector('.main') || document.querySelector('[data-testid="stAppViewContainer"]');
    let mainScrollBefore = -1, mainScrollAfter = -1;
    if (mainEl) {
      mainScrollBefore = mainEl.scrollTop;
      mainEl.scrollTop += 500;
      mainScrollAfter = mainEl.scrollTop;
    }

    const appView = document.querySelector('[data-testid="stAppViewContainer"]');
    let appViewBefore = -1, appViewAfter = -1;
    if (appView) {
      appViewBefore = appView.scrollTop;
      appView.scrollTop += 500;
      appViewAfter = appView.scrollTop;
    }

    return {
      window: { before: winYBefore, after: winYAfter },
      sectionMain: { found: !!mainEl, before: mainScrollBefore, after: mainScrollAfter },
      appViewContainer: { found: !!appView, before: appViewBefore, after: appViewAfter }
    };
  });

  console.log('Scroll test results:', JSON.stringify(scrollInfo, null, 2));
  await browser.close();
})();
