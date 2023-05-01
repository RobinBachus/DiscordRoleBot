import {Events, MessageReaction, User } from "discord.js";

import dotenv from "dotenv";

import { jsonHandler } from "../modules/jsonHandler";

dotenv.config();

const json = new jsonHandler();

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction: MessageReaction, user: User) {
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
	},
};
