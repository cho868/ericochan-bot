// =============================================================
//  定期メッセージ
//  実際の時刻トリガーは Ubuntu の cron から HTTP で叩く（httpServer.js 参照）
//  文面は settings から取得（管理画面で変更可能）
// =============================================================

module.exports = function createScheduledMessages(client, cfg, messaging, settings) {
  // 毎朝のお目覚めメッセージ（旧 cron '0 0 22 * * *' 相当）
  function wakeup() {
    messaging.sendMsg(cfg.channels.info, settings.get().messages.wakeup);
  }

  // ここに今後の定期メッセージを追加していく
  return { wakeup };
};
