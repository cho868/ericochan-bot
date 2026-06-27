// =============================================================
//  食べログ機能
//   - tabelog.com のURL → 地名から地方を判定し、対応チャンネルへ転送
//   - !tabelogembed   → 「食の倉庫」カテゴリーの説明Embed
// =============================================================
const discord = require('discord.js');
const { emojiTag } = require('../util');

// 食べログURLを地方ごとのチャンネルへ振り分ける
function sendtabelog(s_message, cfg, messaging) {
  const t = cfg.channels.tabelog;
  // 各チャンネルにURLの地名から割り当てるための判定（※元コードの挙動を保持）
  const kansai_tihou   = '/osaka|kyoto|hyogo|nara|shiga|wakayama/';
  const kanto_tihou    = '/tokyo|kanagawa|saitama|tiba|tochigi|ibaraki|gunma/';
  const touhoku_tihou  = '/hokkaido|aomori|akita|yamagata|iwate|miyagi|hukushima/';
  const hokuriku_tihou = '/aichi|gifu|shizuoka|mie|niigata|yamanashi|nagano|ishikawa|toyama|fukui/';
  const sikoku_tihou   = '/okayama|hiroshima|tottori|shimane|yamaguchi|kagawa|tokushima|ehime|kochi/';
  const kyusyu_tihou   = '/fukuoka|saga|nagasaki|kumamoto|oita|miyazaki|kagoshima|okinawa/';

  if (!s_message.content.match(/tabelog.com/)) return;

  const oissu = emojiTag('oissu', cfg.emojis.oissu);
  const sosinsya = s_message.author.username;
  const body = (id) => messaging.sendMsg(id, oissu + '＜' + sosinsya + 'さんが教えてくれたお店ですよ！ やばいですね☆\n' + s_message.content);

  if (s_message.content.match(kansai_tihou))        body(t.kansai);
  else if (s_message.content.match(kanto_tihou))    body(t.kanto);
  else if (s_message.content.match(touhoku_tihou))  body(t.tohoku);
  else if (s_message.content.match(hokuriku_tihou)) body(t.hokuriku);
  else if (s_message.content.match(sikoku_tihou))   body(t.chushikoku);
  else if (s_message.content.match(kyusyu_tihou))   body(t.kyushu);
}

// !tabelogembed の説明Embed。handled なら true
function tabelogEmbed(message) {
  if (!message.content.match(/!tabelogembed/)) return false;
  message.delete();
  const embed = new discord.MessageEmbed()
    .setTitle('んま～い！　ごはんは命のエネルギー！')
    .setURL('https://www.youtube.com/watch?v=xb9bw8pBE58')
    .setDescription('私達で美食ギルドを結成しませんか？\nみんなで美味しいものを求め、活動するギルドです！')
    .addField('このカテゴリーについて', '本スレに貼られた食べログの情報をまとめちゃいますよー！ 今は貼られたメッセージをコピペするだけですけど、そのうち何か機能を追加するかもしれません！ やばいですね☆')
    .setImage('https://cdn-ak.f.st-hatena.com/images/fotolife/h/hetaretonbo/20180311/20180311072917.jpg')
    .setThumbnail('https://cdn.wikiwiki.jp/to/w/yabaidesune/%E3%82%B9%E3%83%AC%E7%94%BB%E7%BD%AE%E3%81%8D%E5%A0%B4/::ref/%E3%82%8A%E3%81%A0%E3%81%84%E3%81%B663%E8%A9%B1%E3%83%9A%E3%82%B33.jpg')
    .setColor('#f1a2d3')
    .setFooter('© Cygames, Inc.');
  message.channel.send({ embeds: [embed] });
  return true;
}

module.exports = { sendtabelog, tabelogEmbed };
