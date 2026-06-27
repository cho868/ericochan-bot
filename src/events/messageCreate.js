// =============================================================
//  messageCreate: メッセージ受信時のメイン処理
//  ※ 判定の順番は元コードの挙動を保持している（早期 return の位置が重要）
// =============================================================
const information = require('../features/information');
const reactions = require('../features/reactions');
const games = require('../features/games');
const honban = require('../features/honban');
const onsen = require('../features/onsen');
const coin = require('../features/coin');
const gas = require('../features/gas');
const precone = require('../features/precone');

function register(client, cfg, messaging) {
  client.on('messageCreate', async (message) => {
    // 永久ループ防止（bot自身・他のbotは無視）
    if (message.author.id == client.user.id || message.author.bot) return;

    // インフォメーション(!更新)
    if (await information.mainInfo(message, cfg, client)) return;

    // YouTube URL → ❤️
    if (reactions.youtube(message)) return;

    // ブレードストレンジャーズ紹介
    if (games.bladeStrangers(message, client, cfg)) return;

    // !tabelogembed
    if (require('../features/tabelog').tabelogEmbed(message)) return;

    // 本番処理（帰宅 / DOAXVV / 食べログ）※ここでは return しない
    honban.handle(message, client, cfg, messaging);

    // 添付ファイルへのリアクション
    if (reactions.attachment(message) === 'stop') return;

    // URL → 温泉情報の収集（非同期・return しない）
    onsen.handle(message, cfg, messaging);

    // インフォメーション確認用(!更新)
    if (information.checkInfo(message, cfg)) return;

    // コイントス（return しない）
    coin.handle(message, client);

    // ---- ここから下は「本スレの通常発言」をGASへ流す処理 ----
    if (message.channel.type == 'dm') return;
    if (message.webhookId) return;
    if (message.mentions.has(client.user)) return;
    if (message.channel.id == cfg.channels.main) gas.send(message, client, cfg);

    // ---- プリコネ用コマンド（! で始まる） ----
    if (!message.content.startsWith('!')) return;
    precone.handle(message);
  });
}

module.exports = { register };
