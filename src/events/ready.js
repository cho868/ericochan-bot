// =============================================================
//  ready: 起動完了時の処理
// =============================================================

function register(client, cfg) {
  client.on('ready', () => {
    console.log('Bot準備完了');
    // ステータス表示（.env の BOT_ACTIVITY / BOT_ACTIVITY_TYPE で変更可）
    client.user.setActivity(cfg.activity.name, { type: cfg.activity.type });
  });
}

module.exports = { register };
