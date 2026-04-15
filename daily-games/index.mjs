// Secrets
const DISCORD_WEBHOOK_DAILY_GAME_URL = process.env.DISCORD_WEBHOOK_DAILY_GAME_URL;
const DISCORD_ROLE_ID_IRL = process.env.DISCORD_ROLE_ID_IRL;

const games = [
  { emoji: "🌍", name: "Travle", url: "https://travle.earth" },
  { emoji: "🗺️", name: "Worldle", url: "https://worldle.teuteuf.fr" },
  { emoji: "🏳️", name: "Flagle", url: "https://www.flagle.io" },
  { emoji: "🍔", name: "Foodguessr", url: "https://foodguessr.com" },
  { emoji: "⚔️", name: "Loldle", url: "https://loldle.net/classic" },
  { emoji: "🔴", name: "Pokedle", url: "https://pokedle.net/classic" },
];

async function sendMessage(content) {
  const res = await fetch(DISCORD_WEBHOOK_DAILY_GAME_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
		content,
		allowed_mentions: {
			parse: ["roles"],
		}
	}),
  });
  if (!res.ok) {
    throw new Error(`Discord API error: ${res.status} ${await res.text()}`);
  }
}
async function main() {
  if (!DISCORD_WEBHOOK_DAILY_GAME_URL) {
    throw new Error("DISCORD_WEBHOOK_DAILY_GAME_URL is not set");
  }
  const today = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  await sendMessage(`**🎮 Daily Games — ${today}**\n<@&${DISCORD_ROLE_ID_IRL}> C'est l'heure de jouer !`);
  // 1 message / game
  for (const game of games) {
    await sendMessage(`${game.emoji} **${game.name}** — ${game.url}`);
    await new Promise((r) => setTimeout(r, 1000));
  }
  console.log(`✅ ${games.length} games posted successfully`);
}
main().catch((err) => {
  console.error(err);
  process.exit(1);
});