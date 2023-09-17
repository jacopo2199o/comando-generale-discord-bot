import { SlashCommandBuilder } from "discord.js";


const cooldown = 4;
const data = new SlashCommandBuilder()
	.setName("check-members")
	.setDescription("check members status role");

/**
 * @param {import("discord.js").Interaction} interaction
 * @param {GuildMember} client
 */
const execute = async (interaction) => {
	await interaction.reply("pong");
};

export { cooldown, data, execute };
