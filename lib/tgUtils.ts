const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token) {
  console.log("TELEGRAM_BOT_TOKEN is missing!");
}
export const TELEGRAM_BASE_URL = `https://api.telegram.org/bot${token}`;

let cachedBotUsername: string | null = null;
let loadingPromise: Promise<string> | null = null;

export async function getBotUsername(): Promise<string> {
  if (cachedBotUsername) {
    return cachedBotUsername;
  }

  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = fetchBotUsername();

  try {
    const username = await loadingPromise;
    cachedBotUsername = username;
    return username;
  } finally {
    loadingPromise = null;
  }
}

async function fetchBotUsername(): Promise<string> {
  const response = await fetch(`${TELEGRAM_BASE_URL}/getMe`);
  const data = await response.json();

  if (!data.ok) {
    throw new Error(`Failed to get bot info: ${JSON.stringify(data)}`);
  }

  return data.result.username;
}

export async function sendTelegramMessage(
  chatId: number | bigint | string,
  message: string,
) {
  await fetch(`${TELEGRAM_BASE_URL}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: String(chatId), text: message }),
  });
}
