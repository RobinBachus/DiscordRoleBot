import { Client, Events } from "discord.js";

import dotenv from "dotenv";

import { colors, getDateTimeString } from "../modules/common";
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

		console.log(colors.Bright + "");

		const initSuccess = !initSuccessList.includes(false);

		if (initSuccess) {
			console.log(colors.FgGreen + "ready!" + colors.Reset + "\n");
		} else {
			console.log(
				colors.FgRed + "Failed to properly initialize, exiting..." + colors.Reset + "\n"
			);
			process.exit(1);
		}
	},
};
