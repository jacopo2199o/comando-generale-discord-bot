import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import { communities } from "../events/ready.js";

dotenv.config();

const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("start-activity-points")
  .setDescription("set initial activity points and start monitoring");

/**
 * @param {import("discord.js").Interaction} interaction
*/
const execute = async (interaction) => {
  await interaction.deferReply();

  /**
   * @type { import("../community.js").Community }
   */
  const community = communities.get(interaction.guildId);
  const initialized = await community.activity.initialize(interaction.client);

  if (initialized === "not ready") {
    await interaction.editReply("settings are not available: use /setup-activity-points");
  } else {
    const started = community.activity.start(interaction.client);
    if (started === "not stopped") {
      await interaction.editReply("activity points created: start monitoring...");
    } else {
      await interaction.editReply("activity points already started: stop activity first");
    }
  }

};

export {
  cooldown,
  data,
  execute
};
