import { SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('replies with pong');
export async function executionAsyncResource(interaction) {
    await interaction.reply('pong');
}