import {EmbedBuilder} from "discord.js";
import {reputationPoints} from "../../events/ready.js";
import {customPoints, getCalculatedPoints} from "../../resources/custom-points.js";
import {getCustomRole} from "../../resources/custom-roles.js";
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

  // Differisci la risposta PRIMA di operazioni lunghe
  await interaction.deferReply({ephemeral: false}).catch(console.error);

  const request = http.request(
    {
      host: "localhost",
      port: "3000",
      path: "/set_province?id=0",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      }
    },
    function (response) {
      let data = "";
      const contentType = response.headers["content-type"] || "";

      response.on("data", function (chunk) {
        data += chunk;
      }).on("end", async function () {
        try {
          // Gestione basata sul Content-Type
          let responseData;
          if (contentType.includes("application/json")) {
            responseData = JSON.parse(data);
          } else {
            // Se non è JSON, tratta la risposta come testo
            responseData = {
              message: data,
              isTextResponse: true
            };
          }

          if (response.statusCode === 200) {
            // Gestione risposta di successo (JSON)
            if (responseData.isTextResponse) {
              await interaction.editReply(`success: ${responseData.message}`);
              return;
            }

            const {name, province, attacker, defender, damage} = responseData;
            let description = "";

            const responses = {
              failed: `⚔️ *${attacker}* failed to conquer *${province}* of *${defender}*: defense lost ${damage} *action points*`,
              occupied: `🛖 *${attacker}* occupied *${province}*`,
              reinforced: `🛡️ *${attacker}* reinforced *${province}*`,
              conquered: `🔥 *${attacker}* conquered *${province}* of *${defender}*`,
              defeated: `💀 *${attacker}* conquered *${province}* last province of ${defender}. if no action is taken, next hour he will be declared defeated`
            };

            description = responses[name] || `Unknown response type: ${name}`;

            const message = new EmbedBuilder()
              .setDescription(`🗺️ map game - europe: ${description}`)
              .setFooter({
                text: `${points} ⭐ to ${maker.displayName}`,
                iconURL: `${maker.displayAvatarURL()}`
              })
              .setColor(roleColor)
              .setTimestamp();

            await interaction.editReply({embeds: [message]});
          } else {
            // Gestione errori (può essere JSON o testo)
            const errorMessage = responseData.isTextResponse
              ? responseData.message
              : responseData.message || "unknown server error";

            await interaction.editReply(errorMessage);
          }
        } catch (error) {
          console.error("response processing error:", error.message);
          await interaction.editReply("there was an error processing the server response");
        }
      });
    }
  ).on("error", async function (error) {
    await interaction.editReply("connection error, please try again later");
    console.error("http request error:", error.message);
  });

  request.write(JSON.stringify({
    player_id: maker.id,
    province_name: provinceName,
    action_points: actionPoints
  }));
  request.end();
}

export {takeProvince};