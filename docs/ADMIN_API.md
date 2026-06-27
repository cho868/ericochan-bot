# 管理API 仕様書（ポータル管理画面むけ）

ポータルサイト（別プロジェクト / `/var/www/portal`）の管理画面から、
Botの設定を**再起動なしで**変更するためのHTTP APIです。Botと同じVPS上で動いている前提。

- ベースURL: `http://localhost:3000`（Botの内蔵HTTPサーバー）
- 認証: `.env` の `ADMIN_KEY` を設定し、リクエストで一致させる
  - ヘッダー `x-admin-key: <ADMIN_KEY>` または クエリ `?key=<ADMIN_KEY>`
  - `ADMIN_KEY` 未設定だと `/admin/*` は全て 403（無効）
- 形式: JSON

> 🔐 セキュリティ：`:3000` は **localhost からのみ**アクセスできるようにしてください
> （外部公開しない）。ポータルは **サーバー側（PHP/Node等）から localhost:3000 を中継**し、
> `ADMIN_KEY` はサーバー側に隠してください。ブラウザのJSから直接叩く場合のみ
> `.env` の `ADMIN_CORS_ORIGIN` に許可オリジンを設定します（その場合キーが露出しがちなので非推奨）。

---

## エンドポイント

### 現在の設定を取得
```
GET /admin/settings
x-admin-key: <ADMIN_KEY>
```
レスポンス: 設定オブジェクト（下記スキーマ）をそのまま返す。

### 設定を部分更新（即時反映）
```
POST /admin/settings
x-admin-key: <ADMIN_KEY>
Content-Type: application/json

{ "activity": { "name": "新しいステータス" } }
```
- 送ったキーだけが上書きされる（**部分更新／ディープマージ**）。送らないキーは現状維持。
- レスポンス: `{ "ok": true, "settings": { ...更新後... } }`
- ステータス変更はその場でBotに反映。機能ON/OFF・文面は次のイベントから反映。

### 設定ファイルを読み直す
```
POST /admin/reload
x-admin-key: <ADMIN_KEY>
```
ポータルが `data/settings.json` を直接書き換えた場合に、Botへ読み直しを促す。

---

## 設定スキーマ（`data/settings.json`）

```json
{
  "activity": {
    "name": "レジェンドオブアストルム",
    "type": "PLAYING"
  },
  "features": {
    "homecoming": true,
    "youtubeReaction": true,
    "attachmentReaction": true,
    "games": true,
    "tabelog": true,
    "onsen": true,
    "coin": true,
    "voiceNotify": true,
    "gas": false
  },
  "messages": {
    "wakeup": "クスクス…お目覚めですか？",
    "vcOpen": "クスクス…今宵も喋り場が開演しましたわ…",
    "unknownCommand": "そのコマンドはないですね… !helpで使えるコマンドが見れますよ"
  }
}
```

### 項目の意味

| パス | 種類 | 説明 | 反映 |
| --- | --- | --- | --- |
| `activity.name` | 文字列 | ステータスの文言（「○○をプレイ中」の○○） | 即時 |
| `activity.type` | 文字列 | `PLAYING`/`STREAMING`/`LISTENING`/`WATCHING`/`COMPETING` | 即時 |
| `features.homecoming` | 真偽 | 帰宅→おかえり | 次イベント |
| `features.youtubeReaction` | 真偽 | YouTube URLに❤️ | 次イベント |
| `features.attachmentReaction` | 真偽 | 添付に❤️ | 次イベント |
| `features.games` | 真偽 | DOAXVV/ブレードストレンジャーズ紹介 | 次イベント |
| `features.tabelog` | 真偽 | 食べログ自動仕分け | 次イベント |
| `features.onsen` | 真偽 | 温泉URL収集（Puppeteer） | 次イベント |
| `features.coin` | 真偽 | コイントス | 次イベント |
| `features.voiceNotify` | 真偽 | 通話開始/終了通知 | 次イベント |
| `features.gas` | 真偽 | LINE/GAS連携 | 次イベント |
| `messages.wakeup` | 文字列 | お目覚めメッセージ文面 | 次回送信時 |
| `messages.vcOpen` | 文字列 | 通話開演アナウンス文面 | 次回送信時 |
| `messages.unknownCommand` | 文字列 | 未知コマンドの返答 | 次イベント |

> IDの編集（チャンネル等）は影響が大きいため、現状は `.env` 管理（変更時は再起動）です。
> 管理画面からのID編集はフェーズ2として、この設定スキーマに `ids` を追加して対応予定。

---

## 呼び出し例

### curl
```bash
# 取得
curl -H "x-admin-key: $ADMIN_KEY" http://localhost:3000/admin/settings

# ステータス変更
curl -X POST -H "x-admin-key: $ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"activity":{"name":"おそうじ中","type":"PLAYING"}}' \
  http://localhost:3000/admin/settings

# 機能OFF
curl -X POST -H "x-admin-key: $ADMIN_KEY" -H "Content-Type: application/json" \
  -d '{"features":{"onsen":false}}' \
  http://localhost:3000/admin/settings
```

### PHP（ポータルがPHPの場合・サーバー側中継）
```php
$ch = curl_init('http://localhost:3000/admin/settings');
curl_setopt_array($ch, [
  CURLOPT_POST => true,
  CURLOPT_HTTPHEADER => ['x-admin-key: '.getenv('BOT_ADMIN_KEY'), 'Content-Type: application/json'],
  CURLOPT_POSTFIELDS => json_encode(['activity' => ['name' => $_POST['status']]]),
  CURLOPT_RETURNTRANSFER => true,
]);
$res = curl_exec($ch);
```
