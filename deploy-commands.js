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
    option => option.setName(
      "member"
    ).setDescription(
      "member to give points"
    ).setRequired(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "period"
    ).setDescription(
      "time period (hours) to expiration"
    ).setMinValue(
      1
    ).setMaxValue(
      10000
    ).setRequired(
      true
    )
  ).addStringOption(
    option => option.setName(
      "reason"
    ).setDescription(
      "reason description"
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "cooldown"
  ).setDescription(
    "apply cooldown penalty to a member"
  ).addUserOption(
    option => option.setName(
      "member"
    ).setDescription(
      "member to give points"
    ).setRequired(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "interval"
    ).setDescription(
      "time interval (hours) between messages"
    ).setMinValue(
      1
    ).setMaxValue(
      10000
    ).setRequired(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "period"
    ).setDescription(
      "time period (hours) to expiration"
    ).setMinValue(
      2
    ).setMaxValue(
      10000
    ).setRequired(
      true
    )
  ).addStringOption(
    option => option.setName(
      "reason"
    ).setDescription(
      "reason description"
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "give-promotion-points"
  ).setDescription(
    "give promotion points to a member"
  ).addUserOption(
    option => option.setName(
      "member"
    ).setDescription(
      "member to give points"
    ).setRequired(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "points"
    ).setDescription(
      "points amount to give"
    ).setMinValue(
      -100000
    ).setMaxValue(
      100000
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "give-reputation-point"
  ).setDescription(
    "give reputation point to a member"
  ).addUserOption(
    option => option.setName(
      "member"
    ).setDescription(
      "member to give point"
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "roll-dice"
  ).setDescription(
    "roll dice and get a random number between 1 and 6 included"
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
    option => option.setName(
      "member"
    ).setDescription(
      "member points"
    ).setRequired(
      false
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "view-reputation-points"
  ).setDescription(
    "view reputation points of a member"
  ).addUserOption(
    option => option.setName(
      "member"
    ).setDescription(
      "member reputation points"
    ).setRequired(
      false
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-join"
  ).setDescription(
    "join game"
  ).addStringOption(
    option => option.setName(
      "nickname"
    ).setDescription(
      "nickname, party or whatever you like"
    ).setRequired(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "red"
    ).setDescription(
      "red channel value (31 to 223) for color to show on map"
    ).setMinValue(
      31
    ).setMaxValue(
      223
    ).setRequired(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "green"
    ).setDescription(
      "green channel value (31 to 223) for color to show on map"
    ).setMinValue(
      31
    ).setMaxValue(
      223
    ).setRequired(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "blue"
    ).setDescription(
      "blue channel value (31 to 223) for color to show on map"
    ).setMinValue(
      31
    ).setMaxValue(
      223
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-take-province"
  ).setDescription(
    "take a province and assign action points to"
  ).addStringOption(
    option => option.setName(
      "province-name"
    ).setDescription(
      "province name with no abbreviations"
    ).setRequired(
      true
    ).setAutocomplete(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "action-points"
    ).setDescription(
      "action points value (0 to 100) to defend your province"
    ).setMinValue(
      0
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-fortify-all"
  ).setDescription(
    "fortify equally all regions of your nations"
  ).addNumberOption(
    option => option.setName(
      "action-points"
    ).setDescription(
      "action points per region"
    ).setMinValue(
      1
    ).setRequired(
      true
    )
  ).addStringOption(
    option => option.setName(
      "player-nickname"
    ).setDescription(
      "player who will receive reinforces"
    ).setRequired(
      false
    ).setAutocomplete(
      true
    ) // abilita l'autocompletamento
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-view-profile"
  ).setDescription(
    "view profile game data"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-view-province"
  ).setDescription(
    "view province game data"
  ).addStringOption(
    option => option.setName(
      "province-name"
    ).setDescription(
      "province name with no abbreviations"
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-view-map"
  ).setDescription(
    "view map game image"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-view-capitals"
  ).setDescription(
    "view a map game image of capitals"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-leaderboard"
  ).setDescription(
    "view top 10 players by score"
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-change-color"
  ).setDescription(
    "change color of your territories"
  ).addNumberOption(
    option => option.setName(
      "red"
    ).setDescription(
      "red channel value (31 to 223) for color to show on map"
    ).setMinValue(
      31
    ).setMaxValue(
      223
    ).setRequired(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "green"
    ).setDescription(
      "green channel value (31 to 223) for color to show on map"
    ).setMinValue(
      31
    ).setMaxValue(
      223
    ).setRequired(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "blue"
    ).setDescription(
      "blue channel value (31 to 223) for color to show on map"
    ).setMinValue(
      31
    ).setMaxValue(
      223
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-change-nickname"
  ).setDescription(
    "change nickname of your profile"
  ).addStringOption(
    option => option.setName(
      "nickname"
    ).setDescription(
      "nickname of your profile"
    ).setMinLength(
      0
    ).setMaxLength(
      64
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-move-action-points"
  ).setDescription(
    "move action points between provinces"
  ).addStringOption(
    option => option.setName(
      "from-province"
    ).setDescription(
      "name of the province you are transferring from"
    ).setRequired(
      true
    ).setAutocomplete(
      true
    )
  ).addStringOption(
    option => option.setName(
      "to-province"
    ).setDescription(
      "name of the province you are transferring to"
    ).setRequired(
      true
    ).setAutocomplete(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "action-points"
    ).setDescription(
      "number of action points to transfer"
    ).setMinValue(
      1
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-set-capital"
  ).setDescription(
    "set a province as your capital"
  ).addStringOption(
    option => option.setName(
      "province-name"
    ).setDescription(
      "name of the province to set as capital"
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-donate-province"
  ).setDescription(
    "donate a province to another player"
  ).addStringOption(
    option => option.setName(
      "province-name"
    ).setDescription(
      "name of the province you want to donate"
    ).setRequired(
      true
    )
  ).addStringOption(
    option => option.setName(
      "player-nickname"
    ).setDescription(
      "player who will receive the province"
    ).setRequired(
      true
    ).setAutocomplete(
      true
    ) // abilita l'autocompletamento
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-view-player"
  ).setDescription(
    "view player's regions on map and other useful data"
  ).addStringOption(
    option => option.setName(
      "player-nickname"
    ).setDescription(
      "in game player nickname to inspect"
    ).setRequired(
      true
    ).setAutocomplete(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-set-diplomacy"
  ).setDescription(
    "set your diplomacy stance with other players"
  ).addStringOption(
    option => option.setName(
      "player-nickname"
    ).setDescription(
      "player nickname to adjust diplomatic relations with"
    ).setRequired(
      true
    ).setAutocomplete(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "relation-value"
    ).setDescription(
      "relation value from war (-3) to allies (3)"
    ).setMinValue(
      -3
    ).setMaxValue(
      3
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-set-nation-profile"
  ).setDescription(
    "edit your nation profile of action points distribution"
  ).addNumberOption(
    option => option.setName(
      "resources-population"
    ).setDescription(
      "action points distribution of resources (up to -4) over population (up to 4)"
    ).setMinValue(
      -4
    ).setMaxValue(
      4
    ).setRequired(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "materials-food"
    ).setDescription(
      "resources distribution of raw materials (up to -4) over food goods (up to 4)"
    ).setMinValue(
      -4
    ).setMaxValue(
      4
    ).setRequired(
      true
    )
  ).addNumberOption(
    option => option.setName(
      "civilians-military"
    ).setDescription(
      "population distribution of civilians (up to -4) over military (up to 4)"
    ).setMinValue(
      -4
    ).setMaxValue(
      4
    ).setRequired(
      true
    )
  )
);
commands.push(
  new SlashCommandBuilder().setName(
    "mg-view-nation-profile"
  ).setDescription(
    "view player's nation profile and other useful data"
  ).addStringOption(
    option => option.setName(
      "player-nickname"
    ).setDescription(
      "in game player nickname to inspect"
    ).setRequired(
      true
    ).setAutocomplete(
      true
    )
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