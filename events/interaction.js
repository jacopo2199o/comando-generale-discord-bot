import {
  Events,
  Collection
} from "discord.js";

const name = Events.InteractionCreate;

/**
 * @param {import("discord.js").Interaction} interaction
 */
const execute = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`no command matching ${interaction.commandName} was found.`);
    return;
  }

  const { cooldowns } = interaction.client;

  if (!cooldowns.has(command.data.name)) cooldowns.set(command.data.name, new Collection());

  const now = Date.now();
  const timestamps = cooldowns.get(command.data.name);
  const cooldownAmount = command.cooldown * 1000;

  if (timestamps.has(interaction.user.id)) {
    const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

    if (now < expirationTime) {
      return interaction.reply({
        content: `please wait, you are on cooldown for /${command.data.name}`,
        ephemeral: true
      });
    }
  }

  timestamps.set(interaction.user.id, now);
  setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

  await command.execute(interaction);
};

export {
  name,
  execute
};