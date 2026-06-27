// =============================================================
//  眠っている機能の元コード（参考用・どこからも読み込まれていません）
//  復活させる時は src/features/ に移植し、ID は config.js(.env) に逃がすこと。
//  ※ 一部は discord.js v11 時代の記法（RichEmbed 等）なので v13 用に要調整。
// =============================================================
/* eslint-disable */

// -------------------------------------------------------------
// メンション返答：botにメンションすると「呼びましたか？」
// -------------------------------------------------------------
/*
if (message.mentions.has(client.user)) {
  message.reply('呼びましたか？');
  return;
}
*/

// -------------------------------------------------------------
// トレーニング呼びかけ（毎日14:00）＋ 体重記録スプレッドシート催促
//   ※ 旧 node-cron 記述。Ubuntu cron + /cron/xxx エンドポイント化して復活する
// -------------------------------------------------------------
/*
cron.schedule('0 0 14 * * *', () => client.channels.cache.get(CH_DEVOJAPAN).send(`
<@対象者ID>様、…（メンション列）…
`));
cron.schedule('1 0 14 * * *', () => client.channels.cache.get(CH_DEVOJAPAN).send({
  embeds:[{ title: '体重記録',
            url: 'https://docs.google.com/spreadsheets/d/＜スプレッドシートID＞/edit#gid=1151745458',
            description: 'クスクス…体重の入力は忘れないでくださいね…' }]
}));
*/

// -------------------------------------------------------------
// ダイエットメニュー抽選（毎日22:05想定）
// -------------------------------------------------------------
/*
function sendTrainingMenu(client, cfg) {
  const arr = ["スクワット100回","プランク10分","スクワット50回","腕立て伏せ50回",
               "腹筋50回","スクワット30回","腕立て伏せ30回","腹筋30回"];
  const weight = [5, 5, 10, 10, 10, 20, 20, 20];
  const ret = lotteryByWeight(arr, weight); // src/util.js の関数を利用
  client.channels.cache.get(cfg.channels.devojapan)
    .send("あなた様…今日のダイエットメニューは " + ret + "ですわ");
}
*/

// -------------------------------------------------------------
// 一定間隔メッセージ（setInterval サンプル）
// -------------------------------------------------------------
/*
setInterval(() => {
  const msgChannelId = "＜チャンネルID＞";
  sendMsg(msgChannelId, "!top text");
  console.log('トレンディが更新できたよ');
}, 60 * 60 * 1000);
*/

// -------------------------------------------------------------
// ！ガチャ／おみくじ
// -------------------------------------------------------------
/*
if (message.content.match(/^！ガチャ/) ||
    (message.mentions.has(client.user) && message.content.match(/おみくじ/))) {
  const arr = ["SSR超","SR超","R超","Nぽてと","Nにゃ～ん","Nしゅうまい君","ケインの下痢"];
  const weight = [3, 6, 16, 25, 25, 24, 1];
  const ret = lotteryByWeight(arr, weight);
  message.channel.send(ret);
}
*/

// -------------------------------------------------------------
// 今日も良いペンキ → 天気URL
// -------------------------------------------------------------
/*
if (message.content.match(/今日も良いペンキ/)) {
  message.channel.send("https://tenki.jp/");
}
*/

// -------------------------------------------------------------
// ！今週のレース（netkeiba）  ※ v11記法 RichEmbed → v13は MessageEmbed
// -------------------------------------------------------------
/*
if (message.content === '！今週のレース') {
  const embed = new discord.MessageEmbed()
    .setTitle('netkeiba')
    .setURL('https://race.netkeiba.com/top/')
    .addField('今週のレース', '<#＜チャンネルID＞>')
    .setThumbnail('https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/2010_Kokura_Kinen.jpg/1920px-2010_Kokura_Kinen.jpg')
    .setColor('RANDOM')
    .setTimestamp();
  message.channel.send({ embeds: [embed] });
}
*/

// -------------------------------------------------------------
// Embedサンプル（書き方の参考。v11記法のため v13 では MessageEmbed / {embeds:[...]} に直す）
// -------------------------------------------------------------
/*
if (message.content === '!embed') {
  const embed = new discord.MessageEmbed()
    .setTitle('embedの使い方')
    .setURL('https://example.com/')
    .setDescription('タイトル直下の説明文\nで改行ができるよ')
    .addField('フィールドタイトル', '説明')
    .addField('インライン', '説明', true)
    .setImage('https://example.com/image.jpg')
    .setThumbnail('https://example.com/thumb.jpg')
    .setColor('ff0000')
    .setTimestamp()
    .setFooter('フッターテキスト');
  message.channel.send({ embeds: [embed] });
}
*/
