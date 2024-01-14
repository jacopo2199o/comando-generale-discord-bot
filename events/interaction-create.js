import { EmbedBuilder } from "discord.js";
import { about } from "../commands/about.js";
import { chartPromotionPoints } from "../commands/chart-promotion-points.js";
import { checkLanding } from "../commands/check-landing.js";
import { clear } from "../commands/clear.js";
import { downgrade } from "../commands/downgrade.js";
import { giveReputationPoint } from "../commands/give-reputation-point.js";
import { save } from "../commands/save.js";
import { viewPromotionPoints } from "../commands/view-promotion-points.js";
import { viewReputationPoints } from "../commands/view-reputation-points.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";

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
    } else if (interaction.commandName === "chart-promotion-points") {
      chartPromotionPoints(interaction);
    } else if (interaction.commandName === "check-landing") {
      checkLanding(interaction);
    } else if (interaction.commandName === "clear") {
      clear(interaction);
    } else if (interaction.commandName === "downgrade") {
      downgrade(interaction);
    } else if (interaction.commandName === "give-reputation-point") {
      giveReputationPoint(interaction);
    } else if (interaction.commandName === "save") {
      save(interaction);
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
        .addFields({ name: "promotion points", value: `${customPoints.interactionCreate} ⭐`, inline: true })
        .addFields({ name: "to", value: `${interaction.member}`, inline: true })
        .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(customRole.color);

      customChannel.send({ embeds: [embedMessage] });
    }
  }
};

export { interactionCreate };
