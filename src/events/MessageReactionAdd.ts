import { Events, GuildMember, Message, MessageReaction, User } from "discord.js";

import dotenv from "dotenv";

import { jsonHandler } from "../modules/jsonHandler";

dotenv.config();
const json = new jsonHandler();

const TimeoutBuffer = new Map<Message, ReturnType<typeof setTimeout>>();

module.exports = {
	name: Events.MessageReactionAdd,
	async execute(reaction: MessageReaction, user: User) {
		console.log("Reaction received");

		const message = reaction.message as Message;

		let TimeOut = TimeoutBuffer.get(message);
		if (TimeOut) clearTimeout(TimeOut);
		TimeoutBuffer.set(message, setTimeout(processRoleChanges, 1500, message));
	},
};

async function processRoleChanges(message: Message) {
	message = await message.fetch();
	const reactions = message.reactions.cache;

	reactions.forEach(async (r) => {
		const users = (await r.users.fetch()).filter((u) => !u.bot);
		if (users.size !== 0) {
			console.group(r.emoji.name);

			users.forEach(async (user) => {
				const usr = await message.guild?.members.fetch(user.id);
				const role = getIRole(r);
				if (usr && role) toggleRole(usr, role);
				r.users.remove(user);
			});

			console.groupEnd();
		}
	});
}

function getIRole(reaction: MessageReaction) {
	const icon = reaction.emoji.name;
	const guildID = reaction.message.guild?.id;
	if (!icon || !guildID) {
		console.warn(
			`Received reaction with empty role or guild (role icon: ${icon}, guildID: ${guildID})`
		);
		return null;
	}
	const guild = json.guilds.findIGuildWithId(guildID);
	if (!guild) {
		console.warn(`Could not find guild with id '${guildID}'`);
		return null;
	}

	const role = json.roles.findIRoleWithIcon(icon, guild);
	if (!role) {
		console.warn(
			`Could not find role with icon '${icon} on guild '${guild.guild_name}' (id: ${guild.guild_id})`
		);
		return null;
	}

	return role;
}

async function toggleRole(user: GuildMember, role: IRole) {
	const id = role.role_id;
	const _role = user.roles.cache.find((role) => role.id === id);
	if (_role) {
		user.roles.remove(_role);
		console.log(`Removed role '${role.name}' from user ${user.displayName}`);
	} else {
		user.roles.add(id);
		console.log(`Gave role '${role.name}' to user ${user.displayName}`);
	}
}
