// api/create-order.js
export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }
  if (req.method !== 'POST') return res.status(405).json({ ok:false, error:'Method not allowed' });

  const payload = req.body;
  if (!payload) return res.status(400).json({ ok:false, error:'Invalid JSON' });

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const ADMIN_CHAT_ID = process.env.ADMIN_CHAT_ID;

  if (!SUPABASE_URL || !SERVICE_KEY || !TELEGRAM_BOT_TOKEN || !ADMIN_CHAT_ID) {
    return res.status(500).json({ ok:false, error:'Server not configured' });
  }

  try {
    // 1) Call Supabase RPC
    const rpcUrl = `${SUPABASE_URL.replace(/\/$/,'')}/rest/v1/rpc/rpc_create_order`;
    const rpcResp = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`
      },
      body: JSON.stringify(payload)
    });
    const rpcJson = await rpcResp.json();
    if (!rpcResp.ok || !rpcJson || rpcJson.error) {
      return res.status(400).json({ ok:false, error: rpcJson.error || rpcJson });
    }

    const orderId = rpcJson.order_id || rpcJson.id || null;
    const total = rpcJson.total || null;

    // 2) Send Telegram message to admin
    let msg = `Pesanan baru\nID: ${orderId}\nCustomer: ${payload.customer_name || '-'}\nNote: ${payload.note || '-'}\nItems:\n`;
    (payload.items || []).forEach(it => {
      msg += `- product_id:${it.product_id} x${it.qty}\n`;
    });
    msg += `\nCek panel untuk detail.`;

    const tgUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await fetch(tgUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ chat_id: ADMIN_CHAT_ID, text: msg })
    });

    return res.status(200).json({ ok:true, order_id: orderId, total, rpc: rpcJson });
  } catch (err) {
    return res.status(500).json({ ok:false, error: err.message || String(err) });
  }
}
