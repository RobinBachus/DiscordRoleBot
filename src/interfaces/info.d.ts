/**
 * This is the an object representing the json file that contains all
 * custom- and identification information about the guilds that the bot manages.
 *
 * The bot_info property holds info about the bot itself like name, id, version,
 * start date/time and the amount of guilds that are currently managed.
 *
 * @remarks
 * To get or set values, the jsonHandler class should be used where possible. It uses some checks
 * to make sure the information is up-to-date and not mishandled.
 */
interface IJsonCacheData {
	bot_info: IBotInfo;
	guilds: IGuild[];
}

/**
 * General info about the bot
 */
interface IBotInfo {
	_id: { $oid: string };
	bot_id: string;
	name: string;
	version: string;
	start_date: { $date: { $numberLong: string } };
	last_update: { $date: { $numberLong: string } };
}

/**
 * All info about a specific guild
 */
interface IGuild {
	guild_name: string;
	guild_id: string;
	roles: IRole[];
	roles_channel: IRoleMessageChannel;
}

/**
 * All info about a specific role
 */
interface IRole {
	icon: string;
	name: string;
	role_id: string;
}

/**
 * All info about a specific message channel
 */
interface IMessageChannel {
	channel_name: string;
	channel_id: string;
}

/**
 * This contains info about the message channel that the bot is active on for roles
 */
interface IRoleMessageChannel extends IMessageChannel {
	message: string;
}
