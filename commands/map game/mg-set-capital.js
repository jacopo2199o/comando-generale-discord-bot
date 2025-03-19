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
async function setCapital(
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
  const provinceName = interaction.options.getString(
    "province-name"
  );
  const playerId = interaction.user.id; // id del giocatore su Discord
  const maker = interaction.member;
  const role = getCustomRole(
    maker
  );
  const promotionPoints = getCalculatedPoints(
    customPoints.interactionCreate,
    reputationPoints[interaction.guildId][maker.id].points
  );
  try {
    const response = await fetch(
      "http://localhost:3000/set_capital?map_id=0", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify(
        {
          player_id: playerId,
          province_name: provinceName
        }
      )
    });
    const contentType = response.headers.get(
      "content-type"
    );
    let data = undefined;

    if (
      contentType != undefined &&
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
      const {nickname, province} = data;
      const message = new EmbedBuilder().setDescription(
        `🗺️ map game - europe: 🔶 *${nickname}* has established its capital in ${province}`
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
  setCapital
};