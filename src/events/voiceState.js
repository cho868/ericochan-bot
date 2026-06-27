// =============================================================
//  voiceStateUpdate: 通話の開始・終了を通知
//   「総合音声通話」VCに最初の1人が入ったら開始通知、
//   無人になったら終了通知を「ボット通知」チャンネルへ送る
// =============================================================
const { nowJstStr } = require('../util');

function register(client, cfg, messaging) {
  client.on('voiceStateUpdate', (oldState, newState) => {
    // どこにも居なかった人が、どこかのVCに入った
    if ((oldState.channelId === null || oldState.channelId === undefined) && newState.channelId !== undefined) {
      // そのVCの人数が1人（通話を始めた瞬間）
      if (newState.channel.members.size == 1) {
        // 総合音声通話のみ通知
        if (newState.channel.id == cfg.channels.voiceMain) {
          client.channels.cache.get(cfg.channels.info).send({
            embeds: [{
              color: 0x0099ff,
              author: { name: '通話開始' },
              fields: [
                { name: '開始チャンネル', value: newState.member.voice.channel.name + '', inline: true },
                { name: '始めた人', value: newState.member.user.username + '様', inline: true },
                { name: '開始時刻', value: nowJstStr() + '', inline: true },
              ],
            }],
          });

          newState.member.voice.channel.createInvite({ maxAge: '0' })
            .then(() => messaging.sendMsg(
              cfg.channels.info,
              `<@&${cfg.roles.vcAnnounce}> クスクス…今宵も喋り場が開演しましたわ…`
            ));
        }
      }
    }
    // VCから抜けて、どこにも居なくなった
    else if ((newState.channelId === null || newState.channelId === undefined) && oldState.channelId !== undefined) {
      console.log('ボイチャ終了？');
      if (oldState.channel.members.size == 0) {
        if (oldState.channel.id == cfg.channels.voiceMain) {
          client.channels.cache.get(cfg.channels.info).send({
            embeds: [{
              color: 0x99ff00,
              author: { name: '通話終了' },
              fields: [
                { name: '開始チャンネル', value: oldState.channel.name + '', inline: true },
                { name: '終了時刻', value: nowJstStr() + '', inline: true },
              ],
            }],
          });
        }
      }
    }
  });
}

module.exports = { register };
