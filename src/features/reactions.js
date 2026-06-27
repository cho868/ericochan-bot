// =============================================================
//  自動リアクション（YouTube / 添付ファイル）
// =============================================================

// YouTubeのURLに ❤️。handled なら true（以降の処理を止める）
function youtube(message) {
  if (!message.content.match(/youtu.be|www.youtube.com/)) return false;
  message.react('❤️');
  return true;
}

// 添付ファイルへのリアクション処理。
// 戻り値: 'stop'（画像でない添付なので以降を止める）/ false（続行）
function attachment(message) {
  const file = message.attachments.first();
  if (!file) return false;            // 添付なし → 続行
  if (!file.height && !file.width) return 'stop'; // 画像/動画でない → 止める
  message.react('❤️');               // 画像/動画 → ハート（続行）
  return false;
}

module.exports = { youtube, attachment };
