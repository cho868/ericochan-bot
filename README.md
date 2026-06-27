# ericochan-bot

Discord 用のボット。もともと Glitch.com で動かしていたものを、Ubuntu + GitHub 管理に移行したもの。

## 必要なもの

- Node.js 16.6 以上（推奨：20 以上）
- Discord Bot のトークン

## セットアップ手順（Ubuntu）

```bash
# 1. リポジトリを取得
git clone https://github.com/cho868/ericochan-bot.git
cd ericochan-bot

# 2. 依存ライブラリをインストール
npm install

# 3. 環境変数ファイルを用意してトークンを入れる
cp .env.example .env
nano .env   # DISCORD_BOT_TOKEN に実際のトークンを書く

# 4. 起動（Node 20.6 以上なら --env-file で .env を読み込めます）
node --env-file=.env server.js
```

Node のバージョンが 20.6 より古い場合は、`.env` を自動で読み込めないため、
起動前に環境変数を渡してください：

```bash
export DISCORD_BOT_TOKEN="あなたのトークン"
export GAS_URL=""   # 使う場合だけ
npm start
```

## 環境変数

Discordの各種ID（チャンネル・ユーザー・ロール・絵文字）も `.env` で管理しています。
キーの一覧と意味は [docs/IDS.md](docs/IDS.md) を参照。最低限 `DISCORD_BOT_TOKEN` と
各チャンネルIDを入れれば動きます。

| 変数名 | 説明 | 必須 |
| --- | --- | --- |
| `DISCORD_BOT_TOKEN` | Discord Bot のトークン | はい |
| `GAS_URL` | Google Apps Script の URL（LINE 連携用） | いいえ |
| `CRON_KEY` | cron用エンドポイントの合言葉 | いいえ |
| `CH_*` / `VC_*` / `USER_*` / `ROLE_*` / `EMOJI_*` | 各種Discord ID | 機能ごと |

## ディレクトリ構成

```
server.js              エントリポイント（client生成・各moduleの登録・login）
config.js              .env から設定/IDを読み込む
src/
  settings.js          ランタイム設定の保管庫（管理画面から変更／即時反映）
  messaging.js         メッセージ送信ヘルパー
  httpServer.js        死活監視 + cron受け口 + 管理API(/admin/*)
  scheduledMessages.js 定期メッセージの中身
  util.js              純粋ユーティリティ
  events/              ready / voiceState / messageCreate
  features/            機能ごと（games, tabelog, onsen, coin, gas, precone, banpick, ...）
data/                  settings.json（Git管理外・初回起動時に自動生成）
disabled/              眠っている機能（参考用・未使用）
docs/                  ドキュメント
```

## ドキュメント

- [docs/FEATURES.md](docs/FEATURES.md) … 全機能カタログ（稼働中／停止中の区別つき）
- [docs/IDS.md](docs/IDS.md) … 環境変数のID対応表
- [docs/MANUAL.md](docs/MANUAL.md) … 運用・操作マニュアル（起動／停止／更新／cron／トラブル対応）
- [docs/ADMIN_API.md](docs/ADMIN_API.md) … 管理API仕様（ポータル管理画面から設定変更）
- [docs/portal.html](docs/portal.html) … ポータルサイト掲載用のペライチ（コマンド早見表）

## 注意点

- トークンなどの秘密情報は **絶対に Git に上げない**こと（`.env` は `.gitignore` 済み）。
