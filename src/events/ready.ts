import { Client, Events } from "discord.js";

import dotenv from "dotenv";

import { Color, getDateTimeString } from "../modules/common";
import { botManager } from "../modules/botManager";
import { LogLevel, logging } from "../modules/logging";

dotenv.config();

const bot = new botManager();

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client: Client) {
		logging.logMessage(`Started on ${getDateTimeString()}`, LogLevel.INFO);
		if (!client.user) throw new Error("Client has no user!");
		logging.logMessage(
			`Client successfully logged in as ${client.user.tag}`,
			LogLevel.INFO,
			false
		);

		const initSuccessList = await bot.initialize(client);

		console.log(Color.Bright + "");

		const initSuccess = !initSuccessList.includes(false);

		if (initSuccess) logging.logMessage("ready!\n", LogLevel.INFO);
		else if (process.env.NODE_ENV !== "production")
			logging.logMessage("Some processes failed, bot might be unstable\n", LogLevel.WARN);
		else {
			logging.logMessage("Failed to properly initialize, exiting...\n", LogLevel.FATAL);
			// TODO: create more graceful exit
			process.exit(1);
		}
	},
};
