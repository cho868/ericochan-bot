// =============================================================
//  温泉URL自動収集
//   http を含むメッセージのリンク先を Puppeteer で開き、
//   本文に温泉系ワードがあれば「湯の倉庫」へ転送する
//   ※ Puppeteer はヘッドレスChromeを起動するため負荷が高い
// =============================================================
const { emojiTag } = require('../util');

function handle(message, cfg, messaging) {
  if (!message.content.match(/http/)) return;

  const onsen_master = message.author.username;

  const searchTerm = 'http';
  const indexOfFirst = message.content.indexOf(searchTerm);
  const indexOflength = message.content.length;

  let indexOflast = message.content.indexOf('\n', indexOfFirst + 1);
  let indexOfspace = message.content.indexOf(' ', indexOfFirst + 1);
  let indexOfbigspace = message.content.indexOf('　', indexOfFirst + 1);

  if (indexOflast === -1) indexOflast = indexOflength;
  if (indexOfspace === -1) indexOfspace = indexOflength;
  if (indexOfbigspace === -1) indexOfbigspace = indexOflength;

  const htmlend = Math.min(indexOflast, indexOfspace, indexOfspace, indexOfbigspace);
  const messageURL = message.content.substring(indexOfFirst, htmlend);

  (async () => {
    let browser;
    try {
      const puppeteer = require('puppeteer'); // 必要になった時だけ読み込む
      const PAPoptions = {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      };
      browser = await puppeteer.launch(PAPoptions);
      const page = await browser.newPage();

      if (messageURL.match(/twitter.com/)) {
        await page.goto(messageURL);
        await page.waitForTimeout(10000);
      } else {
        await page.goto(messageURL, { waitUntil: 'domcontentloaded' });
      }

      const pagesource = await page.content();
      if (pagesource.match(/温泉|秘湯|銭湯|名湯|足湯|スパ銭|サウナ/)) {
        const oissu = emojiTag('oissu', cfg.emojis.oissu);
        messaging.sendMsg(cfg.channels.onsen, oissu + '＜' + onsen_master + 'さんが教えてくれた温泉情報ですよ！ やばいですね☆\n' + messageURL);
      }
    } catch (err) {
      console.error(err);
    } finally {
      if (browser) await browser.close();
    }
  })();
}

module.exports = { handle };
