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
async function moveActionPoints(
  interaction
) {
  // Aggiungi gli ID dei canali consentiti
  const allowed_channels = [
    "1168970952311328768", // int-roleplay
    "1165937736121860198" // bot-testing
  ];

  if (
    !allowed_channels.includes(
      interaction.channelId
    )
  ) {
    await interaction.reply({
      content: "*map game* commands can only be used in *int-roleplay* channel",
      ephemeral: true
    });
    return;
  }

  await interaction.deferReply();
  const fromProvince = interaction.options.getString(
    "from-province"
  );
  const toProvince = interaction.options.getString(
    "to-province"
  );
  const actionPoints = interaction.options.getNumber(
    "action-points"
  );
  const playerId = interaction.user.id; // ID del giocatore su Discord
  const maker = interaction.member;
  const role = getCustomRole(
    maker
  );
  const points = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );

  try {
    const response = await fetch(
      "http://localhost:3000/move_action_points", {
      method: "POST",
      headers: {"content-type": "application/json"},
      body: JSON.stringify({
        map_id: 0,
        player_id: playerId,
        from_province: fromProvince,
        to_province: toProvince,
        action_points: actionPoints
      })
    });
    const contentType = response.headers.get(
      "content-type"
    );
    let data;

    if (
      contentType &&
      contentType.includes(
        "text/plain"
      )
    ) {
      data = await response.text();
    } else {
      data = await response.json();
    }

    if (
      response.status != 200
    ) {
      await interaction.editReply(
        data
      );
      return;
    }

    if (
      data.error
    ) {
      await interaction.editReply(
        `something goes wrong: ${data.error}`
      );
    } else {
      const p = actionPoints > 0 ? "points": "point";
      const message = new EmbedBuilder().setDescription(
        `🗺️ map game - europe: 👤 ${role} *${maker}* moves ${actionPoints} *action ${p}* from *${fromProvince}* to *${toProvince}*`
      ).setFooter({
        text: `${points} ⭐ to ${maker.displayName}`,
        iconURL: `${maker.displayAvatarURL()}`
      }).setColor(
        role.color
      ).setTimestamp();
      await interaction.editReply({
        embeds: [
          message
        ]
      });
    }
  } catch (
  __error
  ) {
    await interaction.editReply(
      `something goes wrong: ${__error}`
    );
  }
}

export {
  moveActionPoints
};