import { about } from "../commands/about.js";
import { downgrade } from "../commands/downgrade.js";
import { checkLanding } from "../commands/check-landing.js";
import { clear } from "../commands/clear.js";
import { viewPromotionPoints } from "../commands/view-promotion-points.js";
import { giveReputationPoint } from "../commands/give-reputation-point.js";
import { viewReputationPoints } from "../commands/view-reputation-points.js";
import { customChannels } from "../resources/custom-channels.js";
import { EmbedBuilder } from "discord.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { customPoints } from "../resources/custom-points.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const interactionCreate = async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const customChannel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.public);
    const customRole = getCustomRole(interaction.member);

    let interactionChannel = undefined;
    let isValidCommand = true;
    let embedMessage = new EmbedBuilder();

    if (interaction.channel.isThread()) {
      interactionChannel = interaction.channel.parent.name;
    } else {
      interactionChannel = interaction.channel.name;
    }

    if (interaction.commandName === "about") {
      about(interaction);
    } else if (interaction.commandName === "check-landing") {
      checkLanding(interaction);
    } else if (interaction.commandName === "clear") {
      clear(interaction);
    } else if (interaction.commandName === "downgrade") {
      downgrade(interaction);
    } else if (interaction.commandName === "give-reputation-point") {
      giveReputationPoint(interaction);
    } else if (interaction.commandName === "view-promotion-points") {
      viewPromotionPoints(interaction);
    } else if (interaction.commandName === "view-reputation-points") {
      viewReputationPoints(interaction);
    } else {
      isValidCommand = false;
      console.error(`no command matching ${interaction.commandName} was found`);
      return interaction.reply({ content: `invalid command /${interaction.commandName}`, ephemeral: true });
    }

    if (isValidCommand) {
      interaction.client.emit("activity", interaction.member, customPoints.interactionCreate);

      embedMessage
        .setTitle("⚙️ command")
        .setDescription(`${customRole} *${interaction.member}* used */${interaction.commandName}* in *${interactionChannel}*`)
        .addFields({ name: "promotion points", value: `+${customPoints.interactionCreate} ⭐`, inline: true })
        .addFields({ name: "to", value: `${interaction.member}`, inline: true })
        .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(customRole.color);

      customChannel.send({ embeds: [embedMessage] });
    }
  }
};

export { interactionCreate };