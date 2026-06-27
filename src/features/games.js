// =============================================================
//  ゲーム紹介（特定ワードに反応してEmbedを表示＋DM通知）
// =============================================================
const discord = require('discord.js');

// 「DOAXVV」とだけ書かれたら紹介Embed。handled なら true を返す
function doaxvv(message, client, cfg) {
  if (!message.content.match(/DOAXVV/)) return false;
  if (!message.content.match(/^DOAXVV$/)) return false;

  const embed = new discord.MessageEmbed()
    .setTitle('DEAD OR ALIVE Xtreme Venus Vacation')
    .setURL('https://play-cloud.games.dmm.com/cloudgame/gameplay/doaxvv?_ga=2.115970638.939893061.1631898530-1160256820.1631898530')
    .setDescription('「DEAD OR ALIVE Xtreme」女の子たちと仲良くなって、「ヴィーナスフェス」を盛り上げよう！')
    .setImage('https://doax-venusvacation.jp/wp-content/themes/doax-venusvacation/img/common/og.jpg')
    .setThumbnail('https://pbs.twimg.com/profile_images/1419541272910458884/T8ZGYXev_400x400.png')
    .setColor('ff0000')
    .setFooter('©コーエーテクモゲームス All rights reserved.');
  message.channel.send({ embeds: [embed] });

  const sosinsya = message.author.username;
  if (cfg.users.notify) {
    client.users.cache.get(cfg.users.notify)?.send(sosinsya + 'がDOAXVVに興味があるみたいですよ');
  }
  return true;
}

// 「ブレードストレンジャーズ」「剣騎列伝」とだけ書かれたら紹介Embed。handled なら true
function bladeStrangers(message, client, cfg) {
  if (!message.content.match(/ブレードストレンジャーズ|剣騎列伝/)) return false;
  if (!message.content.match(/^ブレードストレンジャーズ$|^剣騎列伝$/)) return false;

  const embed = new discord.MessageEmbed()
    .setTitle('Blade Strangers（ブレードストレンジャーズ）剣騎列伝')
    .setURL('https://sites.google.com/view/bladestrangers')
    .setDescription('『ブレード ストレンジャーズ』は、スタジオ最前線が開発を手がける格闘ゲームだ。『海腹川背』や『コード・オブ・プリンセス』『洞窟物語』などの両社のタイトルからキャラクターが参戦する。')
    .setImage('http://www.pikii.jp/wp-content/uploads/2018/04/BladeStrangers_%E3%83%91%E3%83%83%E3%82%B1%E3%83%BC%E3%82%B8%E3%82%A2%E3%83%BC%E3%83%88.jpg')
    .setThumbnail('http://www.saizensen.co.jp/szslogo02.png')
    .setColor('ff0000')
    .setFooter('© Nicalis, Inc. © Studio Saizensen Co., Ltd.');
  message.channel.send({ embeds: [embed] });

  const sosinsya = message.author.username;
  if (cfg.users.notify) {
    client.users.cache.get(cfg.users.notify)?.send(sosinsya + 'がブレードストレンジャーズを話題にしていますよ');
  }
  return true;
}

module.exports = { doaxvv, bladeStrangers };
