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

  // Function to smoothly scroll stMain
  async function smoothScrollEl(targetY, durationMs) {
    await page.evaluate((target, duration) => {
      return new Promise((resolve) => {
        const el = document.getElementById('stMain') || document.querySelector('[data-testid="stMain"]');
        if (!el) return resolve();
        const start = el.scrollTop;
        const diff = target - start;
        const startTime = performance.now();

        function step(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const ease = progress < 0.5 ? 2 * progress * progress : -1 + (4 - 2 * progress) * progress;
          el.scrollTop = start + diff * ease;
          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(step);
      });
    }, targetY, durationMs);
  }

  console.log('Testing smooth scroll down to 600px...');
  await smoothScrollEl(600, 1500);
  const pos1 = await page.evaluate(() => document.getElementById('stMain').scrollTop);
  console.log('Scroll position after scroll 1:', pos1);

  console.log('Testing smooth scroll down to 1200px...');
  await smoothScrollEl(1200, 1500);
  const pos2 = await page.evaluate(() => document.getElementById('stMain').scrollTop);
  console.log('Scroll position after scroll 2:', pos2);

  console.log('Testing smooth scroll back up to 0px...');
  await smoothScrollEl(0, 1500);
  const pos3 = await page.evaluate(() => document.getElementById('stMain').scrollTop);
  console.log('Scroll position after scroll 3:', pos3);

  await browser.close();
})();
