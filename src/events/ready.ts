import { Client, Events } from "discord.js";

import dotenv from "dotenv";

import { Color, getDateTimeString } from "../modules/common";
import { botHelper } from "../modules/botHelper";
import { LogLevel, logging } from "../modules/logging";

dotenv.config();

const bot = new botHelper();

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

		if (initSuccess) {
			console.log(Color.FgGreen + "ready!" + Color.Reset + "\n");
		} else {
			console.log(
				Color.FgRed + "Failed to properly initialize, exiting..." + Color.Reset + "\n"
			);
			process.exit(1);
		}
	},
};
