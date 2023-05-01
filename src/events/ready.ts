import { Client, Events } from "discord.js";

import dotenv from "dotenv";

import { colors } from "../modules/common";
import { botHelper } from "../modules/botHelper";

dotenv.config();

const bot = new botHelper();

module.exports = {
	name: Events.ClientReady,
	once: true,
	async execute(client: Client) {
        if (!client.user) throw new Error("Client has no user!")
        console.log(`Client logged in as ${client.user.tag}`);

        const initSuccessList = await bot.initialize(client);

		console.log(colors.Bright + "");

		const initSuccess = !initSuccessList.includes(false);

		if (initSuccess) {
			console.log(colors.FgGreen + "ready!" + colors.Reset + "\n");
			process.exit(0);
		} else {
			console.log(
				colors.FgRed + "Failed to properly initialize, exiting..." + colors.Reset + "\n"
			);
			process.exit(1);
		}
	},
};