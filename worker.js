export default {
  async fetch(request, env) {
    // Sağlık kontrolü
    if (request.method === "GET") return new Response("OK");

    // Telegram update
    const update = await request.json();

    const msg = update?.message?.text || "";
    const chatId = update?.message?.chat?.id;

    // /start gelince DM'e cevap
    if (msg === "/start" && chatId) {
      await tg(env.BOT_TOKEN, "sendMessage", {
        chat_id: chatId,
        text: "✅ Bot çalışıyor (Cloudflare Workers webhook).",
      });
    }

    // DM'de "test" yazınca kanala mesaj at (sinyal testi)
    if (msg.toLowerCase() === "test") {
      await tg(env.BOT_TOKEN, "sendMessage", {
        chat_id: env.TARGET_CHAT_ID, // @kanaladi veya -100...
        text: "🚀 TEST SİNYAL ✅",
      });
    }

    return new Response("ok");
  },
};

async function tg(token, method, payload) {
  const res = await fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
