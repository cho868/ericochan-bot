// =============================================================
//  プリコネ用コマンド（! で始まるコマンド）
//   !help / !クリティカル / !持ち越し / !ばんぴっく / それ以外
// =============================================================
const discord = require('discord.js');

const DEFAULT_TIME = 90;

// ソルコンクリ抽選
function lotterylunacri(arr, weight) {
  let totalWeight = 0;
  for (let i = 0; i < weight.length; i++) totalWeight += weight[i];
  let random = Math.floor(Math.random() * totalWeight);
  for (let i = 0; i < weight.length; i++) {
    if (random < weight[i]) return arr[i];
    random -= weight[i];
  }
  console.log('lottery error');
}

function handle(message) {
  const [command, ...args] = message.content.slice('!'.length).split(/\s/);
  const num1 = Number(args[0]);

  // !help : コマンド説明
  if (command === 'help') {
    const embed = new discord.MessageEmbed()
      .setTitle('プリコネ用コマンドについて')
      .setDescription('実装済みのコマンドはこちら\n\n───')
      .addField('!クリティカル ［クリティカル値］', '同レベルの相手へのクリティカル率を出します。\nついでにソルコンクリが出るか運試しができます。\n\n───')
      .addField('!持ち越し ［持ち越し秒数］ ［TL］', '持ち越し秒数で再計算したTLを表示します\n\n───')
      .setImage('https://i0.wp.com/purikone-sokuhou.com/wp-content/uploads/YDdCeJ5.jpg')
      .setColor('ff0000')
      .setFooter('クラバトから逃げるな', '');
    message.channel.send({ embeds: [embed] });

  // !クリティカル : クリティカル率を出す
  } else if (command === 'クリティカル') {
    let cri_result = num1 * 0.05;
    const lunacri = 100 - cri_result;
    const arr = ['不正受給成功！ルナの勝ちだよ', '不正受給失敗！ルナの負けだよ'];
    const weight = [cri_result, lunacri];
    const arr_result = lotterylunacri(arr, weight);
    let arr2;
    if (arr_result === '不正受給成功！ルナの勝ちだよ') {
      arr2 = 'https://cdn.wikiwiki.jp/to/w/yabaidesune/%E3%82%AD%E3%83%A3%E3%83%A9%E3%82%AF%E3%82%BF%E3%83%BC/%E3%82%AD%E3%83%A3%E3%83%AB%28%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%A4%E3%83%A4%E3%83%BC%29/::ref/newyearkyaru.gif';
    } else {
      arr2 = 'https://livedoor.blogimg.jp/miniminigob/imgs/b/4/b4444355.jpg';
    }
    cri_result = `クリ率${cri_result}％だったよ`;
    const embed = new discord.MessageEmbed()
      .setTitle(cri_result)
      .setDescription(arr_result)
      .setThumbnail(arr2)
      .setColor('ff0000');
    message.channel.send({ embeds: [embed] });

  // !持ち越し : 持ち越し秒数でTLを再計算
  } else if (command === '持ち越し') {
    const cotime = DEFAULT_TIME - Number(args[0]);
    const re_args = [];
    let re_entry = 0;

    for (let step = 1; step < args.length; step++) {
      if (!args[step].match(/[0-9]/)) {
        // 数字でない場合は表示用配列に文字列を結合
        if (!args[step].match(/\s/)) {
          re_args[re_entry - 1] = re_args[re_entry - 1] + ' ' + args[step];
        }
        continue;
      }
      const tmptime = args[step].split(':');
      tmptime[0] = tmptime[0] * 60; // 分を秒に
      let tmptime2 = (+tmptime[0]) + (+tmptime[1]);

      if (tmptime2 <= cotime) break; // 残り時間が持ち越しより少なければ終了
      tmptime2 = tmptime2 - cotime;

      if (tmptime2 < 60) {
        if (tmptime2 < 10) tmptime2 = '0' + tmptime2;
        re_args[re_entry] = '00:' + tmptime2;
      } else {
        tmptime2 = tmptime2 - 60;
        if (tmptime2 < 10) tmptime2 = '0' + tmptime2;
        re_args[re_entry] = '01:' + tmptime2;
      }
      re_entry++;
    }

    const cordblockcs = '```cs\n';
    const cordblock = '```';
    message.channel.send(cordblockcs + `クスクス… ${args[0]} 秒の持ち越しTLです\n
${re_args.join('\n')} ` + cordblock);

  // !ばんぴっく : ステージBAN/PICK 開始
  } else if (command === 'ばんぴっく') {
    message.reply('```先攻はBANを行うMAPを選択してください```\n1⃣ 終点\n2⃣ 戦場\n3⃣ すま村\n4⃣ ドルピックタウン\n```先攻が選択```')
      .then((replyMessage) => {
        replyMessage.react('1⃣')
          .then(() => replyMessage.react('2⃣'))
          .then(() => replyMessage.react('3⃣'))
          .then(() => replyMessage.react('4⃣'))
          .catch(console.error);
      })
      .catch(console.error);

  // 未知のコマンド
  } else {
    message.channel.send('そのコマンドはないですね… !helpで使えるコマンドが見れますよ');
  }
}

module.exports = { handle };
