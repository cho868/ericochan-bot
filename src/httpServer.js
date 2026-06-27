// =============================================================
//  HTTPサーバー（ポート3000）
//   - GET /            : 死活監視（"Discord Bot is active now"）
//   - GET /cron/wakeup : Ubuntuのcronから叩く定期メッセージ用（要 CRON_KEY）
//   - POST             : 旧 wake 受信（Glitch時代の名残）
// =============================================================
const http = require('http');
const querystring = require('querystring');

module.exports = function startHttpServer(cfg, scheduled) {
  http.createServer((req, res) => {
    if (req.method == 'POST') {
      let data = '';
      req.on('data', (chunk) => { data += chunk; });
      req.on('end', () => {
        if (!data) { res.end('No post data'); return; }
        const dataObject = querystring.parse(data);
        console.log('post:' + dataObject.type);
        res.end();
      });
      return;
    }

    if (req.method == 'GET') {
      const url = new URL(req.url, 'http://localhost');

      // cron 用エンドポイント（CRON_KEY が設定され、一致した時だけ実行）
      if (url.pathname === '/cron/wakeup') {
        if (!cfg.cronKey || url.searchParams.get('key') !== cfg.cronKey) {
          res.writeHead(403, { 'Content-Type': 'text/plain' });
          res.end('forbidden\n');
          return;
        }
        scheduled.wakeup();
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('wakeup sent\n');
        return;
      }

      // 死活監視
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Discord Bot is active now\n');
      return;
    }

    res.writeHead(405);
    res.end();
  }).listen(3000);
  console.log('[http] listening on :3000');
};
