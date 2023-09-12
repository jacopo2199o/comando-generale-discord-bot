import { Events } from "discord.js";

export const data = {
	name: Events.ClientReady,
	once: true,
	execute: client => {
		console.log(`ready! logged in as ${client.user.tag}`);
	}
};