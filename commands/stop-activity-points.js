import fs from "node:fs";
import { SlashCommandBuilder } from "discord.js";
import { intervalId, membersActivity } from "./start-activity-points.js";

const fileName = "activity-points.json";
const cooldown = 4;
const data = new SlashCommandBuilder()
	.setName("stop-activity-points")
	.setDescription("save activity points and stop monitoring");

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
	if (intervalId === null) {
		await interaction.reply("activity points is not started: nothing to stop");
		return;
	}
	await interaction.deferReply();
	clearTimeout(intervalId);
	fs.writeFileSync(fileName, JSON.stringify(membersActivity, null, 4));
	await interaction.editReply("activity points saved: stop monitoring");
};

export { cooldown, data, execute };