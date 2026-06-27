// =============================================================
//  エリコちゃんbot エントリポイント
//  各機能は src/ 以下に分割。ID等の設定は config.js（.env）にまとめている。
//  機能の一覧は docs/FEATURES.md、ID対応表は docs/IDS.md を参照。
// =============================================================
const { Client, Intents } = require('discord.js');
const { config, checkConfig } = require('./config');

// 設定チェック（トークン必須）
if (!checkConfig()) {
  process.exit(0);
}

// Discordクライアント生成
const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

// ランタイム設定（管理画面から変更される対象）を読み込む
const settings = require('./src/settings');
settings.load();

// 共通ヘルパー
const messaging = require('./src/messaging')(client);
const scheduled = require('./src/scheduledMessages')(client, config, messaging, settings);

// HTTPサーバー（死活監視 / cron受け口 / 管理API）
require('./src/httpServer')(config, scheduled, settings);

// イベント登録
require('./src/events/ready').register(client, settings);
require('./src/events/voiceState').register(client, config, messaging, settings);
require('./src/events/messageCreate').register(client, config, messaging, settings);
require('./src/features/banpick').register(client);

// ログイン
client.login(config.token);
