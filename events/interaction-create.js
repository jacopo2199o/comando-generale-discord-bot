import { EmbedBuilder } from "discord.js";
import { about } from "../commands/about.js";
import { chartPromotionPoints } from "../commands/chart-promotion-points.js";
import { chartReputationPoints } from "../commands/chart-reputation-points.js";
import { checkLanding } from "../commands/check-landing.js";
import { clear } from "../commands/clear.js";
import { downgrade } from "../commands/downgrade.js";
import { giveReputationPoint } from "../commands/give-reputation-point.js";
import { save } from "../commands/save.js";
import { viewPromotionPoints } from "../commands/view-promotion-points.js";
import { viewReputationPoints } from "../commands/view-reputation-points.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints, getCalculatedPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/general-utilities.js";
import { reputationPoints } from "./ready.js";
import { takePromotionPoints } from "./take-promotion-points.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
const interactionCreate = async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const channel = interaction.guild.channels.cache.find((channel) => channel.name === customChannels.public)
      || interaction.guild.channels.cache.get(interaction.guild.publicUpdatesChannelId);
    const embedMessage = new EmbedBuilder();
    const makerRole = getCustomRole(interaction.member);
    const makerPoints = getCalculatedPoints(
      customPoints.interactionCreate,
      reputationPoints[interaction.member.guild.id][interaction.member.id].points
    );

    let interactionChannel = undefined;
    let isValidCommand = true;


    if (interaction.channel.isThread()) {
      interactionChannel = interaction.channel.parent.name;
    } else {
      interactionChannel = interaction.channel.name;
    }

    if (interaction.commandName === "about") {
      about(interaction);
    } else if (interaction.commandName === "chart-promotion-points") {
      chartPromotionPoints(interaction);
    } else if (interaction.commandName === "chart-reputation-points") {
      chartReputationPoints(interaction);
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
      interaction.client.emit("activity", interaction.member, makerPoints);

      embedMessage
        .setTitle("⚙️ command")
        .setDescription(`${makerRole} *${interaction.member}* used */${interaction.commandName}* in *${interactionChannel}*`)
        .addFields({ name: "promotion points", value: `${makerPoints} ⭐`, inline: true })
        .addFields({ name: "to", value: `${interaction.member}`, inline: true })
        .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(makerRole.color);

      channel.send({ embeds: [embedMessage] });
    }
  } else if (interaction.isButton()) {
    if (interaction.component.customId === "take") {
      takePromotionPoints(interaction);
    }
  }
};

export { interactionCreate };

