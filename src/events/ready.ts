import { Client, Events, TextChannel } from "discord.js";

import dotenv from "dotenv";

import { Color, getDateTimeString } from "../modules/common";
import { botManager } from "../modules/botManager";
import { LogLevel, logging } from "../modules/logging";
import { jsonHandler } from "../modules/jsonHandler";
import { utils } from "../modules/botUtils";

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

		if (initSuccess) {
			console.log(Color.FgGreen + "ready!" + Color.Reset + "\n");

			// FIXME: remove after message is sent
			let json = new jsonHandler();
			let iGuild = json.guilds.findIGuildWithId("1116382943762456697")!;

			const roleMessage = await utils.createRoleMessage(client, iGuild);
			console.log(roleMessage);
			const mExist = await utils.roleMessageExists(client, iGuild, roleMessage);
			console.log(mExist);

			const guild = await client.guilds.fetch("1116382943762456697");
			const channel = await guild.channels.fetch("1116405343841427517");

			if (channel && !mExist) {
				console.log(channel.name);
				let text = channel as TextChannel;
				const messages = await text.messages.fetch({ limit: 100 });
				text.bulkDelete(messages);

				text.send(roleMessage);
			}
		} else {
			console.log(
				Color.FgRed + "Failed to properly initialize, exiting..." + Color.Reset + "\n"
			);
			process.exit(1);
		}
	},
};
