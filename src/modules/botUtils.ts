import { Client, TextChannel } from "discord.js";

export class utils {
	static async roleMessageExists(client: Client, guild: IGuild, roleMessage?: string) {
		// Get the channel used by the bot
		const channel = client.channels.cache.get(guild.roles_channel.channel_id) as TextChannel;
		// Get all messages in the channel
		const messages = await channel.messages.fetch();
		// Create the role message for the server if no message was provided
		roleMessage ??= await this.createRoleMessage(client, guild);
		for (let m of messages.values()) {
			// If a message in the channel matches the generated message, return true
			if (m.content === roleMessage) {
				return true;
			}
		}
		// If no messages match, return false
		return false;
	}

	static async createRoleMessage(client: Client, guild: IGuild) {
		let message = guild.roles_channel.message;
		let padding = 0;
		for (const role of guild.roles) {
			if (role.name.length > padding) padding = role.name.length;
		}
		const currentGuild = client.guilds.fetch(guild.guild_id);
		const emojis = (await currentGuild).emojis;

		for (const role of guild.roles) {
			let icon: string | undefined = role.icon;
			if (icon.length > 2) {
				icon = (await emojis.fetch(icon)).toString();
			}

			const members = await this.getMembersWithRole(client, guild, role);
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
