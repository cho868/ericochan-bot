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

// 共通ヘルパー
const messaging = require('./src/messaging')(client);
const scheduled = require('./src/scheduledMessages')(client, config, messaging);

// HTTPサーバー（死活監視 / cron受け口）
require('./src/httpServer')(config, scheduled);

// イベント登録
require('./src/events/ready').register(client, config);
require('./src/events/voiceState').register(client, config, messaging);
require('./src/events/messageCreate').register(client, config, messaging);
require('./src/features/banpick').register(client);

// ログイン
client.login(config.token);
