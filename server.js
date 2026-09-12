import { createServer } from 'node:http';
import { createState, publicState, queueActions, step } from './src/engine.js';

let state = createState();
const send = (res, code, body) => { res.writeHead(code, {'Content-Type':'application/json; charset=utf-8','Access-Control-Allow-Origin':'*','Access-Control-Allow-Methods':'GET,POST,OPTIONS','Access-Control-Allow-Headers':'Content-Type'}); res.end(JSON.stringify(body)); };
const readJson = req => new Promise((resolve, reject) => { let raw = ''; req.on('data', chunk => { raw += chunk; if (raw.length > 100_000) reject(new Error('Request body too large')); }); req.on('end', () => { try { resolve(raw ? JSON.parse(raw) : {}); } catch { reject(new Error('Invalid JSON')); } }); req.on('error', reject); });

createServer(async (req, res) => {
  if (req.method === 'OPTIONS') return send(res, 204, {});
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (req.method === 'GET' && url.pathname === '/api/state') return send(res, 200, publicState(state));
    const body = await readJson(req);
    if (req.method === 'POST' && url.pathname === '/api/reset') { state = createState(body.seed); return send(res, 200, publicState(state)); }
    if (req.method === 'POST' && url.pathname === '/api/actions') { const actions = Array.isArray(body.actions) ? body.actions : [body]; const result = queueActions(state, actions); return send(res, result.rejected.length ? 422 : 202, {...result, pendingActions:state.pendingActions.length}); }
    if (req.method === 'POST' && url.pathname === '/api/step') { const days = Math.min(365, Math.max(1, Number(body.days) || 1)); for (let day = 0; day < days; day++) state = step(state); return send(res, 200, publicState(state)); }
    return send(res, 404, {error:'Not found'});
  } catch (error) { return send(res, 400, {error:error.message}); }
}).listen(process.env.PORT || 3001, () => console.log(`Simulator API listening on http://localhost:${process.env.PORT || 3001}`));
