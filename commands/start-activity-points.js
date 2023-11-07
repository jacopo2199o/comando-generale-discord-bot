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
  const isInitialized = await community.activity.initialize(interaction.client);

  if (isInitialized === "not ready") {
    await interaction.editReply("preferences are not available: use /set-preferences");
  } else {
    const isStarted = await community.activity.start(interaction.client);

    if (isStarted !== "running") {
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
