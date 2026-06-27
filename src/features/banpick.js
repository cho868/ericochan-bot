// =============================================================
//  !ばんぴっく のリアクション進行（MAP BAN/PICK フロー）
//   1⃣ → 後攻BAN選択 / 2⃣ → 使用MAP選択 / 3⃣ → 攻守選択 / 8⃣ → 決定
//   各ステップで直前メッセージを削除して進める
// =============================================================

async function deleteLatest(reaction) {
  const messages = await reaction.message.channel.messages.fetch({ limit: 1 });
  messages.first().delete()
    .then(() => console.log('最新のメッセージを削除しました。'))
    .catch((error) => console.error('メッセージの削除中にエラーが発生しました:', error));
}

function register(client) {
  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return;

    if (reaction.emoji.name === '1⃣') {
      await deleteLatest(reaction);
      const m = await reaction.message.channel.send('```次に後攻がBANを行うMAPを選択してください```\n2⃣ 戦場\n3⃣ すま村\n4⃣ ドルピックタウン\n```後攻が選択```');
      await m.react('2⃣').then(() => m.react('3⃣')).then(() => m.react('4⃣'));
    }

    if (reaction.emoji.name === '2⃣') {
      await deleteLatest(reaction);
      const m = await reaction.message.channel.send('```次に先攻が残りMAPから使用MAPを選択してください。```\n3⃣ すま村\n4⃣ ドルピックタウン\n```先攻が選択```');
      await m.react('3⃣').then(() => m.react('4⃣'));
    }

    if (reaction.emoji.name === '3⃣') {
      await deleteLatest(reaction);
      const m = await reaction.message.channel.send('```後攻はアタッカーかディフェンダーか選択してください```\n8⃣ アタッカー\n9⃣ ディフェンダー\n```後攻が選択```');
      await m.react('8⃣').then(() => m.react('9⃣'));
    }

    if (reaction.emoji.name === '8⃣') {
      await deleteLatest(reaction);
      await reaction.message.channel.send('MAPはすま村にけってーい！ 後攻チームがアタッカーではじめます。');
    }
  });
}

module.exports = { register };
