import { Client } from "discord.js";

import { LogLevel, PR, logging } from "./logging";
import { cacheManager } from "./cacheManager";
import { dbHandler } from "./dbHandler";
import { jsonHandler } from "./jsonHandler";

export class botHelper {
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

			success.push(await this.cache.updateGuildMembers(guild));
			const channel = await this.cache.updateGuildChannel(guild);
			success.push(channel !== null);
			success.push(await this.cache.updateGuildMessages(guild, channel));
		}

		return success;
	}

	public async updateJsonCache() {
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
	public updateDiscordCache() {}
}
