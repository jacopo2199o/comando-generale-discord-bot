import { EmbedBuilder } from "discord.js";
import { reputationPoints } from "../../events/ready.js";
import { customPoints, getCalculatedPoints } from "../../resources/custom-points.js";
import { getCustomRole } from "../../resources/custom-roles.js";
import http from "node:http";

async function takeProvince(interaction) {
  const allowed_channels = ["1168970952311328768", "1165937736121860198"];
  if (!allowed_channels.includes(interaction.channelId)) {
    await interaction.reply({
      content: "*map game* commands can only be used in *int-roleplay* channel",
      ephemeral: true
    });
    return;
  }

  await interaction.deferReply();
  const maker = interaction.member;
  const role = getCustomRole(maker);
  const roleColor = role ? role.color : "#FFFFFF";

  const guildReputation = reputationPoints[interaction.guildId];
  const userReputation = guildReputation && guildReputation[maker.id];
  const points = getCalculatedPoints(
    customPoints.interactionCreate,
    userReputation ? userReputation.points : 0
  );

  const provinceName = interaction.options.getString("province-name");
  const actionPoints = interaction.options.getNumber("action-points");

  if (!provinceName || isNaN(actionPoints)) {
    await interaction.editReply("Invalid input, please provide a valid province name and action points.");
    return;
  }

  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/set_province?id=0",
      method: "POST",
    },
    function (response) {
      let data = "";
      response.on("data", function (chunk) {
        data += chunk;
      }).on("end", async function () {
        try {
          const parsedData = JSON.parse(data);
          if (response.statusCode === 200) {
            const { name, province, attacker, defender, damage } = parsedData;
            let description = "";
            if (name === "failed") {
              description = `⚔️ *${attacker}* failed to conquer *${province}* of *${defender}*: defense lost ${damage} *action points*`;
            } else if (name === "occupied") {
              description = `🛖 *${attacker}* occupied *${province}*`;
            } else if (name === "reinforced") {
              description = `🛡️ *${attacker}* reinforced *${province}*`;
            } else if (name === "conquered") {
              description = `🔥 *${attacker}* conquered *${province}* of *${defender}*`;
            } else if (name === "defeated") {
              description = `💀 *${attacker}* conquered *${province}* last province of ${defender}. if no action is taken, next hour he will be declared defeated`;
            }

            const message = new EmbedBuilder()
              .setDescription(`🗺️ map game - europe: ${description}`)
              .setFooter({
                text: `${points} ⭐ to ${maker.displayName}`,
                iconURL: `${maker.displayAvatarURL()}`
              })
              .setColor(roleColor)
              .setTimestamp();

            try {
              await interaction.editReply({ embeds: [message] });
            } catch (error) {
              console.error("Failed to send message:", error.message);
              await interaction.followUp({ content: "Failed to send message, please try again.", ephemeral: true });
            }
          } else {
            await interaction.editReply(`Server returned an error: ${parsedData.message || data}`);
          }
        } catch (error) {
          await interaction.editReply("Invalid response from the server");
          console.error("JSON parsing error:", error.message);
        }
      });
    }
  ).on("error", async function (error) {
    await interaction.editReply("Connection error, try again later");
    console.error("HTTP request error:", error.message);
  });

  request.setTimeout(5000, () => {
    request.destroy();
    interaction.editReply("Request timed out, please try again later.");
    console.error("HTTP request timed out");
  });

  request.write(JSON.stringify({
    player_id: maker.id,
    province_name: provinceName,
    action_points: actionPoints
  }));
  request.end();
}

export { takeProvince };