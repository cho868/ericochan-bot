// =============================================================
//  設定の一元管理
//  Discord の各種ID・トークンは .env から読み込む（ソースに直書きしない）
//  ID が何を指すかは docs/IDS.md を参照
// =============================================================

const config = {
  // 認証
  token: process.env.DISCORD_BOT_TOKEN,
  gasUrl: process.env.GAS_URL || '', // LINE連携用（空なら連携しない）

  // cron（Ubuntu側）から叩くHTTPエンドポイントの合言葉
  cronKey: process.env.CRON_KEY || '',

  // 管理API（ポータルの管理画面用）の認証キー。未設定だと /admin は無効
  adminKey: process.env.ADMIN_KEY || '',
  // 管理APIをブラウザから直接叩く場合のCORS許可オリジン（サーバー側中継なら不要）
  adminCorsOrigin: process.env.ADMIN_CORS_ORIGIN || '',

  // Botのステータス表示（「○○をプレイ中」など）
  activity: {
    name: process.env.BOT_ACTIVITY || 'レジェンドオブアストルム',
    // PLAYING / STREAMING / LISTENING / WATCHING / COMPETING
    type: process.env.BOT_ACTIVITY_TYPE || 'PLAYING',
  },

  // テキスト/ボイスチャンネル
  channels: {
    main: process.env.CH_MAIN,                       // 本スレ
    info: process.env.CH_INFO,                       // ボット通知
    devojapan: process.env.CH_DEVOJAPAN,             // devojapan
    information: process.env.CH_INFORMATION,         // インフォメーション(!更新)
    informationCheck: process.env.CH_INFORMATION_CHECK, // インフォメーション確認用(!更新)
    onsen: process.env.CH_ONSEN,                     // 湯の倉庫
    voiceMain: process.env.VC_MAIN,                  // 総合音声通話(ボイス)
    tabelog: {
      kansai:    process.env.CH_TABELOG_KANSAI,      // 関西
      kanto:     process.env.CH_TABELOG_KANTO,       // 関東
      tohoku:    process.env.CH_TABELOG_TOHOKU,      // 東北・北海道
      hokuriku:  process.env.CH_TABELOG_HOKURIKU,    // 北陸・東海
      chushikoku:process.env.CH_TABELOG_CHUSHIKOKU,  // 四国・中国
      kyushu:    process.env.CH_TABELOG_KYUSHU,      // 九州・沖縄
    },
  },

  // ユーザー
  users: {
    notify: process.env.USER_NOTIFY, // ゲーム話題のDM通知先
  },

  // ロール
  roles: {
    vcAnnounce: process.env.ROLE_VC_ANNOUNCE, // 通話開演アナウンスのメンション先
  },

  // カスタム絵文字（IDのみ。タグは <:name:id> 形式で組み立てる）
  emojis: {
    oissu:   process.env.EMOJI_OISSU,   // おいっす（食べログ/温泉まとめ用）
    okaeri:  process.env.EMOJI_OKAERI,  // おかえりリアクション
    kitaku:  process.env.EMOJI_KITAKU,  // 帰宅絵文字（検知用）
    retweet: process.env.EMOJI_RETWEET, // リツイートマーク
  },
};

// 起動時に未設定の重要項目を警告（致命的でないものは続行する）
function checkConfig() {
  if (!config.token) {
    console.error('[config] DISCORD_BOT_TOKEN が未設定です。Botは起動できません。');
    return false;
  }
  const missing = [];
  const flat = {
    CH_MAIN: config.channels.main,
    CH_INFO: config.channels.info,
    VC_MAIN: config.channels.voiceMain,
  };
  for (const [k, v] of Object.entries(flat)) {
    if (!v) missing.push(k);
  }
  if (missing.length) {
    console.warn('[config] 未設定のID（その機能は動きません）:', missing.join(', '));
  }
  return true;
}

module.exports = { config, checkConfig };
