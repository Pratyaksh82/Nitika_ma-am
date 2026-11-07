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

  const result = await page.evaluate(async () => {
    const main = document.getElementById('stMain') || document.querySelector('[data-testid="stMain"]');
    if (!main) return { error: 'stMain not found' };

    const topBefore = main.scrollTop;
    main.scrollTop = 600;
    const topAfter = main.scrollTop;

    return {
      topBefore,
      topAfter,
      scrollHeight: main.scrollHeight,
      clientHeight: main.clientHeight
    };
  });

  console.log('Test scroll on stMain:', result);
  await browser.close();
})();
