import {
  LibraryItemBarcode,
  LibraryItemDue,
  LibraryItemRow,
  LibraryItemSubtitle,
  LibraryItemTitle,
  LibraryItemVolume,
} from '@pi4/interfaces';
import puppeteer, { Page } from 'puppeteer';

// import { ask } from '../ask';

class Stepper {
  private i = 0;

  get next() {
    return this.i++;
  }
}

const getScreenshots = false;

const logActive = false;

const logStep = (() => {
  if (logActive) {
    return (msg: string) => {
      console.log(msg);
    };
  }
  return (_msg: string) => {};
})();

class ScreenShooter {
  private readonly prefix = new Date().getTime();
  private readonly step = new Stepper();
  constructor(private readonly page: Page, public enabled = true) {}

  async snap(label: string) {
    if (this.enabled) {
      await this.page.screenshot({
        path: `shots/${this.prefix}--${this.step.next}--${label}.png`,
      });
    }
  }
}

// async function hold() {
//   const res = (await ask(`Continue? (Y/n)`)) || 'Y';
//   if (res.toUpperCase() === 'Y') {
//     return;
//   }
//   process.exit(0);
// }

export async function getBooks(card: string, pin: string) {
  logStep(`Launching browser...`);
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--single-process',
    ],
  });
  const page = await browser.newPage();
  await page.goto('https://hpldsierraapp.mylibrary.us/iii/cas/login');
  logStep('  ...done');

  const screenshooter = new ScreenShooter(page);
  screenshooter.enabled = getScreenshots;
  await screenshooter.snap('login');

  logStep(`Logging in...`);
  await page.focus('#code');
  await page.keyboard.type(card);

  await page.focus('#pin');
  await page.keyboard.type(pin);

  await page.click('a[href="#"]');
  // await page.waitForNavigation({ waitUntil: 'networkidle2' });
  await page.waitForTimeout(1000);
  logStep('  ...done');

  await screenshooter.snap('logged-in');

  logStep(`Going to list...`);
  await page.goto('https://hpldsierraapp.mylibrary.us/patroninfo');
  logStep('  ...done');

  await page.waitForTimeout(1000);

  await screenshooter.snap('main-list');

  logStep(`Going to checkout list`);

  const hasCheckoutLink = await page.evaluate(() => {
    const item = document.querySelector('#patButChkouts a');
    return !!item;
  });

  const hasHoldForm = await page.evaluate(() => {
    const item = document.querySelector('#hold_form');
    return !!item;
  });

  if (hasHoldForm) {
    logStep(`Has hold form... exiting with nothing`);
    await browser.close();
    return [];
  }

  async function getItemsOnPage() {
    // await hold();
    return await page.evaluate(() => {
      const books: Omit<LibraryItemRow, 'ownerId'>[] = [];
      // const books: any[] = [];
      const rows = document.querySelectorAll('tr.patFuncEntry');
      for (const row of rows) {
        const titleAndSubtitle = (
          row.querySelector('.patFuncTitleMain')?.innerHTML ?? ''
        ).trim();
        const due = (
          row.querySelector('.patFuncStatus')?.innerHTML ?? ''
        ).trim();
        const barcode = (
          row.querySelector('.patFuncBarcode')?.innerHTML ?? ''
        ).trim() as LibraryItemBarcode;
        const volume = (
          row.querySelector('.patFuncVol')?.innerHTML ?? ''
        ).trim() as LibraryItemVolume;

        const titleSplit = titleAndSubtitle.indexOf('/');
        const title = (
          titleSplit === -1
            ? titleAndSubtitle
            : titleAndSubtitle.substring(0, titleSplit)
        ).trim() as LibraryItemTitle;
        const subtitles = (
          titleSplit === -1 ? '' : titleAndSubtitle.substring(titleSplit + 1)
        )
          .split(';')
          .map(st => st.trim() as LibraryItemSubtitle);

        enum LibraryItemStatus {
          checkedOut = 'checked-out',
          returned = 'returned',
          available = 'available',
          pendingHold = 'pending',
        }

        const status = due.match(/\d+ of \d+ holds/)
          ? LibraryItemStatus.pendingHold
          : LibraryItemStatus.checkedOut;

        const [m, d, y] = due
          .substring(4, 12)
          .split('-')
          .map(x => parseInt(x, 10));
        const dueDate = new Date(y + 2000, m - 1, d)
          .toISOString()
          .substring(0, 10) as LibraryItemDue;
        books.push({
          title,
          subtitles,
          status,
          barcode,
          volume: volume ? volume : undefined,
          due: dueDate,
        });
      }
      return books;
    });
  }

  if (hasCheckoutLink) {
    logStep(`Has checkout link...`);
    await page.click('#patButChkouts a');
    await page.waitForTimeout(1000);
  }

  await screenshooter.snap('checkouts');
  const books = await getItemsOnPage();
  logStep('  ...done');
  await browser.close();
  return books;
}
