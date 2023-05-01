import { Client, GatewayIntentBits } from "discord.js";

import dotenv from "dotenv";
import path from "path";
import fs from "fs";

import { jsonHandler } from "./modules/jsonHandler";
import { botHelper } from "./modules/botHelper";

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

// This adds the eventHandlers from the events folders into the program
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
