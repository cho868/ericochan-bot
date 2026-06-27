// =============================================================
//  ランタイム設定の保管庫（フロント＝ポータルの管理画面から書き換える対象）
//   - data/settings.json に永続化
//   - get() は常に最新を返す（各機能は呼び出し時に参照＝即時反映）
//   - update()/reload() で変更し、onChange でライブ適用（ステータス等）
//  ※ data/settings.json はインスタンス固有なので Git管理外
// =============================================================
const fs = require('fs');
const path = require('path');
const { config } = require('../config');

const FILE = path.join(__dirname, '..', 'data', 'settings.json');

// 初期値（.env / config をベースにする。これが現状の挙動と一致する）
function defaults() {
  return {
    activity: { name: config.activity.name, type: config.activity.type },
    features: {
      homecoming: true,        // 帰宅 → おかえり
      youtubeReaction: true,   // YouTube URL に ❤️
      attachmentReaction: true,// 添付に ❤️
      games: true,             // DOAXVV / ブレードストレンジャーズ紹介
      tabelog: true,           // 食べログ自動仕分け
      onsen: true,             // 温泉URL収集（Puppeteer）
      coin: true,              // コイントス
      voiceNotify: true,       // 通話開始/終了通知
      gas: !!config.gasUrl,    // LINE/GAS連携
    },
    messages: {
      wakeup: 'クスクス…お目覚めですか？',
      vcOpen: 'クスクス…今宵も喋り場が開演しましたわ…',
      unknownCommand: 'そのコマンドはないですね… !helpで使えるコマンドが見れますよ',
    },
  };
}

let current = defaults();
const changeHandlers = [];

// プレーンオブジェクトの深いマージ（配列・プリミティブは上書き）
function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v);
}
function deepMerge(base, patch) {
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const [k, v] of Object.entries(patch || {})) {
    if (isPlainObject(v) && isPlainObject(out[k])) out[k] = deepMerge(out[k], v);
    else out[k] = v;
  }
  return out;
}

function notify() {
  for (const h of changeHandlers) {
    try { h(current); } catch (e) { console.error('[settings] onChange エラー:', e); }
  }
}

function load() {
  try {
    if (fs.existsSync(FILE)) {
      const saved = JSON.parse(fs.readFileSync(FILE, 'utf8'));
      current = deepMerge(defaults(), saved); // 既知キーはデフォルトで補完
    } else {
      save(); // 無ければデフォルトで作成
    }
  } catch (e) {
    console.error('[settings] 読み込み失敗。デフォルトを使用:', e.message);
    current = defaults();
  }
  return current;
}

function save() {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  fs.writeFileSync(FILE, JSON.stringify(current, null, 2));
}

function get() { return current; }

// 部分更新（patchをマージ）→ 保存 → ライブ適用
function update(patch) {
  current = deepMerge(current, patch);
  save();
  notify();
  return current;
}

// ファイルから読み直す（ポータルが直接ファイルを書いた場合用）
function reload() {
  load();
  notify();
  return current;
}

function onChange(fn) { changeHandlers.push(fn); }

module.exports = { load, get, update, reload, onChange, defaults, FILE };
