import { SlashCommandBuilder } from "discord.js";
import fs from "node:fs";
import dotenv from "dotenv";

dotenv.config();

const gradicg = [
	["gran generale", "956497551853510657"],
	["generale", "956482376589017151"],
	["gran colonnello", "958332483210997780"],
	["colonnello", "962694733229072384"],
	["gran comandante", "1007289184236613724"],
	["comandante", "1007289333998440568"],
	["tenente", "1072250981888311337"],
	["membro", "1008665802716741733"],
];

const gradijc = [
	["ruolo rosso", "1138015362416390204"],
	["ruolo arancione", "1137408000462688397"],
	["ruolo giallo", "1137407767368433715"],
];

const cooldown = 4;
const data = new SlashCommandBuilder()
	.setName("create-database")
	.setDescription("check members for roles");

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
	await interaction.reply("done");
};

export { cooldown, data, execute };
