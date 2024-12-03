import {
	DiscordAPIError,
	Events,
	GuildMember,
	Message,
	MessageReaction,
	TextChannel,
} from "discord.js";

import dotenv from "dotenv";

import { jsonHandler } from "../modules/jsonHandler";
import { LogLevel, logging } from "../modules/logging";
import { utils } from "../modules/botUtils";

dotenv.config();
const json = new jsonHandler();

const TimeoutBuffer = new Map<Message, ReturnType<typeof setTimeout>>();

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction: MessageReaction) {
		if (reaction.count <= 1) {
			logging.logMessage("Reaction was added to a message", LogLevel.TRACE, false);
			return;
		}
		logging.logMessage("Reaction received", LogLevel.DEBUG, false);

		const message = reaction.message as Message;

		let timeout = TimeoutBuffer.get(message);
		if (timeout) clearTimeout(timeout);
		TimeoutBuffer.set(message, setTimeout(processRoleChanges, 1000, message));
	},
};

async function processRoleChanges(message: Message) {
	message = await message.fetch();
	const guild = await message.guild?.fetch();
	if (!guild) {
		logging.logMessage("Could not find guild to process role change", LogLevel.ERROR);
		return;
	}
	const reactions = message.reactions.cache;

	for (const reaction of reactions.values()) {
		const users = (await reaction.users.fetch()).filter((u) => !u.bot);
		if (users.size !== 0) {
			users.forEach(async (user) => {
				const usr = await guild.members.fetch(user.id);
				const role = getIRole(reaction);
				if (usr && role) toggleRole(usr, role);
				await reaction.users.remove(user);
			});
		}
	}

	const iGuild = json.guilds.findIGuildWithId(guild.id);
	if (!iGuild) {
		logging.logMessage(
			`Could not find guild '${guild.name}'(id: '${guild.id}) in database`,
			LogLevel.WARN
		);
		return;
	}
	utils.UpdateRoleMessageIfNewer(
		message.client,
		iGuild,
		(await message.channel.fetch()) as TextChannel
	);
}

function getIRole(reaction: MessageReaction) {
	// This enables using custom emojis by id
	let _icon = reaction.emoji.name ?? undefined;
	if (_icon && _icon.length > 2) _icon = utils.getEmojiFromName(reaction.client, _icon)?.id;
	if (!_icon) throw new Error(`Received invalid emoji '${reaction.emoji.name}'`);
	const icon = _icon;

	const guildID = reaction.message.guild?.id;

	let role: IRole | undefined;

	try {
		if (!icon || !guildID)
			throw new Error(
				`Received reaction with empty role or guild 
				(role icon: ${icon ?? "not found"}
				, guildID: ${guildID ?? "not found"})`
			);

		const guild = json.guilds.findIGuildWithId(guildID);
		if (!guild) throw new Error(`Could not find guild with id '${guildID}'`);

		role = json.roles.findIRoleWithIcon(icon, guild);
		if (!role)
			throw new Error(
				`Could not find role with icon '${icon}' on guild '${guild.guild_name}' (id: ${guild.guild_id})`
			);
	} catch (e) {
		const error = e as Error;
		logging.logMessage(error.message, LogLevel.ERROR);
		return null;
	}

	return role;
}

async function toggleRole(user: GuildMember, role: IRole) {
	const id = role.role_id;
	const _role = user.roles.cache.find((role) => role.id === id);
	let action: "ADD" | "REMOVE";
	try {
		if (_role) {
			await user.roles.remove(_role);
			action = "REMOVE";
		} else {
			await user.roles.add(id);
			action = "ADD";
		}
	} catch (e) {
		if (e instanceof DiscordAPIError) {
			let error = `${e.name}: ${e.message}`;
			error = error
				.split(/\n/)
				.map((ele) => `     => ${ele}`)
				.join("\n");
			const roleStr = `'${role.name} (id: ${role.role_id})'`;
			const userStr = `'${user.displayName} (id: ${user.id})'`;
			const message = `Couldn't toggle role ${roleStr} to ${userStr}:\n${error}`;
			logging.logMessage(message, LogLevel.ERROR);
			return null;
		} else {
			throw e;
		}
	}
	logging.logRoleToggled(action, user.displayName, role.name, role.icon, user.guild.name);
}
