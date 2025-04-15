import {
  globalPoints
} from "../events/ready.js";
import {
  customChannels
} from "../resources/custom-channels.js";
import {
  getCustomRole,
  getCustomRoles,
  pointsRole
} from "../resources/custom-roles.js";
import {
  sendMesseges
} from "../resources/general-utilities.js";

/**
 * @param {import("discord.js").Interaction} interaction
 */
async function checkMembers(
  interaction
) {
  await interaction.deferReply();
  const members = await interaction.guild.members.fetch();
  const messages = [];
  members.forEach(
    member => {
      const customRole = getCustomRole(
        member
      );
      const customRoles = getCustomRoles(
        member
      );

      if (
        member.user.bot === false &&
        interaction.guild.ownerId !== member.id
      ) {
        if (
          customRoles.length > 1
        ) {
          messages.push(
            `member with more than one custom roles: *${member}*\n`
          );
        }

        const isItaliano = member.roles.cache.some(
          role => role.name === "italiano"
        );
        const isEnglish = member.roles.cache.some(
          role => role.name === "english"
        );
        const isInternational = member.roles.cache.some(
          role => role.name === "international"
        );

        if (
          isItaliano === false &&
          isEnglish === false &&
          isInternational === false
        ) {
          messages.push(
            `member with missing language role: *${member}*\n`
          );
        }

        if (
          isItaliano === true &&
          isInternational === true
        ) {
          messages.push(
            `member with *italiano* and *international* role: *${member}*\n`
          );
        }

        if (
          isItaliano === true &&
          isEnglish === true
        ) {
          messages.push(
            `member with *italiano* and *english* role: *${member}*\n`
          );
        }

        if (
          isEnglish === true &&
          isInternational === true
        ) {
          messages.push(
            `member with *english* and *international* role: *${member}*\n`
          );
        }

        if (
          globalPoints[member.guild.id][member.id] >= pointsRole["ministro"]
        ) {
          if (
            customRole.name !== "ministro"
          ) {
            messages.push(
              `member with >= ${pointsRole["ministro"]} points should be a ministro: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["senatore"]
        ) {
          if (
            customRole.name !== "senatore"
          ) {
            messages.push(
              `member with >= ${pointsRole["senatore"]} points should be a senatore: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["governatore"]
        ) {
          if (
            customRole.name !== "governatore"
          ) {
            messages.push(
              `member with >= ${pointsRole["governatore"]} points should be a governatore: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["prefetto"]
        ) {
          if (
            customRole.name !== "prefetto"
          ) {
            messages.push(
              `member with >= ${pointsRole["prefetto"]} points should be a prefetto: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["sottoprefetto"]
        ) {
          if (
            customRole.name !== "sottoprefetto"
          ) {
            messages.push(
              `member with >= ${pointsRole["sottoprefetto"]} points should be a sottoprefetto: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["segretario"]
        ) {
          if (
            customRole.name !== "segretario"
          ) {
            messages.push(
              `member with >= ${pointsRole["segretario"]} points should be a segretario: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["sottosegretario"]
        ) {
          if (
            customRole.name !== "sottosegretario"
          ) {
            messages.push(
              `member with >= ${pointsRole["sottosegretario"]} points should be a sottosegretario: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["principale"]
        ) {
          if (
            customRole.name !== "principale"
          ) {
            messages.push(
              `member with >= ${pointsRole["principale"]} points should be a principale: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["dirigente"]
        ) {
          if (
            customRole.name !== "dirigente"
          ) {
            messages.push(
              `member with >= ${pointsRole["dirigente"]} points should be a dirigente: ${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["coordinatore capo"]
        ) {
          if (
            customRole.name !== "coordinatore capo"
          ) {
            messages.push(
              `member with >= ${pointsRole["coordinatore capo"]} points should be a coordinatore capo: ${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["coordinatore"]
        ) {
          if (
            customRole.name !== "coordinatore"
          ) {
            messages.push(
              `member with >= ${pointsRole["coordinatore"]} points should be a coordinatore: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["sovrintendente capo"]
        ) {
          if (
            customRole.name !== "sovrintendente capo"
          ) {
            messages.push(
              `member with >= ${pointsRole["sovrintendente capo"]} points should be a sovrintendente capo: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["sovrintendente"]
        ) {
          if (
            customRole.name !== "sovrintendente"
          ) {
            messages.push(
              `member with >= ${pointsRole["sovrintendente"]} points should be a sovrintendente: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["assistente capo"]
        ) {
          if (
            customRole.name !== "assistente capo"
          ) {
            messages.push(
              `member with >= ${pointsRole["assistente capo"]} points should be a assistente capo: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["assistente"]
        ) {
          if (
            customRole.name !== "assistente"
          ) {
            messages.push(
              `member with >= ${pointsRole["assistente"]} points should be a assistente: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["gran generale"]
        ) {
          if (
            customRole.name !== "gran generale"
          ) {
            messages.push(
              `member with >= ${pointsRole["gran generale"]} points should be a gran generale: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["generale"]
        ) {
          if (
            customRole.name !== "generale"
          ) {
            messages.push(
              `member with >= ${pointsRole["generale"]} points should be a generale: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["gran colonnello"]
        ) {
          if (
            customRole.name !== "gran colonnello"
          ) {
            messages.push(
              `member with >= ${pointsRole["gran colonnello"]} points should be a gran colonnello: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["colonnello"]
        ) {
          if (
            customRole.name !== "colonnello"
          ) {
            messages.push(
              `member with >= ${pointsRole["colonnello"]} points should be a colonnello: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["gran comandante"]
        ) {
          if (
            customRole.name !== "gran comandante"
          ) {
            messages.push(
              `member with >= ${pointsRole["gran comandante"]} points should be a gran comandante: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["comandante"]
        ) {
          if (
            customRole.name !== "comandante"
          ) {
            messages.push(
              `member with >= ${pointsRole["comandante"]} points should be a comandante: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else if (
          globalPoints[member.guild.id][member.id] >= pointsRole["tenente"]
        ) {
          if (
            customRole.name !== "tenente"
          ) {
            messages.push(
              `member with >= ${pointsRole["tenente"]} points should be a tenente: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
          return;
        } else {
          if (
            customRole.name !== "membro"
          ) {
            messages.push(
              `member with < ${pointsRole["tenente"]} points should be a membro: *${member}*\n`,
              `points difference: ${globalPoints[member.guild.id][member.id] - pointsRole[customRole.name]}\n`
            );
          }
        }
      }
    }
  );

  if (
    messages.length > 0
  ) {
    const channel = interaction.guild.channels.cache.find(
      channel => channel.name === customChannels.internal
    ) ?? interaction.guild.publicUpdatesChannel;
    sendMesseges(
      messages,
      channel
    );
    await interaction.followUp(
      "done"
    );
  } else {
    await interaction.editReply(
      "no problems found"
    );
  }
}

export {
  checkMembers
};

