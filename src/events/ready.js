// =============================================================
//  ready: 起動完了時の処理
// =============================================================

function register(client) {
  client.on('ready', () => {
    console.log('Bot準備完了');
    // ステータス表示
    client.user.setActivity('レジェンドオブアストルム', { type: 'PLAYING' });
  });
}

module.exports = { register };
