import {EmbedBuilder} from "discord.js";
import {customChannels} from "../resources/custom-channels.js";
import {customPoints} from "../resources/custom-points.js";
import {getCustomRole, updateRoleTo} from "../resources/custom-roles.js";
import {globalPoints, pointsLastMove} from "./ready.js";

/**
 * @param { import("discord.js").GuildMember } member
 * @param { Number } points
 */
async function activity(member, points) {
  const customRole = getCustomRole(member);
  if (customRole === undefined) {
    return;
  }
  globalPoints[member.guild.id][member.id] += points;
  let updateResult = undefined;
  const channel = member.guild.channels.cache.find((channel) => {return channel.name === customChannels.activity;})
    ?? member.guild.publicUpdatesChannel;
  if (points > 0) {
    pointsLastMove[member.guild.id][member.id] = 1;
    if (globalPoints[member.guild.id][member.id] >= 22000 && customRole.name === "senatore") {
      updateResult = updateRoleTo(member, "ministro", "senatore");
    }
    else if (globalPoints[member.guild.id][member.id] >= 21000 && customRole.name === "governatore") {
      updateResult = updateRoleTo(member, "senatore", "governatore");
    }
    else if (globalPoints[member.guild.id][member.id] >= 20000 && customRole.name === "prefetto") {
      updateResult = updateRoleTo(member, "governatore", "sottoprefetto");
    }
    else if (globalPoints[member.guild.id][member.id] >= 19000 && customRole.name === "sottoprefetto") {
      updateResult = updateRoleTo(member, "prefetto", "sottoprefetto");
    }
    else if (globalPoints[member.guild.id][member.id] >= 18000 && customRole.name === "segretario") {
      updateResult = updateRoleTo(member, "sottoprefetto", "segretario");
    }
    else if (globalPoints[member.guild.id][member.id] >= 17000 && customRole.name === "sottosegretario") {
      updateResult = updateRoleTo(member, "segretario", "sottosegretario");
    }
    else if (globalPoints[member.guild.id][member.id] >= 16000 && customRole.name === "principale") {
      updateResult = updateRoleTo(member, "sottosegretario", "principale");
    }
    else if (globalPoints[member.guild.id][member.id] >= 15000 && customRole.name === "dirigente") {
      updateResult = updateRoleTo(member, "principale", "dirigente");
    }
    else if (globalPoints[member.guild.id][member.id] >= 14000 && customRole.name === "coordinatore capo") {
      updateResult = updateRoleTo(member, "dirigente", "coordinatore capo");
    }
    else if (globalPoints[member.guild.id][member.id] >= 13000 && customRole.name === "coordinatore") {
      updateResult = updateRoleTo(member, "coordinatore capo", "coordinatore");
    }
    else if (globalPoints[member.guild.id][member.id] >= 12000 && customRole.name === "sovrintendente capo") {
      updateResult = updateRoleTo(member, "coordinatore", "sovrintendente capo");
    }
    else if (globalPoints[member.guild.id][member.id] >= 11000 && customRole.name === "sovrintendente") {
      updateResult = updateRoleTo(member, "sovrintendente capo", "sovrintendente");
    }
    else if (globalPoints[member.guild.id][member.id] >= 10000 && customRole.name === "assistente capo") {
      updateResult = updateRoleTo(member, "sovrintendente", "assistente capo");
    }
    else if (globalPoints[member.guild.id][member.id] >= 9000 && customRole.name === "assistente") {
      updateResult = updateRoleTo(member, "assistente capo", "assistente");
    }
    else if (globalPoints[member.guild.id][member.id] >= 8000 && customRole.name === "gran generale") {
      updateResult = updateRoleTo(member, "assistente", "gran generale");
    }
    else if (globalPoints[member.guild.id][member.id] >= 7000 && customRole.name === "generale") {
      updateResult = updateRoleTo(member, "gran generale", "generale");
    }
    else if (globalPoints[member.guild.id][member.id] >= 6000 && customRole.name === "gran colonnello") {
      updateResult = updateRoleTo(member, "generale", "gran colonnello");
    }
    else if (globalPoints[member.guild.id][member.id] >= 5000 && customRole.name === "colonnello") {
      updateResult = updateRoleTo(member, "gran colonnello", "colonnello");
    }
    else if (globalPoints[member.guild.id][member.id] >= 4000 && customRole.name === "gran comandante") {
      updateResult = updateRoleTo(member, "colonnello", "gran comandante");
    }
    else if (globalPoints[member.guild.id][member.id] >= 3000 && customRole.name === "comandante") {
      updateResult = updateRoleTo(member, "gran comandante", "comandante");
    }
    else if (globalPoints[member.guild.id][member.id] >= 2000 && customRole.name === "tenente") {
      updateResult = updateRoleTo(member, "comandante", "tenente");
    }
    else if (globalPoints[member.guild.id][member.id] >= 1000 && customRole.name === "membro") {
      updateResult = updateRoleTo(member, "tenente", "membro");
    }
    if (updateResult !== undefined) {
      const message = new EmbedBuilder();
      message.setTitle("🔰 promotion");
      message.setDescription(`*${member}* reached ${customPoints.promotionPoints} *promotion points*`);
      message.addFields({name: "old role", value: `${updateResult.oldRole}`, inline: true});
      message.addFields({name: "new role", value: `${updateResult.newRole}`, inline: true});
      message.setThumbnail(member.displayAvatarURL({dynamic: true}));
      message.setTimestamp();
      message.setColor("DarkGreen");
      channel.send({embeds: [message]});
    }
  }
  else {
    pointsLastMove[member.guild.id][member.id] = 0;
    if (globalPoints[member.guild.id][member.id] < 1000 && customRole.name === "tenente") {
      updateResult = updateRoleTo(member, "membro", "tenente");
    }
    else if (globalPoints[member.guild.id][member.id] < 2000 && customRole.name === "comandante") {
      updateResult = updateRoleTo(member, "tenente", "comandante");
    }
    else if (globalPoints[member.guild.id][member.id] < 3000 && customRole.name === "gran comandante") {
      updateResult = updateRoleTo(member, "comandante", "gran comandante");
    }
    else if (globalPoints[member.guild.id][member.id] < 4000 && customRole.name === "colonnello") {
      updateResult = updateRoleTo(member, "gran comandante", "colonnello");
    }
    else if (globalPoints[member.guild.id][member.id] < 5000 && customRole.name === "gran colonnello") {
      updateResult = updateRoleTo(member, "colonnello", "gran colonnello");
    }
    else if (globalPoints[member.guild.id][member.id] < 6000 && customRole.name === "generale") {
      updateResult = updateRoleTo(member, "gran colonnello", "generale");
    }
    else if (globalPoints[member.guild.id][member.id] < 7000 && customRole.name === "gran generale") {
      updateResult = updateRoleTo(member, "generale", "gran generale");
    }
    else if (globalPoints[member.guild.id][member.id] < 8000 && customRole.name === "assistente") {
      updateResult = updateRoleTo(member, "gran generale", "assistente");
    }
    else if (globalPoints[member.guild.id][member.id] < 9000 && customRole.name === "assistente capo") {
      updateResult = updateRoleTo(member, "assistente", "assistente capo");
    }
    else if (globalPoints[member.guild.id][member.id] < 10000 && customRole.name === "sovrintendente") {
      updateResult = updateRoleTo(member, "assistente capo", "sovrintendente");
    }
    else if (globalPoints[member.guild.id][member.id] < 11000 && customRole.name === "sovrintendente capo") {
      updateResult = updateRoleTo(member, "sovrintendente", "sovrintendente capo");
    }
    else if (globalPoints[member.guild.id][member.id] < 12000 && customRole.name === "coordinatore") {
      updateResult = updateRoleTo(member, "sovrintendente capo", "coordinatore");
    }
    else if (globalPoints[member.guild.id][member.id] < 13000 && customRole.name === "coordinatore capo") {
      updateResult = updateRoleTo(member, "coordinatore", "coordinatore capo");
    }
    else if (globalPoints[member.guild.id][member.id] < 14000 && customRole.name === "dirigente") {
      updateResult = updateRoleTo(member, "coordinatore capo", "dirigente");
    }
    else if (globalPoints[member.guild.id][member.id] < 15000 && customRole.name === "principale") {
      updateResult = updateRoleTo(member, "dirigente", "principale");
    }
    else if (globalPoints[member.guild.id][member.id] < 16000 && customRole.name === "sottosegretario") {
      updateResult = updateRoleTo(member, "principale", "sottosegretario");
    }
    else if (globalPoints[member.guild.id][member.id] < 17000 && customRole.name === "segretario") {
      updateResult = updateRoleTo(member, "sottosegretario", "segretario");
    }
    else if (globalPoints[member.guild.id][member.id] < 18000 && customRole.name === "sottoprefetto") {
      updateResult = updateRoleTo(member, "segretario", "sottoprefetto");
    }
    else if (globalPoints[member.guild.id][member.id] < 19000 && customRole.name === "prefetto") {
      updateResult = updateRoleTo(member, "sottoprefetto", "prefetto");
    }
    else if (globalPoints[member.guild.id][member.id] < 20000 && customRole.name === "governatore") {
      updateResult = updateRoleTo(member, "prefetto", "governatore");
    }
    else if (globalPoints[member.guild.id][member.id] < 21000 && customRole.name === "senatore") {
      updateResult = updateRoleTo(member, "governatore", "senatore");
    }
    else if (globalPoints[member.guild.id][member.id] < 22000 && customRole.name === "ministro") {
      updateResult = updateRoleTo(member, "senatore", "ministro");
    }
    if (updateResult !== undefined) {
      const message = new EmbedBuilder();
      message.setTitle("🔰 updateRoleTo");
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

