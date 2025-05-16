import {
  EmbedBuilder
} from "discord.js";
import http from "node:http";
import {
  reputationPoints
} from "../../events/ready.js";
import {
  customPoints,
  getCalculatedPoints
} from "../../resources/custom-points.js";
import {
  getCustomRole
} from "../../resources/custom-roles.js";
import {
  getPlayersNicknames
} from "../../resources/general-utilities.js";
/**
 * @param {import("discord.js").Interaction} interaction
 */
async function setDiplomacy(
  interaction
) {
  const allowed_channels = [
    "1168970952311328768",
    "1165937736121860198"
  ];

  if (
    !allowed_channels.includes(
      interaction.channelId
    )
  ) {
    await interaction.reply(
      {
        content: "*map game* commands can only be used in *int-roleplay* channel",
        ephemeral: true
      }
    );
    return;
  }

  await interaction.deferReply();
  const maker = interaction.member;
  const role = getCustomRole(
    maker
  );
  const activity_points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );
  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/set_diplomacy?map_id=0",
      method: "POST",
      timeout: 2900
    },
    response => {
      let data = "";
      response.on(
        "data",
        chunk => data += chunk
      ).on(
        "end",
        async () => {
          if (
            response.statusCode === 200
          ) {
            const {
              player,
              target_player,
              new_relation,
              previous_relation,
              cost
            } = JSON.parse(
              data
            );
            const message = new EmbedBuilder().setTitle(
              "🗺️ map game - europe"
            ).setDescription(
              `📜 *${player}* have changed diplomatic relations with *${target_player}*`
            ).addFields(
              {
                name: "actual relationship",
                value: `${new_relation.label}`,
                inline: true
              }
            ).addFields(
              {
                name: "previous relationship",
                value: `${previous_relation.label}`,
                inline: true
              }
            ).addFields(
              {
                name: "operation cost",
                value: `${cost} 🪙`,
                inline: false
              }
            ).setFooter(
              {
                text: `${activity_points} ⭐ to ${maker.displayName}`,
                iconURL: `${maker.displayAvatarURL()}`
              }
            ).setColor(
              role.color
            ).setTimestamp();
            await interaction.editReply(
              {
                embeds: [
                  message
                ]
              }
            );
          } else {
            await interaction.editReply(
              data
            );
          }
        }
      );
    }
  ).on(
    "error",
    async error => {
      await interaction.editReply(
        "connection error, try again later"
      );
      console.error(
        `connection error, try again later: ${error.message}`,
      );
    }
  ).on(
    "timeout",
    async () => {
      request.destroy();
      await interaction.editReply(
        "connection timeout, try again later"
      );
      console.error(
        "connection timeout"
      );
    }
  );
  request.write(
    JSON.stringify(
      {
        player_id: maker.id,
        player_target_id: interaction.options.getString(
          "player-nickname"
        ),
        relation_value: interaction.options.getNumber(
          "relation-value"
        )
      }
    )
  );
  request.end();
}

async function setDiplomacyAutocomplete(
  interaction
) {
  const focusedOption = interaction.options.getFocused(
    true
  );

  if (
    focusedOption.name === "player-nickname"
  ) {
    const players = await getPlayersNicknames(
      0 // map_id
    );
    const filteredPlayers = players.filter(
      player => player.name.toLowerCase().includes(
        focusedOption.value.toLowerCase()
      )
    ).map(
      player => (
        {
          name: player.name,
          value: player.value
        }
      )
    );
    await interaction.respond(
      filteredPlayers.slice(
        0, 8
      ) // massimo 25
    );
  }

  return; // esci dopo l'autocompletamento!
}

export {
  setDiplomacy,
  setDiplomacyAutocomplete
};