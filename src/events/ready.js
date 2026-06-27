// =============================================================
//  ready: 起動完了時の処理
//  ステータスは settings から取得し、管理画面で変更されたら即時反映する
// =============================================================

function register(client, settings) {
  function applyActivity() {
    if (!client.user) return;
    const a = settings.get().activity;
    client.user.setActivity(a.name, { type: a.type });
  }

  client.on('ready', () => {
    console.log('Bot準備完了');
    applyActivity();
  });

  // 管理画面でステータスが変わったら、再起動なしで反映
  settings.onChange(applyActivity);
}

module.exports = { register };
