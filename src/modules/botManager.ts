import { Client, Guild, GuildBasedChannel, Message, TextChannel } from "discord.js";

import { LogLevel, PR, logging } from "./logging";
import { cacheManager } from "./cacheManager";
import { dbHandler } from "./dbHandler";
import { jsonHandler } from "./jsonHandler";
import { utils } from "./botUtils";
import { Color, colorText } from "./common";

export class botManager {
	private json: jsonHandler;
	private cache: cacheManager;
	private db: dbHandler;

	constructor() {
		this.json = new jsonHandler();
		this.cache = new cacheManager();
		this.db = new dbHandler();
	}

	public async initialize(client: Client) {
		// TODO: Add initializer for json file and json handler
		let success = new Array<boolean>();
		const failed = new Array<string>();

		logging.setLogLevel(LogLevel.INFO);
		

		logging.logMessage("Setting up database", LogLevel.INFO);
		try {
			success.push(await this.db.init());
		} catch (e) {
			success.push(false);
		}

		try {
			await this.updateJsonCache();
			success.push(true);
		} catch (e) {
			success.push(false);
		}

		logging.logMessage("Initializing guilds", LogLevel.INFO);
		const guilds = await client.guilds.fetch();

		for (let g of guilds) {
			const guild = await this.cache.fetchGuild(g[1]);
			if (!guild) continue;
			const iGuild = this.json.guilds.findIGuildWithId(guild.id);
			if (!iGuild) {
				const guildName = colorText(Color.FgRed, `${guild.name} (id: ${guild.id})`);
				logging.logMessage(
					`Guild ${guildName} is not found on the database, skipping updates.\n `,
					LogLevel.WARN,
					false
				);
				continue;
			}

			success.push(await this.cache.updateGuildMembers(guild));
			const channel = (await this.cache.updateGuildChannel(guild)) as TextChannel;
			success.push(channel !== null);
			success.push(await this.cache.updateGuildMessages(guild, channel));
			// FIXME
			try {
				const message = await utils.UpdateRoleMessageIfNewer(client, iGuild, channel);
				if (message) await utils.UpdateReactions(iGuild, channel, message.id);
			} catch (e) {
				if (e instanceof Error) console.log(e.name);
			}
			// Newline between guilds in log
			console.log("");
		}

		return success;
	}

	private async updateJsonCache() {
		logging.logProcessStart("Updating cache.json from database");
		let cache = {
			bot_info: {},
			guilds: Array<IGuild>(),
		};
		try {
			cache.bot_info = await this.db.getBotInfo();
			cache.guilds = await this.db.find({} as IMultipleGuildSearch);

			this.json.jsonFile.writeJsonFile(cache as IJsonCacheData);
			logging.logProcessResult(PR.OK);
		} catch (e) {
			logging.logProcessResult(PR.FAILED, e as string);
		}
	}

	// TODO: Implement function
	private updateDiscordCache() {}
}
