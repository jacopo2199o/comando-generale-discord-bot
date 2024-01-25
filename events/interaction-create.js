import { EmbedBuilder } from "discord.js";
import { about } from "../commands/about.js";
import { chartGlobalPoints } from "../commands/chart-global-points.js";
import { chartPromotionPoints } from "../commands/chart-promotion-points.js";
import { chartReputationPoints } from "../commands/chart-reputation-points.js";
import { checkLanding } from "../commands/check-landing.js";
import { clear } from "../commands/clear.js";
import { downgrade } from "../commands/downgrade.js";
import { giveReputationPoint } from "../commands/give-reputation-point.js";
import { rollDice } from "../commands/roll-dice.js";
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
    const message = new EmbedBuilder();
    const maker = interaction.member;

    let channelName = undefined;
    let isValidCommand = true;
    let makerRole = undefined;
    let makerPoints = undefined;

    if (maker !== undefined) {
      makerPoints = getCalculatedPoints(
        customPoints.interactionCreate,
        reputationPoints[maker.guild.id][maker.id].points
      );
      makerRole = getCustomRole(maker);
    }

    if (interaction.channel.isThread()) {
      channelName = interaction.channel.parent.name;
    } else {
      channelName = interaction.channel.name;
    }

    if (interaction.commandName === "about") {
      about(interaction);
    } else if (interaction.commandName === "chart-promotion-points") {
      chartPromotionPoints(interaction);
    } else if (interaction.commandName === "chart-reputation-points") {
      chartReputationPoints(interaction);
    } else if (interaction.commandName === "chart-global-points"){
      chartGlobalPoints(interaction);
    } else if (interaction.commandName === "check-landing") {
      checkLanding(interaction);
    } else if (interaction.commandName === "clear") {
      clear(interaction);
    } else if (interaction.commandName === "downgrade") {
      downgrade(interaction);
    } else if (interaction.commandName === "give-reputation-point") {
      giveReputationPoint(interaction);
    } else if (interaction.commandName === "roll-dice") {
      rollDice(interaction);
    } else if (interaction.commandName === "save") {
      save(interaction);
    } else if (interaction.commandName === "view-promotion-points") {
      viewPromotionPoints(interaction);
    } else if (interaction.commandName === "view-reputation-points") {
      viewReputationPoints(interaction);
    } else {
      isValidCommand = false;

      console.error(`no command matching ${interaction.commandName} was found`);

      interaction.reply({ content: `invalid command /${interaction.commandName}`, ephemeral: true });
    }

    if (isValidCommand) {
      interaction.client.emit("activity", interaction.member, makerPoints);

      message
        .setTitle("⚙️ command")
        .setDescription(`${makerRole} *${interaction.member}* used */${interaction.commandName}* in *${channelName}*`)
        .addFields({ name: "promotion points", value: `${makerPoints} ⭐`, inline: true })
        .addFields({ name: "to", value: `${interaction.member}`, inline: true })
        .setThumbnail(interaction.member.displayAvatarURL({ dynamic: true }))
        .setTimestamp()
        .setColor(makerRole.color);

      channel.send({ embeds: [message] });
    }
  } else if (interaction.isButton()) {
    if (interaction.component.customId === "take") {
      takePromotionPoints(interaction);
    }
  }
};

export { interactionCreate };

