import { Client } from "discord.js";
import { logging } from "./logging";
import { cacheManager } from "./cacheManager";

const logger = new logging(3);
const cache = new cacheManager(logger);

export class botHelper {
  public async initialize(client: Client) {
    // TODO: Add initializer for json file and json handler
    let success = new Array<boolean>();

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
}

