import { SlashCommandBuilder } from "discord.js";

const cooldown = 4;
const data = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("replies with pong");

const execute = async (interaction) => {
	await interaction.reply("pong");
};

export {cooldown, data, execute};
