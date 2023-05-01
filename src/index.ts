import { Client, Events, GatewayIntentBits, MessageReaction } from "discord.js";

import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { jsonHandler } from "./modules/jsonHandler";
import { botHelper } from "./modules/botHelper";
import { logging } from "./modules/logging";

dotenv.config();

const json = new jsonHandler();
const bot = new botHelper();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
	],
});

client.on("ready", async () => {});

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

const eventsPath = path.join(__dirname, "events");
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".js"));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.TOKEN);
