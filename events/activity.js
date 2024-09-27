import {
  EmbedBuilder
} from "discord.js";
import {
  customChannels
} from "../resources/custom-channels.js";
import {
  customPoints
} from "../resources/custom-points.js";
import {
  getCustomRole,
  updateRoleTo
} from "../resources/custom-roles.js";
import {
  globalPoints,
  pointsLastMove
} from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } member
 * @param { Number } points
 */
async function activity(
  member,
  points
) {
  const customRole = getCustomRole(
    member
  );
  if (customRole === undefined) {
    return;
  }
  globalPoints[member.guild.id][member.id] += points;
  let updateResult = undefined;
  const channel = member.guild.channels.cache.find(
    function (
      channel
    ) {
      return channel.name === customChannels.activity;
    }) ?? member.guild.publicUpdatesChannel;
  if (
    points > 0
  ) {
    pointsLastMove[member.guild.id][member.id] = 1;
    if (
      globalPoints[member.guild.id][member.id] >= 22000 &&
      customRole.name === "senatore"
    ) {
      updateResult = await updateRoleTo(
        member,
        "ministro",
        "senatore"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 21000 &&
      customRole.name === "governatore"
    ) {
      updateResult = await updateRoleTo(
        member,
        "senatore",
        "governatore"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 20000 &&
      customRole.name === "prefetto"
    ) {
      updateResult = await updateRoleTo(
        member,
        "governatore",
        "sottoprefetto"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 19000 &&
      customRole.name === "sottoprefetto"
    ) {
      updateResult = await updateRoleTo(
        member,
        "prefetto",
        "sottoprefetto"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 18000 &&
      customRole.name === "segretario"
    ) {
      updateResult = await updateRoleTo(
        member,
        "sottoprefetto",
        "segretario"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 17000 &&
      customRole.name === "sottosegretario"
    ) {
      updateResult = await updateRoleTo(
        member,
        "segretario",
        "sottosegretario"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 16000 &&
      customRole.name === "principale"
    ) {
      updateResult = await updateRoleTo(
        member,
        "sottosegretario",
        "principale"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 15000 &&
      customRole.name === "dirigente"
    ) {
      updateResult = await updateRoleTo(
        member,
        "principale",
        "dirigente"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 14000 &&
      customRole.name === "coordinatore capo"
    ) {
      updateResult = await updateRoleTo(
        member,
        "dirigente",
        "coordinatore capo"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 13000 &&
      customRole.name === "coordinatore"
    ) {
      updateResult = await updateRoleTo(
        member,
        "coordinatore capo",
        "coordinatore"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 12000 &&
      customRole.name === "sovrintendente capo"
    ) {
      updateResult = await updateRoleTo(
        member,
        "coordinatore",
        "sovrintendente capo"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 11000 &&
      customRole.name === "sovrintendente"
    ) {
      updateResult = await updateRoleTo(
        member,
        "sovrintendente capo",
        "sovrintendente"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 10000 &&
      customRole.name === "assistente capo"
    ) {
      updateResult = await updateRoleTo(
        member,
        "sovrintendente",
        "assistente capo"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 9000 &&
      customRole.name === "assistente"
    ) {
      updateResult = await updateRoleTo(
        member,
        "assistente capo",
        "assistente"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 8000 &&
      customRole.name === "gran generale"
    ) {
      updateResult = await updateRoleTo(
        member,
        "assistente",
        "gran generale"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 7000 &&
      customRole.name === "generale"
    ) {
      updateResult = await updateRoleTo(
        member,
        "gran generale",
        "generale"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 6000 &&
      customRole.name === "gran colonnello"
    ) {
      updateResult = await updateRoleTo(
        member,
        "generale",
        "gran colonnello"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 5000 &&
      customRole.name === "colonnello"
    ) {
      updateResult = await updateRoleTo(
        member,
        "gran colonnello",
        "colonnello"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 4000 &&
      customRole.name === "gran comandante"
    ) {
      updateResult = await updateRoleTo(
        member,
        "colonnello",
        "gran comandante"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 3000 &&
      customRole.name === "comandante"
    ) {
      updateResult = await updateRoleTo(
        member,
        "gran comandante",
        "comandante"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 2000 &&
      customRole.name === "tenente"
    ) {
      updateResult = await updateRoleTo(
        member,
        "comandante",
        "tenente"
      );
    } else if (
      globalPoints[member.guild.id][member.id] >= 1000 &&
      customRole.name === "membro"
    ) {
      updateResult = await updateRoleTo(
        member,
        "tenente",
        "membro"
      );
    }
    if (
      updateResult !== undefined
    ) {
      const message = new EmbedBuilder();
      message.setTitle(
        "🔰 promotion"
      );
      message.setDescription(
        `*${member}* reached ${customPoints.promotionPoints} *promotion points*`
      );
      message.addFields(
        {
          name: "old role",
          value: `${updateResult.oldRole}`,
          inline: true
        }
      );
      message.addFields(
        {
          name: "new role",
          value: `${updateResult.newRole}`,
          inline: true
        }
      );
      message.setThumbnail(
        member.displayAvatarURL(
          {
            dynamic: true
          }
        )
      );
      message.setTimestamp();
      message.setColor(
        "DarkGreen"
      );
      channel.send(
        {
          embeds: [
            message
          ]
        }
      );
    }
  } else {
    pointsLastMove[member.guild.id][member.id] = 0;
    if (globalPoints[member.guild.id][member.id] < 1000 && customRole.name === "tenente") {
      updateResult = await updateRoleTo(member, "membro", "tenente");
    }
    else if (globalPoints[member.guild.id][member.id] < 2000 && customRole.name === "comandante") {
      updateResult = await updateRoleTo(member, "tenente", "comandante");
    }
    else if (globalPoints[member.guild.id][member.id] < 3000 && customRole.name === "gran comandante") {
      updateResult = await updateRoleTo(member, "comandante", "gran comandante");
    }
    else if (globalPoints[member.guild.id][member.id] < 4000 && customRole.name === "colonnello") {
      updateResult = await updateRoleTo(member, "gran comandante", "colonnello");
    }
    else if (globalPoints[member.guild.id][member.id] < 5000 && customRole.name === "gran colonnello") {
      updateResult = await updateRoleTo(member, "colonnello", "gran colonnello");
    }
    else if (globalPoints[member.guild.id][member.id] < 6000 && customRole.name === "generale") {
      updateResult = await updateRoleTo(member, "gran colonnello", "generale");
    }
    else if (globalPoints[member.guild.id][member.id] < 7000 && customRole.name === "gran generale") {
      updateResult = await updateRoleTo(member, "generale", "gran generale");
    }
    else if (globalPoints[member.guild.id][member.id] < 8000 && customRole.name === "assistente") {
      updateResult = await updateRoleTo(member, "gran generale", "assistente");
    }
    else if (globalPoints[member.guild.id][member.id] < 9000 && customRole.name === "assistente capo") {
      updateResult = await updateRoleTo(member, "assistente", "assistente capo");
    }
    else if (globalPoints[member.guild.id][member.id] < 10000 && customRole.name === "sovrintendente") {
      updateResult = await updateRoleTo(member, "assistente capo", "sovrintendente");
    }
    else if (globalPoints[member.guild.id][member.id] < 11000 && customRole.name === "sovrintendente capo") {
      updateResult = await updateRoleTo(member, "sovrintendente", "sovrintendente capo");
    }
    else if (globalPoints[member.guild.id][member.id] < 12000 && customRole.name === "coordinatore") {
      updateResult = await updateRoleTo(member, "sovrintendente capo", "coordinatore");
    }
    else if (globalPoints[member.guild.id][member.id] < 13000 && customRole.name === "coordinatore capo") {
      updateResult = await updateRoleTo(member, "coordinatore", "coordinatore capo");
    }
    else if (globalPoints[member.guild.id][member.id] < 14000 && customRole.name === "dirigente") {
      updateResult = await updateRoleTo(member, "coordinatore capo", "dirigente");
    }
    else if (globalPoints[member.guild.id][member.id] < 15000 && customRole.name === "principale") {
      updateResult = await updateRoleTo(member, "dirigente", "principale");
    }
    else if (globalPoints[member.guild.id][member.id] < 16000 && customRole.name === "sottosegretario") {
      updateResult = await updateRoleTo(member, "principale", "sottosegretario");
    }
    else if (globalPoints[member.guild.id][member.id] < 17000 && customRole.name === "segretario") {
      updateResult = await updateRoleTo(member, "sottosegretario", "segretario");
    }
    else if (globalPoints[member.guild.id][member.id] < 18000 && customRole.name === "sottoprefetto") {
      updateResult = await updateRoleTo(member, "segretario", "sottoprefetto");
    }
    else if (globalPoints[member.guild.id][member.id] < 19000 && customRole.name === "prefetto") {
      updateResult = await updateRoleTo(member, "sottoprefetto", "prefetto");
    }
    else if (globalPoints[member.guild.id][member.id] < 20000 && customRole.name === "governatore") {
      updateResult = await updateRoleTo(member, "prefetto", "governatore");
    }
    else if (globalPoints[member.guild.id][member.id] < 21000 && customRole.name === "senatore") {
      updateResult = await updateRoleTo(member, "governatore", "senatore");
    }
    else if (globalPoints[member.guild.id][member.id] < 22000 && customRole.name === "ministro") {
      updateResult = await updateRoleTo(member, "senatore", "ministro");
    }
    if (updateResult !== undefined) {
      const message = new EmbedBuilder();
      message.setTitle("🔰 downgrade");
      message.setDescription(`*${member}* no longer have *promotion points* for ${updateResult.oldRole}`);
      message.addFields({name: "old role", value: `${updateResult.oldRole}`, inline: true});
      message.addFields({name: "new role", value: `${updateResult.newRole}`, inline: true});
      message.setThumbnail(member.displayAvatarURL({dynamic: true}));
      message.setTimestamp();
      message.setColor("DarkRed");
      channel.send({embeds: [message]});
    }
  }
}

export {activity};

