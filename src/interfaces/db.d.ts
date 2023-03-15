/**
 * The types here should all work, but there are likely more that I mist.
 *
 * @inheritdoc
 */
interface IMultipleGuildSearch {
	guild_name?: string | { $in: string[] } | { $all: string[] };
	guild_id?: string | { $in: string[] } | { $all: string[] };
	/**
	 * Used to specify roles. This property is mostly if you have one or more full {@link IRole} objects.
	 *
	 * @remarks
	 * `roles: {$elemMatch: Partial<IRole>[]}` can be used to search for guilds based on properties of {@link IRole},
	 * but this is fairly limited. To search for multiple partial roles use the double quoted properties like "roles.icon"
	 */
	roles?:
		| IRole
		| { $elemMatch: Partial<IRole>[] }
		| { $in: IRole[] }
		| { $all: IRole[] };
	roles_channel?:
		| IRoleMessageChannel
		| { $in: IRoleMessageChannel[] }
		| { $all: IRoleMessageChannel[] };

	"roles.icon"?: string | { $in: string[] } | { $all: string[] };
	"roles.name"?: string | { $in: string[] } | { $all: string[] };
	"roles.role_id"?: string | { $in: string[] } | { $all: string[] };

	"roles_channel.channel_name"?:
		| string
		| { $in: string[] }
		| { $all: string[] };
	"roles_channel.channel_id"?: string | { $in: string[] } | { $all: string[] };
	"roles_channel.message"?: string | { $in: string[] } | { $all: string[] };
}

interface IUpdate<T> {
	$set: Partial<T>;
}

// Errors

/**
 * Is thrown if a guild is not found
 */
class GuildNotFoundError extends DBError {
	/**
	 * @param guildName Optional guild name to display in errors
	 */
	constructor(message?: string, guildName?: string, guildID?: string) {
		this.message = (message || "") + "Could not find specified guild";
		if (guildName || guildID) {
			this.message += " ( ";
			if (guildName) this.message += `name: '${guildName} '`;
			if (guildID) this.message += `id: '${guildID} '`;
			this.message += ")";
		}
	}

	guildName?: string;
}
class DBError extends Error {}
