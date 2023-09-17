import { Events } from "discord.js";

const name = Events.ClientReady;
const once = true;

/**
 * @param {import("discord.js").Client} client
 */
const execute = async (client) => {
	console.log(`ready! logged in as ${client.user.tag}`);

	const guild = client.guilds.resolve("1048181529085497444");
	const members = await guild.members.fetch();
	members.each(member => {
		member.roles.cache.forEach(role => console.log(member.displayName, role.name));
	});
};
export { name, once, execute };