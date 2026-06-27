// =============================================================
//  本番のメッセージ処理を集約（帰宅 / DOAXVV / 食べログ）
//  ※ ここでの return は honban 内のみで止める意味（messageCreate全体は止めない）
// =============================================================
const games = require('./games');
const tabelog = require('./tabelog');

function handle(message, client, cfg, messaging, features) {
  // 帰宅 → おかえりリアクション
  if (features.homecoming) {
    // 「帰宅」とだけ書かれた場合
    if (message.content.match(/帰宅/)) {
      if (message.content.match(/^帰宅$/)) {
        message.react(cfg.emojis.okaeri);
        return;
      }
    }
    // 帰宅の絵文字が貼られた場合
    if (cfg.emojis.kitaku && message.content.match(cfg.emojis.kitaku)) {
      message.react(cfg.emojis.okaeri);
      return;
    }
  }

  // DOAXVV 紹介
  if (features.games && games.doaxvv(message, client, cfg)) return;

  // 食べログURL → 地方別チャンネルへ振り分け＋リアクション
  if (features.tabelog && message.content.match(/tabelog.com/)) {
    tabelog.sendtabelog(message, cfg, messaging);
    message.react('❤️')
      .then(() => message.react(cfg.emojis.retweet)); // リツイートマークを表示
  }
}

module.exports = { handle };
