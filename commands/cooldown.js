import { EmbedBuilder } from "discord.js";
import { cooldowns } from "../events/ready.js";
import { customPoints } from "../resources/custom-points.js";
import { getCustomRole } from "../resources/custom-roles.js";

/**
 * 
 * @param {import("discord.js").Interaction} interaction 
 */
const cooldown = async (interaction) => {
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

  const interval = interaction.options.getNumber("interval");
  const period = interaction.options.getNumber("period");

  if (interval > period) {
    await interaction.editReply("interval can not be major to period");
    return;
  }

  const reason = interaction.options.getString("reason");

  if (cooldowns[interaction.guild.id][member.id] === undefined) {
    interaction.client.emit("activity", member, customPoints.cooldownPenalty);
    const endInterval = new Date().getTime() + (1000 * 60 * 60 * interval);
    const endPeriod = new Date().getTime() + (1000 * 60 * 60 * period);
    cooldowns[interaction.guild.id][member.id] = { interval, endInterval, endPeriod };
    const message = new EmbedBuilder();
    message.setTitle("🛡️ cooldown applied");
    message.setDescription(`${role} *${member}* received ${interval} hour/s *cooldown* penalty for a period of ${period} hour/s`);
    message.addFields({ name: "promotion points", value: `${customPoints.cooldownPenalty} ⭐`, inline: true });
    message.addFields({ name: "to", value: `${member}`, inline: true });
    message.addFields({ name: "reason", value: `${reason}`, inline: false });
    message.addFields({ name: "notes", value: "*threads* are excluded from penalty*" });
    message.setThumbnail(interaction.client.user.displayAvatarURL({ dynamic: true }));
    message.setFooter({ text: `${interaction.member}`, iconURL: `${interaction.member.displayAvatarURL()}` });
    message.setTimestamp();
    message.setColor("DarkBlue");
    await interaction.editReply({ embeds: [message] });
  } else {
    await interaction.editReply("this member have already a *cooldown* penalty");
  }
};

export { cooldown };

