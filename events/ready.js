import { Events } from "discord.js";

const name = Events.ClientReady;
const once = true;

const execute = (client) => {
	console.log(`ready! logged in as ${client.user.tag}`);
};

export { name, once, execute };