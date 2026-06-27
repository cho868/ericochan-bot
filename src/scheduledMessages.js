// =============================================================
//  定期メッセージ
//  実際の時刻トリガーは Ubuntu の cron から HTTP で叩く（httpServer.js 参照）
//  ここには「送る中身」だけを置く
// =============================================================

module.exports = function createScheduledMessages(client, cfg, messaging) {
  // 毎朝のお目覚めメッセージ（旧 cron '0 0 22 * * *' 相当）
  function wakeup() {
    messaging.sendMsg(cfg.channels.info, 'クスクス…お目覚めですか？');
  }

  // ここに今後の定期メッセージを追加していく
  // 例: function trainingMenu() { ... }

  return { wakeup };
};
