import {
  REST,
  Routes,
  SlashCommandBuilder
} from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const rest = new REST().setToken(
  process.env.bot_token
);
const commands = [];
commands.push(
  new SlashCommandBuilder().setName(
    "about"
  ).setDescription(
    "about this channel"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "clear"
  ).setDescription(
    "clear channel from last 100 messages"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "chart-global-points"
  ).setDescription(
    "global points chart of top 10 members"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "chart-promotion-points"
  ).setDescription(
    "promotion points chart of top 10 members"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "chart-reputation-points"
  ).setDescription(
    "reputation points chart of top 10 members"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "chart-seniority-points"
  ).setDescription(
    "seniority points chart of top 10 members"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "check-members"
  ).setDescription(
    "check members for general problems"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "transfer"
  ).setDescription(
    "transfer a member into threads"
  ).addUserOption(
    function (
      option
    ) {
      return option.setName(
        "member"
      ).setDescription(
        "member to give points"
      ).setRequired(
        true
      );
    }
  ).addNumberOption(
    function (
      option
    ) {
      return option.setName(
        "period"
      ).setDescription(
        "time period (hours) to expiration"
      ).setMinValue(
        1
      ).setMaxValue(
        10000
      ).setRequired(
        true
      );
    }
  ).addStringOption(
    function (
      option
    ) {
      return option.setName(
        "reason"
      ).setDescription(
        "reason description"
      ).setRequired(
        true
      );
    }
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "cooldown"
  ).setDescription(
    "apply cooldown penalty to a member"
  ).addUserOption(
    function (
      option
    ) {
      return option.setName(
        "member"
      ).setDescription(
        "member to give points"
      ).setRequired(
        true
      );
    }
  ).addNumberOption(
    function (
      option
    ) {
      return option.setName(
        "interval"
      ).setDescription(
        "time interval (hours) between messages"
      ).setMinValue(
        1
      ).setMaxValue(
        10000
      ).setRequired(
        true
      );
    }
  ).addNumberOption(
    function (
      option
    ) {
      return option.setName(
        "period"
      ).setDescription(
        "time period (hours) to expiration"
      ).setMinValue(
        2
      ).setMaxValue(
        10000
      ).setRequired(
        true
      );
    }
  ).addStringOption(
    function (
      option
    ) {
      return option.setName(
        "reason"
      ).setDescription(
        "reason description"
      ).setRequired(
        true
      );
    }
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "give-promotion-points"
  ).setDescription(
    "give promotion points to a member"
  ).addUserOption(
    function (
      option
    ) {
      return option.setName(
        "member"
      ).setDescription(
        "member to give points"
      ).setRequired(
        true
      );
    }
  ).addNumberOption(
    function (
      option
    ) {
      return option.setName(
        "points"
      ).setDescription(
        "points amount to give"
      ).setMinValue(
        -100000
      ).setMaxValue(
        100000
      ).setRequired(
        true
      );
    }
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "give-reputation-point"
  ).setDescription(
    "give reputation point to a member"
  ).addUserOption(
    function (
      option
    ) {
      return option.setName(
        "member"
      ).setDescription(
        "member to give point"
      ).setRequired(
        true
      );
    }
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "roll-dice"
  ).setDescription(
    "roll dice 6"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "save"
  ).setDescription(
    "save points into database"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "view-promotion-points"
  ).setDescription(
    "view points to next rank"
  ).addUserOption(
    function (
      option
    ) {
      return option.setName(
        "member"
      ).setDescription(
        "member points"
      ).setRequired(
        false
      );
    }
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "view-reputation-points"
  ).setDescription(
    "view reputation points of a member"
  ).addUserOption(
    function (
      option
    ) {
      return option.setName(
        "member"
      ).setDescription(
        "member reputation points"
      ).setRequired(
        false
      );
    }
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-join"
  ).setDescription(
    "map game - join game"
  ).addStringOption(
    function (
      option
    ) {
      return option.setName(
        "nickname"
      ).setDescription(
        "nickname, party or whatever you like"
      ).setRequired(
        true
      );
    }
  ).addNumberOption(
    function (
      option
    ) {
      return option.setName(
        "red"
      ).setDescription(
        "red channel value (0 to 128) for color to show on map"
      ).setMinValue(
        0
      ).setMaxValue(
        128
      ).setRequired(
        true
      );
    }
  ).addNumberOption(
    function (
      option
    ) {
      return option.setName(
        "green"
      ).setDescription(
        "green channel value (0 to 128) for color to show on map"
      ).setMinValue(
        0
      ).setMaxValue(
        128
      ).setRequired(
        true
      );
    }
  ).addNumberOption(
    function (
      option
    ) {
      return option.setName(
        "blue"
      ).setDescription(
        "blue channel value (0 to 128) for color to show on map"
      ).setMinValue(
        0
      ).setMaxValue(
        128
      ).setRequired(
        true
      );
    }
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-take-province"
  ).setDescription(
    "map game - take a province and assign action points to"
  ).addStringOption(
    function (
      option
    ) {
      return option.setName(
        "province-name"
      ).setDescription(
        "province name with no abbreviations"
      ).setRequired(
        true
      );
    }
  ).addNumberOption(
    function(
      option
    ) {
      return option.setName(
        "action-points"
      ).setDescription(
        "action points value (0 to 100) to defend your province"
      ).setMinValue(
        0
      ).setMaxValue(
        100
      ).setRequired(
        true
      );
    }
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-view-profile"
  ).setDescription(
    "map game - view profile game data"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-view-map"
  ).setDescription(
    "map game - view map game image"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-chart-players-score"
  ).setDescription(
    "map game - chart top 10 players score"
  )
);
for (
  const command of commands
) {
  command.toJSON();
}
try {
  const data = await rest.put(
    Routes.applicationCommands(
      process.env.client_id
    ),
    {
      body: commands
    }
  );
  console.log(
    `successfully reloaded ${data.length} application slash commands`
  );
} catch (
  __error
) {
  console.error(
    __error
  );
}