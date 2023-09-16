import { SlashCommandBuilder } from "discord.js";
import { db } from "../datastore.js";


const cooldown = 4;
const data = new SlashCommandBuilder()
	.setName("ping")
	.setDescription("replies with pong");

/**
 * @param {import("discord.js").Interaction} interaction
 */
const execute = async (interaction) => {
	const document = {
		name: interaction.commandName
	};

	db.insert(document);
	await interaction.reply("pong");

};

export { cooldown, data, execute };
