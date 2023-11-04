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
  const set = (() => {
    const rank = ((role, points) => {
      return {
        role: interaction.options.getRole(role),
        points: interaction.options.getNumber(points)
      };
    })("role", "points");
    return community.activity.setRank(rank.role, rank.points);
  })();

  if (set === "preferences missing") {
    await interaction.editReply("preferences are not available: use /set-preferences");
  } else if(set === "running") {
    await interaction.editReply("activity points is started: stop activity first");
  } else if(set === "equal role") {
    await interaction.editReply("role entered is arlready present");
  } else if(set === "equal points") {
    await interaction.editReply("points entered are equal to another role");
  } else {
    await interaction.editReply("role saved");
  }
};

export {
  cooldown,
  data,
  execute
};