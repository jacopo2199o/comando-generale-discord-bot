import { EmbedBuilder } from "discord.js";
import { transfers } from "../events/ready.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * 
 * @param {import("discord.js")} interaction 
 */
const transfer = async (interaction) => {
  await interaction.deferReply();
  const user = interaction.options.getUser("member");
  if (user === undefined) {
    return console.error(user);
  }

  const member = interaction.guild.members.cache.get(user.id);

  if (member === undefined) {
    return console.error();
  }

  const role = getCustomRole(member);

  if (role === undefined) {
    return console.error(role);
  }

  const period = interaction.options.getNumber("period");
  const reason = interaction.options.getString("reason");

  if (transfers[interaction.guild.id][member.id] === undefined) {
    interaction.client.emit("activity", member, customPoints.transferPenalty);
    const endPeriod = new Date().getTime() + (1000 * 60 * 60 * period);
    transfers[interaction.guild.id][member.id] = { endPeriod };
    const message = new EmbedBuilder();
    message.setTitle("🛡️ transfer applied");
    message.setDescription(`${role} *${member}* received *transfer* penalty for a period of ${period} hour/s from public channels`);
    message.addFields({ name: "promotion points", value: `${customPoints.transferPenalty} ⭐`, inline: true });
    message.addFields({ name: "to", value: `${member}`, inline: true });
    message.addFields({ name: "reason", value: `${reason}`, inline: false });
    message.addFields({ name: "notes", value: "*threads* are excluded from penalty" });
    message.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }));
    message.setFooter({ text: `${interaction.member}`, iconURL: `${interaction.member.displayAvatarURL()}` });
    message.setTimestamp();
    message.setColor("DarkBlue");
    await interaction.editReply({ embeds: [message] });
  } else {
    await interaction.editReply("this member have already a *transfer* penalty");
  }
};

export { transfer };

