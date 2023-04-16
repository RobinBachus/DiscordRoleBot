import { Client } from "discord.js";
import { logging } from "./logging";
import { cacheManager } from "./cacheManager";
import { dbHandler } from "./dbHandler";
import { JsonHandler } from "./jsonHandler";
import { writeFile } from "fs/promises";

const logger = new logging(3);
const cache = new cacheManager(logger);
const json = new JsonHandler();
const db = new dbHandler(logger);

export class botHelper {
	public async initialize(client: Client) {
		// TODO: Add initializer for json file and json handler
		let success = new Array<boolean>();

		logger.logInfoMessage("Setting up database");
		try {
			success.push(await db.init());
		} catch (e) {
			success.push(false);
		}

		logger.logInfoMessage("Initializing guilds");
		const guilds = await client.guilds.fetch();

		for (let g of guilds) {
			const guild = await cache.fetchGuild(g[1]);
			if (!guild) continue;

			success.push(await cache.updateGuildMembers(guild));
			const channel = await cache.updateGuildChannel(guild);
			success.push(channel !== null);
			success.push(await cache.updateGuildMessages(guild, channel));
		}

		return success;
	}

	// TODO: Implement function
	public async updateJsonCache() {
		let cache = {
			bot_info: {},
			guilds: Array<IGuild>(),
		};
		cache.bot_info = await db.getBotInfo();
		cache.guilds = await db.find({} as IMultipleGuildSearch);

		json.jsonFile.writeJsonFile(cache as IJsonCacheData);
	}

	// TODO: Implement function
	public updateDiscordCache() {}
}
