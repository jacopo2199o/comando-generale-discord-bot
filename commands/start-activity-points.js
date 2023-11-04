import { SlashCommandBuilder } from "discord.js";
import dotenv from "dotenv";
import { communities } from "../events/ready.js";

dotenv.config();

const cooldown = 4;
const data = new SlashCommandBuilder()
  .setName("start-activity-points")
  .setDescription("start activity points and start monitoring");

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
    await interaction.editReply("preferences are not available: use /set-preferences");
  } else {
    const started = await community.activity.start(interaction.client);

    if (started !== "running") {
      await interaction.editReply("activity points already started: use /stop-activity");
    } else {
      await interaction.editReply("start monitoring");
    }
  }
};

export {
  cooldown,
  data,
  execute
};
