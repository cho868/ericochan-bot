// =============================================================
//  汎用ユーティリティ（Discordに依存しない純粋関数）
// =============================================================

// 日付を YYYY/MM/DD hh:mm:ss 等の形式に整形（24時間・ゼロ埋め）
function dateToStr24HPad0(date, format) {
  if (!format) format = 'YYYY/MM/DD hh:mm:ss';
  format = format.replace(/YYYY/g, date.getFullYear());
  format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
  format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
  format = format.replace(/hh/g, ('0' + date.getHours()).slice(-2));
  format = format.replace(/mm/g, ('0' + date.getMinutes()).slice(-2));
  format = format.replace(/ss/g, ('0' + date.getSeconds()).slice(-2));
  return format;
}

// 日本時間の現在時刻文字列
function nowJstStr() {
  return dateToStr24HPad0(
    new Date(Date.now() + ((new Date().getTimezoneOffset() + (9 * 60)) * 60 * 1000)),
    'YYYY/MM/DD hh:mm:ss'
  );
}

// 重み付き抽選：当たった要素を返す
function lotteryByWeight(arr, weight) {
  let totalWeight = 0;
  for (let i = 0; i < weight.length; i++) totalWeight += weight[i];
  let random = Math.floor(Math.random() * totalWeight);
  for (let i = 0; i < weight.length; i++) {
    if (random < weight[i]) return arr[i];
    random -= weight[i];
  }
  console.log('lottery error');
}

// カスタム絵文字タグ <:name:id> を組み立てる
function emojiTag(name, id) {
  return `<:${name}:${id}>`;
}

module.exports = { dateToStr24HPad0, nowJstStr, lotteryByWeight, emojiTag };
