// =============================================================
//  インフォメーション（!更新 で定型Embedを投稿）
//   - mainInfo : インフォメーションチャンネル用
//   - checkInfo: インフォメーション確認用チャンネル用
// =============================================================
const discord = require('discord.js');

// 共通のアスキーアート説明
const ASCII = `───
　　D　i　s　c　o　r　d　無　双　編
　　　開　　　　　幕　　　　　だ
　　ｎ:　　　　　 ＿＿＿　　　　 ｎ:
　　|｜　　　 ／　＿＿　＼　　　 .|｜
　　|｜　　　 |　|(ﾟ)　(ﾟ)|　|　　 　|｜
　ｆ｢| |^ﾄ　　 ヽ　￣￣￣　 /　　｢| |^|’|
　|: ::　 ! ]　　　　￣□￣ 　　　 | !　 : ::]
　 ヽ　　,ｲ　 ／￣￣ハ￣￣＼　 ヽ　　ｲ
  .`;

const HAJIMETE = `
<#887195825200058389>
初めに自分の好きなジャンル・ゲームを選択してください。それにより対戦募集やチーム募集、はたまた救援や突発飯や旅の際にメンションが送れるようになります。たまに設定項目増えるので時折確認してもらえると。

<#887186017763881041>
オンライン対戦系で何かしら募集や部屋IDの共有をする場合は、 上記チャンネルを使用してください。

<#887668967911608330>
事前に予定している計画などはこちらにまとまってます。スレッド形式なので中身まで確認してもらえると。
.`;

const INFO_IMAGE = 'https://umamusume-umapyoi.com/wp-content/uploads/2021/07/fb5a6d2a1e77ac1f70d91eb662cb4365.jpg';

// インフォメーションチャンネルの !更新
async function mainInfo(message, cfg, client) {
  if (message.channel.id !== cfg.channels.information) return false;
  if (message.content !== '!更新') return false;

  const beforeMessage = await message.channel.messages.fetch({ before: message.id, limit: 1 })
    .then((messages) => messages.first())
    .catch(console.error);
  if (beforeMessage) beforeMessage.delete();
  message.delete();

  const embed = new discord.MessageEmbed()
    .setTitle('インフォメーション')
    .setDescription(ASCII)
    .addField('───お知らせ', `
エリコちゃんbotのバージョン引き上げ
ステージチャンネル追加
チャンネル周り整理
.`)
    .addField('───チャンネルの使い方', `
📢 インフォメーション こ↑こ↓
✅ あなたの設定 - 初めに設定してね
💬 本スレ - メイン雑談ch
🎤 総合音声通話 - メイン音声通話ch
💩 チラシの裏 - チラシの裏
.`)
    .addField('───はじめての人向け', HAJIMETE)
    .setImage(INFO_IMAGE)
    .setColor('ff0000')
    .setTimestamp();
  message.channel.send({ embeds: [embed] });
  return true;
}

// インフォメーション確認用チャンネルの !更新
function checkInfo(message, cfg) {
  if (message.channel.id !== cfg.channels.informationCheck) return false;
  if (message.content !== '!更新') return false;

  message.delete();
  const embed = new discord.MessageEmbed()
    .setTitle('インフォメーション')
    .setDescription(ASCII)
    .addField('───お知らせ', `
インフォメーションをエリコちゃんbotに統合したよ
本スレに貼られた食べログ情報の倉庫を追加したよ
各種メディア関係のリンクにいいね追加したよ
ブレードストレンジャーズ　DOAXVV
.`)
    .addField('───チャンネルの使い方', `
📢 インフォメーション こ↑こ↓
✅ あなたの設定 - 初めに設定してね
💬 本スレ - メイン雑談ch
🎤 グループ音声通話 - メイン音声通話ch
💩 チラシの裏 - チラシの裏
.`)
    .addField('───はじめての人向け', HAJIMETE)
    .addField('───エリコちゃんbotに実装されてる機能', `
・帰宅と言ったらおかえりと言ってくれる機能
・各種メディアにイイネリアクションが自動でつく機能
・食べログのURLが貼られたら食の倉庫にまとめる機能
・DOAXVVを紹介する機能
・ブレードストレンジャーズを紹介する機能
・プリコネのクリティカル率を計算する機能
・プリコネの持ち越しTLを書き直してくれる機能
.`)
    .setImage(INFO_IMAGE)
    .setColor('ff0000')
    .setTimestamp();
  message.channel.send({ embeds: [embed] });
  return true;
}

module.exports = { mainInfo, checkInfo };
