interface InfoJSON {
	bot_info: BotInfo;
	guilds: Guild[];
}

interface BotInfo {
	id: string;
	name: string;
	version: string;
	start_date: string;
	start_time: string;
	guild_amount: number;
}

interface Guild {
	guild_name: string;
	guild_id: string;
	roles: Role[];
	roles_channel: RoleMessageChannel;
}

interface Role {
	icon: string;
	name: string;
	role_id: string;
}

interface MessageChannel {
	channel_name: string;
	channel_id: string;
}

interface RoleMessageChannel extends MessageChannel {
	message: string;
}
