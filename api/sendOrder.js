export default async function handler(req, res) {
  const token = process.env.TELEGRAM_TOKEN;
  const chatId = process.env.CHAT_ID_ADMIN;

  const pesan = req.body?.pesan || "Ada pesanan baru dari Ladang Vape!";

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: pesan })
    });

    const data = await response.json();
    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}
