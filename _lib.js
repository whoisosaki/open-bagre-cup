const crypto = require('crypto');
const KEY = 'bagre:state';
const URL_ = () => process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = () => process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function redis(cmd) {
  const r = await fetch(URL_(), {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + TOKEN(), 'Content-Type': 'application/json' },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) throw new Error('redis ' + r.status);
  return (await r.json()).result;
}
const sign = (v) => crypto.createHmac('sha256', process.env.SESSION_SECRET || '').update(v).digest('hex');
function makeToken() { const exp = Date.now() + 7 * 864e5; return exp + '.' + sign(String(exp)); }
function isAdmin(req) {
  const m = /(?:^|;\s*)adm=([^;]+)/.exec(req.headers.cookie || '');
  if (!m || !process.env.SESSION_SECRET) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig || +exp < Date.now()) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(exp));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
module.exports = { KEY, redis, makeToken, isAdmin };
