import { Client, Events, GatewayIntentBits, MessageReaction } from "discord.js";
import * as dotenv from "dotenv";

import { colors } from "./modules/common";
import { JsonHandler } from "./modules/jsonHandler";
import { botHelper } from "./modules/botHelper";

dotenv.config();

const json = new JsonHandler();
const bot = new botHelper();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on("ready", async () => {
  const initSuccessList = await bot.initialize(client);

  console.log(colors.Bright + "");

  const initSuccess = !initSuccessList.includes(false);

  if (initSuccess) {
    console.log(colors.FgGreen + "ready!" + colors.Reset + "\n");
    process.exit(0);
  } else {
    console.log(
      colors.FgRed +
        "Failed to properly initialize, exiting..." +
        colors.Reset +
        "\n"
    );
    process.exit(1);
  }
});

client.on(Events.MessageReactionAdd, (reaction, user) => {
  console.log("Reaction received");

  const filter = (reaction: MessageReaction) => {
    const icon = reaction.emoji.name;
    const guildID = reaction.message.guild?.id;
    if (!icon || !guildID) {
      console.warn(
        `Received reaction with empty role or guild (role icon: ${icon}, guildID: ${guildID})`
      );
      return false;
    }
    const guild = json.guilds.findIGuildWithId(guildID);
    if (!guild) {
      console.warn(`Could not find guild with id '${guildID}')`);
      return false;
    }
    return json.roles.findIRoleWithIcon(icon, guild) !== undefined;
  };

  const message = reaction.message;

  const collector = message.createReactionCollector({ filter, time: 3000 });

  collector.on("collect", (reaction, user) => {
    console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
  });

  collector.on("end", (collected) => {
    console.log(`Collected ${collected.size} items`);
  });
});

client.login(process.env.TOKEN);
