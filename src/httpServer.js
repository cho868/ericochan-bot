// =============================================================
//  HTTPサーバー（ポート3000）
//   - GET  /              : 死活監視（"Discord Bot is active now"）
//   - GET  /cron/wakeup   : Ubuntuのcronから叩く定期メッセージ用（要 CRON_KEY）
//   - GET  /admin/settings: 現在の設定を取得（要 ADMIN_KEY）
//   - POST /admin/settings: 設定を部分更新（要 ADMIN_KEY）→ 即時反映
//   - POST /admin/reload  : settings.json を読み直す（要 ADMIN_KEY）
//   - POST /             : 旧 wake 受信（Glitch時代の名残）
//
//  ※ /admin は ADMIN_KEY を設定した時だけ有効。:3000 は localhost 限定での
//    公開を推奨（ポータルはサーバー側から localhost:3000 を中継するのが安全）。
// =============================================================
const http = require('http');
const querystring = require('querystring');

module.exports = function startHttpServer(cfg, scheduled, settings) {
  function setCors(res) {
    if (cfg.adminCorsOrigin) {
      res.setHeader('Access-Control-Allow-Origin', cfg.adminCorsOrigin);
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-admin-key');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    }
  }

  function authOk(req, url) {
    if (!cfg.adminKey) return false; // キー未設定なら管理APIは無効
    const key = req.headers['x-admin-key'] || url.searchParams.get('key');
    return key === cfg.adminKey;
  }

  function sendJson(res, code, obj) {
    res.writeHead(code, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(obj));
  }

  function readBody(req) {
    return new Promise((resolve) => {
      let data = '';
      req.on('data', (c) => { data += c; });
      req.on('end', () => resolve(data));
    });
  }

  http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    setCors(res);

    // CORS プリフライト
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }

    // ---- 管理API ----
    if (url.pathname.startsWith('/admin/')) {
      if (!authOk(req, url)) { sendJson(res, 403, { error: 'forbidden' }); return; }

      if (url.pathname === '/admin/settings' && req.method === 'GET') {
        sendJson(res, 200, settings.get());
        return;
      }
      if (url.pathname === '/admin/settings' && req.method === 'POST') {
        try {
          const body = await readBody(req);
          const patch = body ? JSON.parse(body) : {};
          const updated = settings.update(patch);
          sendJson(res, 200, { ok: true, settings: updated });
        } catch (e) {
          sendJson(res, 400, { error: 'invalid json', detail: e.message });
        }
        return;
      }
      if (url.pathname === '/admin/reload' && req.method === 'POST') {
        sendJson(res, 200, { ok: true, settings: settings.reload() });
        return;
      }
      sendJson(res, 404, { error: 'not found' });
      return;
    }

    // ---- cron 用 ----
    if (req.method === 'GET' && url.pathname === '/cron/wakeup') {
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

    // ---- 旧 wake（POST） ----
    if (req.method === 'POST') {
      const data = await readBody(req);
      if (!data) { res.end('No post data'); return; }
      const dataObject = querystring.parse(data);
      console.log('post:' + dataObject.type);
      res.end();
      return;
    }

    // ---- 死活監視（GET） ----
    if (req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Discord Bot is active now\n');
      return;
    }

    res.writeHead(405);
    res.end();
  }).listen(3000);
  console.log('[http] listening on :3000');
};
