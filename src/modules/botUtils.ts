import { Client, Collection, Message, TextChannel } from "discord.js";
import { PR, logging } from "./logging";

export class utils {
	// I might move this at some point
	// I also might not...
	/** The Discord ID of the bot */
	static botID = "926211660849500190";

	/**
	 * Updates the role message on a guild if it does not match the a new generated role message
	 * @param client The logged in Discord client
	 * @param iGuild The guild to update the role message on
	 * @param channel (Optional) The channel the role message is located in
	 * @returns
	 */
	static async UpdateRoleMessageIfNewer(client: Client, iGuild: IGuild, channel?: TextChannel) {
		logging.logUpdateStart(iGuild.guild_name, "role message");
		const roleMessage = await utils.createRoleMessage(client, iGuild);
		const botMessages = await utils.getBotMessages(client, iGuild);

		if (!channel) {
			const guild = client.guilds.cache.get(iGuild.guild_id);
			const _channel = guild?.channels.cache.get(iGuild.roles_channel.channel_id);
			if (!_channel) {
				logging.logProcessResult(
					PR.FAILED,
					`Unable to find channel '${iGuild.roles_channel.channel_id}' ` +
						`on guild '${iGuild.guild_name} (id: ${iGuild.guild_id})'`
				);
				return null;
			} else channel = _channel as TextChannel;
		}

		const _message = await utils.getRoleMessageIfExists(
			client,
			iGuild,
			roleMessage,
			botMessages
		);

		if (!_message) {
			return await channel
				.send(roleMessage)
				.then((m) => {
					logging.logProcessResult(PR.OK);
					return m;
				})
				.catch((e) => {
					logging.logProcessResult(PR.FAILED, e);
					return null;
				});
		} else if (!_message.upToDate) {
			return await _message.message
				.edit(roleMessage)
				.then((m) => {
					logging.logProcessResult(PR.OK);
					return m;
				})
				.catch((e) => {
					logging.logProcessResult(PR.FAILED, e);
					return null;
				});
		} else {
			logging.logProcessResult(PR.SKIPPED, "Message up to date");
			// Return message as success because this skip is not a problem
			return _message.message;
		}
	}

	static async UpdateReactions(iGuild: IGuild, channel: TextChannel, messageId: string) {
		const message = await channel.messages.fetch(messageId);
		const reactions = message.reactions.cache;
		for (let role of iGuild.roles) {
			const reaction = reactions.get(role.icon);
			if (!reaction) message.react(role.icon);
		}
	}

	/**
	 * Checks if the bot generated role message is present in the provided guild
	 * @param client The logged in Discord client
	 * @param IGuild The server/guild to look at
	 * @param roleMessage (Optional) use a pregenerated message to use as check
	 * @param botMessages (Optional) the messages to check for matches
	 * @returns An object with a `message` property that contains the matching message and a `upToDate`
	 * property that will be true if the member count and roles in the message are up to date and false if not.
	 * `null` is returned if no matching message is found
	 */
	static async getRoleMessageIfExists(
		client: Client,
		IGuild: IGuild,
		roleMessage?: string,
		botMessages?: Collection<string, Message<true>> | null
	) {
		// Get all messages sent by the bot
		botMessages ??= await this.getBotMessages(client, IGuild);
		// Role message won't be up to date if there are no bot sent messages in the channel
		if (!botMessages) return null;
		// Create the role message for the server if no message was provided
		roleMessage ??= await this.createRoleMessage(client, IGuild);
		for (let m of botMessages.values()) {
			// If a message in the channel fully matches the generated message, return it as up to date
			if (m.content === roleMessage) return { message: m, upToDate: true };
			// If a message in the channel only matches the custom text but not the generated part,
			// return it as not up to date
			else if (m.content.includes(IGuild.roles_channel.message))
				return { message: m, upToDate: false };
		}
		// If no messages match, return null
		return null;
	}

	static async getBotMessages(client: Client, IGuild: IGuild) {
		// Get the channel used by the bot
		const channel = client.channels.cache.get(IGuild.roles_channel.channel_id) as TextChannel;
		// Get all messages in the channel
		const messages = await channel.messages.fetch();
		if (!messages) return null;

		return messages.filter((m) => m.author.id === this.botID);
	}

	static async createRoleMessage(client: Client, IGuild: IGuild) {
		let message = IGuild.roles_channel.message;
		let padding = 0;
		for (const role of IGuild.roles) {
			if (role.name.length > padding) padding = role.name.length;
		}
		const currentGuild = await client.guilds.fetch(IGuild.guild_id);
		const emojis = currentGuild.emojis;

		for (const role of IGuild.roles) {
			let icon: string = role.icon;
			if (icon.length > 2) {
				icon = (await emojis.fetch(icon)).toString();
			}

			const members = await this.getMembersWithRole(client, IGuild, role);
			const role_name = `\`|  ${role.name}`.padEnd(padding + 5);
			const member_count = `|  current members: ${members.size}`.padEnd(23) + "`";

			message += `\n${icon}`.padEnd(icon.length + 2);
			message += role_name;
			message += member_count;
		}
		return message;
	}

	static async getMembersWithRole(client: Client, guild: IGuild, role: IRole) {
		const _guild = await client.guilds.fetch(guild.guild_id);
		const _role = await _guild.roles.fetch(role.role_id);
		return _role?.members || Promise.reject("role does not exist");
	}

	static getEmojiFromName(client: Client, emojiName: string) {
		const emoji = client.emojis.cache.find((e) => e.name === emojiName);
		return emoji;
	}
}
