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

  const scrollableElements = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll('*'));
    return all
      .filter(el => {
        const style = window.getComputedStyle(el);
        const isScrollable = (style.overflowY === 'auto' || style.overflowY === 'scroll') && el.scrollHeight > el.clientHeight;
        return isScrollable;
      })
      .map(el => ({
        tag: el.tagName,
        className: el.className,
        id: el.id,
        testId: el.getAttribute('data-testid'),
        scrollHeight: el.scrollHeight,
        clientHeight: el.clientHeight,
        scrollTop: el.scrollTop
      }));
  });

  console.log('Scrollable elements:', scrollableElements);
  await browser.close();
})();
