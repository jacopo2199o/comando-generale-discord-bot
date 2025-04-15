import {
  EmbedBuilder
} from "discord.js";
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
/**
 * @param {import("discord.js").Interaction} interaction
 */
async function fortifyAll(
  interaction
) {
  // aggiungi gli ID dei canali consentiti
  const allowed_channels = [
    "1168970952311328768", // int-roleplay
    "1165937736121860198" // bot-testing
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

  const maker = interaction.member;
  const role = getCustomRole(
    maker
  );
  const promotionPoints = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );
  const playerId = interaction.user.id; // id del giocatore su discord
  const actionPoints = interaction.options.getNumber(
    "action-points"
  );
  const receiverId = interaction.options.getString(
    "player-nickname"
  );

  try {
    await interaction.deferReply();
    const response = await fetch(
      "http://localhost:3000/fortify-all",
      {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(
          {
            map_id: 0,
            player_id: playerId,
            receiver_id: receiverId,
            action_points: actionPoints
          }
        )
      }
    );

    if (
      response.status !== 200
    ) {
      await interaction.editReply(
        await response.text()
      );
      return;
    }

    const {
      donor,
      receiver,
      cost
    } = await response.json();
    const pointString = cost > 1 ? "points" : "point";
    let messageDescription = "";

    if (
      donor === receiver
    ) {
      messageDescription = `🗺️ map game - europe: 🛡️ *${donor}* has fortified its territories by ${cost} *action* ${pointString}`;
    } else {
      messageDescription = `🗺️ map game - europe: 🛡️ *${donor}* has fortified territories of *${receiver}* by ${cost} *action* ${pointString}`;
    }

    const message = new EmbedBuilder().setDescription(
      messageDescription
    ).setFooter(
      {
        text: `${promotionPoints} ⭐ to ${maker.displayName}`,
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
  } catch (
  __error
  ) {
    await interaction.editReply(
      `something goes wrong: ${__error}`
    );
  }
}

export {
  fortifyAll
};