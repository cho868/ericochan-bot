# エリコちゃんbot 運用マニュアル

VPS（Ubuntu）上で常時稼働させる前提の、起動・停止・更新・トラブル対応のまとめです。
機能そのものの一覧は [FEATURES.md](./FEATURES.md) を参照。

---

## 構成・置き場所

| 項目 | 値 |
| --- | --- |
| 設置先 | `/var/common/bot/ericochan-bot` |
| 本体 | `server.js` |
| 秘密情報 | `.env`（Gitには上げない） |
| 常駐方式 | systemd サービス `ericochan-bot.service` |
| GitHub | https://github.com/cho868/ericochan-bot |

### .env に入れる値

| 変数 | 説明 | 必須 |
| --- | --- | --- |
| `DISCORD_BOT_TOKEN` | Discord Botのトークン | はい |
| `GAS_URL` | LINE連携用 Google Apps Script のURL | いいえ |
| `CRON_KEY` | cron用エンドポイントの合言葉（定期メッセージを使う場合） | いいえ |
| `CH_*` ほか各種ID | チャンネル/ユーザー/ロール/絵文字のID（[IDS.md](./IDS.md)参照） | 機能ごと |

---

## 日常の操作（systemd）

```bash
# 状態を見る（active (running) なら稼働中）
sudo systemctl status ericochan-bot

# 起動 / 停止 / 再起動
sudo systemctl start   ericochan-bot
sudo systemctl stop    ericochan-bot
sudo systemctl restart ericochan-bot

# OS再起動時の自動起動を ON / OFF
sudo systemctl enable  ericochan-bot
sudo systemctl disable ericochan-bot
```

## ログの見方

```bash
# リアルタイムでログを流し見（止めるのは Ctrl+C）
journalctl -u ericochan-bot -f

# 直近100行だけ見る
journalctl -u ericochan-bot -n 100
```

`Bot準備完了` が出ていれば正常に起動しています。

---

## コードを更新したいとき

GitHubで修正 → VPSに反映する流れ：

```bash
cd /var/common/bot/ericochan-bot
git pull                              # 最新コードを取得
npm install                           # 依存が増えていれば反映（無ければ一瞬で終わる）
sudo systemctl restart ericochan-bot  # 再起動して反映
```

逆に、VPS上で直接いじった場合は、Gitにコミットして残すのを忘れずに。

---

## 定期実行（cron）の設定

定期メッセージ（毎朝の「お目覚めですか？」など）は、**Botが持つHTTPエンドポイントを
Ubuntuのcronから叩く**方式にしています。Bot本体のJS内ではスケジュールしません。

### 1. 合言葉を設定

`.env` に `CRON_KEY` を設定します（推測されにくい文字列にする）。
未設定だとエンドポイントは無効（403）になります。

```
CRON_KEY=好きな長いランダム文字列
```

設定後はBotを再起動：`sudo systemctl restart ericochan-bot`

### 2. 動作確認

```bash
curl "http://localhost:3000/cron/wakeup?key=好きな長いランダム文字列"
# → wakeup sent と返り、対象チャンネルにメッセージが出ればOK
```

### 3. crontab に登録

```bash
crontab -e
```

末尾に追記（例：毎日 朝7:00 に実行。時刻はサーバーのタイムゾーンに合わせる）：

```cron
0 7 * * * curl -s "http://localhost:3000/cron/wakeup?key=好きな長いランダム文字列" >/dev/null
```

> サーバーのタイムゾーンは `timedatectl` で確認できます。日本時間で動かしたい場合は
> `sudo timedatectl set-timezone Asia/Tokyo` で合わせると分かりやすいです。

新しい定期メッセージを増やしたい時は、`src/scheduledMessages.js` に関数を足し、
`src/httpServer.js` にエンドポイントを1つ追加 → crontabに1行足す、の流れです。

---

## トラブル対応

### 起動しない / すぐ落ちる
```bash
journalctl -u ericochan-bot -n 50   # エラーメッセージを確認
```
- `DISCORD_BOT_TOKENが設定されていません` → `.env` のトークンを確認
- `--env-file` 関連のエラー → Nodeが20.6未満。systemd運用なら `EnvironmentFile` で読むので影響なし

### Botがオンラインにならない
- トークンが正しいか
- Discord開発者ポータルでBotが有効か、必要な権限（Intents）が付いているか

### メッセージに反応しない
- Discord開発者ポータルの **MESSAGE CONTENT INTENT** がONか（メッセージ本文を読むのに必要）
- そのチャンネルIDがコードの想定と一致しているか（[FEATURES.md] の「移行時の注意」参照）

### 動作が重い・落ちる
- URL貼り付け時の温泉収集機能（Puppeteer）がメモリを食います
  ```bash
  free -h   # 空きメモリを確認。少なければ swap 追加を検討
  ```

---

## 困ったら

エラーログ（`journalctl` の出力）をそのまま貼れば、原因の切り分けを手伝えます。
