import { EmbedBuilder } from "discord.js";
import { customChannels } from "../resources/custom-channels.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";
import { deleteMember } from "../resources/general-utilities.js";
import { reputationPoints } from "./ready.js";

/**
* @param { import("discord.js").GuildMember } oldMember
*/
const guildMemberRemove = async (oldMember) => {
  const gaveToId = reputationPoints[oldMember.guild.id][oldMember.id].gaveTo;
  
  if (gaveToId !== "") {
    reputationPoints[oldMember.guild.id][gaveToId].points = -1;
  }

  deleteMember(oldMember);

  const penaltyPoints = Math.round(customPoints.guildMemberRemove / oldMember.guild.memberCount);

  oldMember.guild.members.cache.forEach((member) => {
    if (member !== undefined) {
      member.client.emit("activity", member, penaltyPoints);
    } else {
      console.error("member not found");
    }
  });

  const message = new EmbedBuilder();
  const role = getCustomRole(oldMember) ?? "n.a.";

  if (role !== "n.a.") {
    const roleComandoGenerale = oldMember.roles.cache.find((role) => role.name === "compagnia comando generale");

    if (roleComandoGenerale !== undefined) {
      message.setTitle("🍂 member lost");
      message.setDescription(`${role} *${oldMember.displayName}* left *comando generale*`);
      message.addFields({ name: "notes", value: `he had *${roleComandoGenerale}* role, remove him from alliance too`, inline: true });
      message.addFields({ name: "promotion points", value: `${penaltyPoints} ⭐`, inline: true });
      message.addFields({ name: "to", value: `${oldMember.guild.roles.everyone}`, inline: true });
      message.setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }));
      message.setTimestamp();
      message.setColor("DarkRed");
    } else {
      message.setTitle("🍂 member lost");
      message.setDescription(`${role} *${oldMember.displayName}* left *comando generale*`);
      message.addFields({ name: "promotion points", value: `${penaltyPoints} ⭐`, inline: true });
      message.addFields({ name: "to", value: `${oldMember.guild.roles.everyone}`, inline: true });
      message.setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }));
      message.setTimestamp();
      message.setColor("DarkRed");
    }
  } else {
    message.setTitle("🍂 member lost");
    message.setDescription(`*${oldMember.displayName}* left *comando generale*`);
    message.addFields({ name: "promotion points", value: `${penaltyPoints} ⭐`, inline: true });
    message.addFields({ name: "to", value: `${oldMember.guild.roles.everyone}`, inline: true });
    message.setThumbnail(oldMember.user.displayAvatarURL({ dynamic: true }));
    message.setTimestamp();
    message.setColor("DarkRed");
  }

  const channel = oldMember.guild.channels.cache.find((channel) => channel.name === customChannels.internal)
  ?? oldMember.guild.publicUpdatesChannel;
  channel.send({ embeds: [message] });
};

export { guildMemberRemove };

