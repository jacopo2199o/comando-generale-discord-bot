import { Events } from "discord.js";
import { myTest } from "../testing.js";

const name = Events.ClientReady;
const once = true;

/**
 * @param {import("discord.js").Client} client
 */
const execute = async (client) => {
	console.log(`ready! logged in as ${client.user.tag}`);
	await myTest(client);
};
export { name, once, execute };