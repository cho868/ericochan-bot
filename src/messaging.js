// =============================================================
//  メッセージ送信ヘルパー（client に束ねる）
// =============================================================

module.exports = function createMessaging(client) {
  // チャンネルIDを指定してメッセージ送信
  function sendMsg(channelId, text, option = {}) {
    const channel = client.channels.cache.get(channelId);
    if (!channel) {
      console.warn('[messaging] チャンネルが見つかりません:', channelId);
      return;
    }
    channel.send(text, option)
      .then(() => console.log('メッセージ送信: ' + text + JSON.stringify(option)))
      .catch(console.error);
  }

  // メッセージに返信
  function sendReply(message, text) {
    message.reply(text)
      .then(() => console.log('リプライ送信: ' + text))
      .catch(console.error);
  }

  return { sendMsg, sendReply };
};
