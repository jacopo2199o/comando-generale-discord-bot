import { Client, Collection, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages
	]
});

const commandsPath = path.join(dirname, "commands");
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));
const eventPath = path.join(dirname, "events");
const eventFiles = fs.readdirSync(eventPath).filter(file => file.endsWith(".js"));

client.commands = new Collection();
client.cooldowns = new Collection();

dotenv.config();

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = await import(pathToFileURL(filePath));
	if ("data" in command && "execute" in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[warning] the command ad ${filePath} is missing required "data" or "execute" property`);
	}
}

for (const file of eventFiles) {
	const filePath = path.join(eventPath, file);
	const event = await import(pathToFileURL(filePath));

	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.BOT_TOKEN);