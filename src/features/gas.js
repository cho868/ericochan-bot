// =============================================================
//  LINE⇔Discord 連携（本スレの発言を GAS 経由でLINEへ転送）
//  GAS_URL が未設定なら何もしない（誤った「更新に失敗しました」連投を防止）
// =============================================================

function send(message, client, cfg) {
  if (!cfg.gasUrl) return; // 連携未設定なら無効

  // LINE Messaging API風の形式に仕立てる（GAS側の場合分けが楽になるように）
  const jsonData = {
    events: [
      {
        type: 'discord',
        name: message.author.username,
        message: message.content,
      },
    ],
  };
  post(cfg.gasUrl, jsonData, message, client);
}

function post(url, data, message, client) {
  const request = require('request');
  const options = {
    uri: url,
    headers: { 'Content-type': 'application/json' },
    json: data,
    followAllRedirects: true,
  };
  request.post(options, function (error, response) {
    if (error != null) {
      message.reply('更新に失敗しました');
      return;
    }
    const userid = response.body.userid;
    const channelid = response.body.channelid;
    const text = response.body.message;
    if (userid != undefined && channelid != undefined && text != undefined) {
      const channel = client.channels.cache.get(channelid);
      if (channel != null) channel.send(text);
    }
  });
}

module.exports = { send };
