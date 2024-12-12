import {
  EmbedBuilder
} from "discord.js";
import {
  about
} from "../commands/about.js";
import {
  chartGlobalPoints
} from "../commands/chart-global-points.js";
import {
  chartPromotionPoints
} from "../commands/chart-promotion-points.js";
import {
  chartReputationPoints
} from "../commands/chart-reputation-points.js";
import {
  chartSeniorityPoints
} from "../commands/chart-seniority-points.js";
import {
  checkMembers
} from "../commands/check-members.js";
import {
  clear
} from "../commands/clear.js";
import {
  cooldown
} from "../commands/cooldown.js";
import {
  givePromotionPoints
} from "../commands/give-promotion-points.js";
import {
  giveReputationPoint
} from "../commands/give-reputation-point.js";
import {
  rollDice
} from "../commands/roll-dice.js";
import {
  save
} from "../commands/save.js";
import {
  transfer
} from "../commands/transfer.js";
import {
  viewPromotionPoints
} from "../commands/view-promotion-points.js";
import {
  viewReputationPoints
} from "../commands/view-reputation-points.js";
import {
  customChannels
} from "../resources/custom-channels.js";
import {
  customPoints,
  getCalculatedPoints
} from "../resources/custom-points.js";
import {
  getCustomRole
} from "../resources/custom-roles.js";
import {
  reputationPoints
} from "./ready.js";
import {
  takePromotionPoints
} from "./take-promotion-points.js";
import {
  join
} from "../commands/map game/mg-join.js";
import {
  takeProvince
} from "../commands/map game/mg-take-province.js";
import {
  viewProfile
} from "../commands/map game/mg-view-profile.js";
import {
  viewMap
} from "../commands/map game/mg-view-map.js";
import {leaderboard} from "../commands/map game/mg-leaderboard.js";
import {changeColor} from "../commands/map game/mg-change-color.js";
import {viewProvince} from "../commands/map game/mg-view-province.js";
import {changeNickname} from "../commands/map game/mg-change-nickname.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function interactionCreate(
  interaction
) {
  if (
    interaction.guild === null
  ) {
    const invite = "https://discord.com/api/oauth2/authorize?client_id=1149977789496311888&permissions=8&scope=bot";
    await interaction.deferReply();
    await interaction.editReply(
      `my commands work only into servers - invite link: ${invite}`
    );
    return;
  }
  if (
    interaction.isChatInputCommand()
  ) {
    const maker = interaction.member;
    if (
      maker === undefined
    ) {
      return console.error(
        "interaction create: maker undefined"
      );
    }
    const makerRole = getCustomRole(
      maker
    );
    if (
      makerRole === undefined
    ) {
      return console.error(
        "interaction create: maker role undefined"
      );
    }
    const makerPoints = getCalculatedPoints(
      customPoints.interactionCreate,
      reputationPoints[maker.guild.id][maker.id].points
    );
    const channelName = interaction.channel.name;
    const threadName = interaction.channel.parent.name;
    let isValidCommand = true;
    if (
      interaction.commandName === "about"
    ) {
      about(
        interaction
      );
    } else if (
      interaction.commandName === "chart-promotion-points"
    ) {
      chartPromotionPoints(
        interaction
      );
    } else if (
      interaction.commandName === "chart-reputation-points"
    ) {
      chartReputationPoints(
        interaction
      );
    } else if (
      interaction.commandName === "chart-global-points"
    ) {
      chartGlobalPoints(
        interaction
      );
    } else if (
      interaction.commandName === "chart-seniority-points"
    ) {
      chartSeniorityPoints(
        interaction
      );
    } else if (
      interaction.commandName === "check-members"
    ) {
      checkMembers(
        interaction
      );
    } else if (
      interaction.commandName === "clear"
    ) {
      clear(
        interaction
      );
    } else if (
      interaction.commandName === "cooldown"
    ) {
      cooldown(
        interaction
      );
    } else if (
      interaction.commandName === "give-promotion-points"
    ) {
      givePromotionPoints(
        interaction
      );
    } else if (
      interaction.commandName === "give-reputation-point"
    ) {
      giveReputationPoint(
        interaction
      );
    } else if (
      interaction.commandName === "roll-dice"
    ) {
      rollDice(
        interaction
      );
    } else if (
      interaction.commandName === "save"
    ) {
      save(
        interaction
      );
    } else if (
      interaction.commandName === "transfer"
    ) {
      transfer(
        interaction
      );
    } else if (
      interaction.commandName === "view-promotion-points"
    ) {
      viewPromotionPoints(
        interaction
      );
    } else if (
      interaction.commandName === "view-reputation-points"
    ) {
      viewReputationPoints(
        interaction
      );
    } else if (
      interaction.commandName === "mg-join"
    ) {
      join(
        interaction
      );
    } else if (
      interaction.commandName === "mg-take-province"
    ) {
      takeProvince(
        interaction
      );
    } else if (
      interaction.commandName === "mg-view-profile"
    ) {
      viewProfile(
        interaction
      );
    } else if (
      interaction.commandName === "mg-view-map"
    ) {
      viewMap(
        interaction
      );
    } else if (
      interaction.commandName === "mg-leaderboard"
    ) {
      leaderboard(
        interaction
      );
    } else if (
      interaction.commandName === "mg-change-color"
    ) {
      changeColor(
        interaction
      );
    } else if (
      interaction.commandName === "mg-change-nickname"
    ) {
      changeNickname(
        interaction
      );
    } else if (
      interaction.commandName === "mg-view-province"
    ) {
      viewProvince(
        interaction
      );
    } else {
      interaction.reply(
        {
          content: `invalid command */${interaction.commandName}*`,
          ephemeral: true
        }
      );
      console.error(
        `no command matching ${interaction.commandName} was found`
      );
      isValidCommand = false;
    }
    if (
      isValidCommand === true &&
      channelName !== customChannels.internal
    ) {
      interaction.client.emit(
        "activity",
        interaction.member,
        makerPoints
      );
      const message = new EmbedBuilder();
      message.setTitle(
        "⚙️ command"
      );
      if (
        interaction.channel.isThread() === true
      ) {
        message.setDescription(
          `${makerRole} *${interaction.member}* used */${interaction.commandName}* in *${threadName}* of *${channelName}*`
        );
      } else {
        message.setDescription(
          `${makerRole} *${interaction.member}* used */${interaction.commandName}* in *${channelName}*`
        );
      }
      message.addFields(
        {
          name: "promotion points",
          value: `${makerPoints} ⭐`,
          inline: true
        }
      );
      message.addFields(
        {
          name: "to",
          value: `${interaction.member}`,
          inline: true
        }
      );
      message.setThumbnail(
        interaction.member.displayAvatarURL(
          {
            dynamic: true
          }
        )
      );
      message.setTimestamp();
      message.setColor(
        makerRole.color
      );
      const channel = interaction.guild.channels.cache.find(
        function (
          channel
        ) {
          return channel.name === customChannels.public;
        }
      ) ?? interaction.guild.publicUpdatesChannel;
      channel.send(
        {
          embeds: [
            message
          ]
        }
      );
    }
  } else if (
    interaction.isButton() === true
  ) {
    if (
      interaction.component.customId === "takePromotionPoints"
    ) {
      takePromotionPoints(
        interaction
      );
    }
  }
}

export {
  interactionCreate
};

