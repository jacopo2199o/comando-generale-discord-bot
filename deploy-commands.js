import { REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "node:fs";
import path from "node:path";

dotenv.config();

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const commands = [];
const commandPath = path.join(dirname, "commands");
const commandFiles = fs.readdirSync(commandPath)
	.filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandPath, file);
	const command = await import(pathToFileURL(filePath));
	if ("data" in command && "execute" in command) {
		commands.push(command.data.toJSON());
	} else {
		console.log(`[warning] the command at ${filePath} is missing required "data" or "execute" property`);
	}
}

const rest = new REST().setToken(process.env.BOT_TOKEN);

(async () => {
	try {
		console.log(`refreshing ${commands.length} application slash commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{ body: commands },
		);

		console.log(`successfully reloaded ${data.length} application slash commands.`);
	} catch (error) {
		console.error(error);
	}
})();