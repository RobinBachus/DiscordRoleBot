import { Guild, ChannelType, TextChannel, OAuth2Guild } from "discord.js";
import { jsonHandler } from "./jsonHandler";
import { logging } from "./logging";

const json = new jsonHandler();

export class cacheManager {
	async fetchGuild(OAuth2Guild: OAuth2Guild) {
		logging.logFetch("guild", OAuth2Guild.name);
		return await OAuth2Guild.fetch()
			.then((guild) => {
				logging.logProcessResult(true);
				return guild;
			})
			.catch((reason) => {
				logging.logProcessResult(false, reason);
				return null;
			});
	}

	async updateGuildMembers(discordGuild: Guild, timeout = 2000) {
		logging.logUpdateStart(discordGuild.name, "member cache");

		const success = await discordGuild.members
			.fetch({ time: timeout, force: true })
			.then(() => {
				logging.logProcessResult(true);
				return true;
			})
			.catch((reason) => {
				logging.logProcessResult(false, reason);
				return false;
			});
		return success;
	}

	async updateGuildChannel(discordGuild: Guild) {
		logging.logUpdateStart(discordGuild.name, "role channel cache");

		const iGuild = json.guilds.findIGuildWithId(discordGuild.id);
		let roleChannel: IRoleMessageChannel;
		if (iGuild) roleChannel = iGuild.roles_channel;
		else {
			const reason = `[ERROR] Could not find guild '${discordGuild.name}' with id '${discordGuild.id}' in JSON`;
			logging.logProcessResult(false, reason);
			return null;
		}

		const channel = await discordGuild.channels
			.fetch(roleChannel.channel_id, {
				force: true,
				cache: true,
			})
			.then((channel) => {
				if (!channel) {
					const reason = `[ERROR] Unable to find role channel with id '${roleChannel.channel_id}'`;
					logging.logProcessResult(false, reason);
					return null;
				}
				if (channel.type !== ChannelType.GuildText) {
					const reason = `[ERROR] Role channel '${
						channel.name
					}' is not a text channel ('GuildText') but a '${
						ChannelType[channel.type]
					}' channel`;
					logging.logProcessResult(false, reason);
					return null;
				}
				logging.logProcessResult(true);
				return channel;
			})
			.catch((reason) => {
				logging.logProcessResult(false, reason);
				return null;
			});

		return channel as TextChannel | null;
	}

	async updateGuildMessages(discordGuild: Guild, channel: TextChannel | null) {
		logging.logUpdateStart(discordGuild.name, "message cache");

		if (!channel) {
			logging.logProcessResult(false, "Role channel not found", true);
			return false;
		}

		const success = await channel.messages
			.fetch({ cache: true })
			.then(() => {
				logging.logProcessResult(true);
				return true;
			})
			.catch((reason) => {
				logging.logProcessResult(false, reason);
				return false;
			});

		return success;
	}
}
