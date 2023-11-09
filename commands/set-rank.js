import { SlashCommandBuilder } from "discord.js";
import { communities } from "../events/ready.js";

const cooldown = 4; // modificalo per sbloccare il comando ogni ora
const data = new SlashCommandBuilder()
  .setName("set-rank")
  .setDescription("set rank to obtainable roles")
  .addRoleOption(option => option
    .setName("role")
    .setDescription("role that can be obtained")
    .setRequired(true)
  )
  .addNumberOption(option => option
    .setName("points")
    .setDescription("points required for promotion")
    .setMinValue(1)
    .setMaxValue(1000000)
    .setRequired(true)
  );

/**
 * @param {import("discord.js").Interaction} interaction
 */
const execute = async (interaction) => {
  await interaction.deferReply();
  
  /**
   * @type { import("../community.js").Community }
  */
  const community = communities.get(interaction.guildId);
  const isSetted = (() => {
    const rank = ((role, points) => {
      return {
        role: interaction.options.getRole(role),
        points: interaction.options.getNumber(points)
      };
    })("role", "points");
    return community.activity.setRank(rank.role, rank.points);
  })();

  if (isSetted === "preferences missing") {
    await interaction.editReply("preferences are not available: use /set-preferences");
  } else if (isSetted === "running") {
    await interaction.editReply("activity points started: use /stop-activity-points");
  } else if (isSetted === "greater equal base points") {
    await interaction.editReply("points entered are less than or equal base role");
  } else if (isSetted === "equal role") {
    await interaction.editReply("role entered is already present");
  } else if (isSetted === "equal points") {
    await interaction.editReply("points entered are equals to another role");
  } else {
    await interaction.editReply("role saved");
  }
};

export {
  cooldown,
  data,
  execute
};