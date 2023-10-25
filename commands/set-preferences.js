import { ChannelType, SlashCommandBuilder } from "discord.js";
import { communities } from "../events/ready.js";

const cooldown = 4; // modificalo per sbloccare il comando ogni ora
const data = new SlashCommandBuilder()
  .setName("set-preferences")
  .setDescription("set preferences for log channel and base role")
  .addChannelOption(option => option
    .setName("log-channel")
    .setDescription("log channel for notifications")
    .setRequired(true)
    .addChannelTypes(ChannelType.GuildText))
  .addRoleOption(option => option
    .setName("base-role")
    .setDescription("base role for new members")
    .setRequired(true))
  .addNumberOption(option => option
    .setName("start-points")
    .setDescription("start points for base role")
    .setRequired(true)
    .setMinValue(1)
    .setMaxValue(1000000));

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
    const preferences = ((logChannel, baseRole, startPoints) => {
      return Object.freeze({
        logChannel: interaction.options.getChannel(logChannel),
        baseRole: interaction.options.getRole(baseRole),
        startPoints: interaction.options.getNumber(startPoints)
      });
    })("log-channel", "base-role", "start-points");
    return community.activity.setPreferences(
      preferences.logChannel,
      preferences.baseRole,
      preferences.startPoints
    );
  })();

  if (set === "success") {
    await interaction.editReply("preferences saved");
  } else {
    await interaction.editReply("something went wrong");
  }
};

export {
  cooldown,
  data,
  execute
};