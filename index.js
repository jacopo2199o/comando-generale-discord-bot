import {
  Client,
  GatewayIntentBits,
  Partials
} from "discord.js";
import dotenv from "dotenv";
import {
  activity
} from "./events/activity.js";
import {
  dropAnnounce
} from "./events/drop-announce.js";
import {
  dropPromotionPoints
} from "./events/drop-promotion-points.js";
import {
  guildMemberAdd
} from "./events/guild-member-add.js";
import {
  guildMemberRemove
} from "./events/guild-member-remove.js";
import {
  guildMemberUpdate
} from "./events/guild-member-update.js";
import {
  interactionCreate
} from "./events/interaction-create.js";
import {
  inviteCreate
} from "./events/invite-create.js";
import {
  messageCreate
} from "./events/message-create.js";
import {
  messageDelete
} from "./events/message-delete.js";
import {
  messageReactionAdd
} from "./events/message-reaction-add.js";
import {
  messageReactionRemove
} from "./events/message-reaction-remove.js";
import {
  pointsDecay
} from "./events/points-decay.js";
import {
  pointsDistribution
} from "./events/points-distribution.js";
import {
  ready
} from "./events/ready.js";
import {
  threadCreate
} from "./events/thread-create.js";

// Configurazione
dotenv.config();

if (
  !process.env.bot_token
) {
  throw new Error(
    "il token del bot non è configurato nel file .env"
  );
}

const clientConfig = {
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildPresences
  ],
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
  ]
};
const client = new Client(
  clientConfig
);
// Registrazione eventi
const events = {
  ready,
  activity,
  dropPromotionPoints,
  dropAnnounce,
  interactionCreate,
  inviteCreate,
  guildMemberAdd,
  guildMemberRemove,
  guildMemberUpdate,
  messageCreate,
  messageDelete,
  messageReactionAdd,
  messageReactionRemove,
  pointsDecay,
  pointsDistribution,
  threadCreate
};

Object.entries(
  events
).forEach(
  (
    [eventName, handler]
  ) => {
    client.on(
      eventName,
      handler
    );
  }
);

// Gestione errori globali
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught exception:", error);
});

// Login
client.login(process.env.bot_token)
  .then(() => console.log("Login effettuato con successo"))
  .catch(error => console.error("Errore durante il login:", error));
