import {
  EmbedBuilder
} from "discord.js";
import {
  customChannels
} from "../resources/custom-channels.js";
import {
  getCustomRole
} from "../resources/custom-roles.js";

/**
 * @param { import("discord.js").GuildMember } newMember
 * @param { import("discord.js").GuildMember } oldMember
 */
async function guildMemberUpdate(
  oldMember,
  newMember
) {
  const channel = newMember.guild.channels.cache.find(
    function (
      channel
    ) {
      return channel.name === customChannels.activity;
    }
  ) ?? newMember.guild.publicUpdatesChannel;
  if (
    oldMember.roles.cache.size > newMember.roles.cache.size
  ) {
    oldMember.roles.cache.forEach(
      function (
        role
      ) {
        if (
          !newMember.roles.cache.has(
            role.id
          )
        ) {
          const message = new EmbedBuilder();
          message.setDescription(
            `🔰 ${role} has been removed from *${newMember}*`
          );
          message.setFooter(
            {
              text: `${newMember.displayName}`,
              iconURL: `${newMember.displayAvatarURL()}`
            }
          );
          message.setTimestamp();
          message.setColor(
            "DarkRed"
          );
          channel.send(
            {
              embeds: [
                message
              ]
            }
          );
        }
      }
    );
  } else if (
    oldMember.roles.cache.size < newMember.roles.cache.size
  ) {
    newMember.roles.cache.forEach(
      function (
        role
      ) {
        if (
          !oldMember.roles.cache.has(
            role.id
          )
        ) {
          const message = new EmbedBuilder();
          message.setDescription(
            `🔰 ${role} has been added to *${newMember}*`
          );
          message.setFooter(
            {
              text: `${newMember.displayName}`,
              iconURL: `${newMember.displayAvatarURL()}`
            }
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
      }
    );
  } else if (
    oldMember.nickname !== newMember.nickname
  ) {
    const customRole = getCustomRole(
      newMember
    );
    if (
      customRole === undefined
    ) {
      return console.error(
        "guild member update: custom role undefined"
      );
    }
    const message = new EmbedBuilder();
    message.setTitle(
      "🪪 new nickname"
    ).setDescription(
      `${customRole} *${oldMember.displayName}* changed his nickname in ${newMember.displayName}`
    ).setThumbnail(
      newMember.displayAvatarURL(
        {
          dynamic: true
        }
      )
    ).setTimestamp().setColor(
      customRole.color
    );
    channel.send(
      {
        embeds: [
          message
        ]
      }
    );
  }
}

export {
  guildMemberUpdate
};

