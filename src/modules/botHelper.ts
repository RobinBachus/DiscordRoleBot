import { Client } from "discord.js";

import { logging } from "./logging";
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

		logging.logInfoMessage("Setting up database");
		try {
			success.push(await this.db.init());
		} catch (e) {
			success.push(false);
		}

		logging.logInfoMessage("Initializing guilds");
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

	// TODO: Implement function
	public async updateJsonCache() {
		let cache = {
			bot_info: {},
			guilds: Array<IGuild>(),
		};
		cache.bot_info = await this.db.getBotInfo();
		cache.guilds = await this.db.find({} as IMultipleGuildSearch);

		this.json.jsonFile.writeJsonFile(cache as IJsonCacheData);
	}

	// TODO: Implement function
	public updateDiscordCache() {}
}
