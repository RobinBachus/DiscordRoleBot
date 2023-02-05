interface InfoJson {
	bot_info: IBotInfo;
	guilds: IGuild[];
}

interface IBotInfo {
	id: string;
	name: string;
	version: string;
	start_date: string;
	start_time: string;
	guild_amount: number;
}

interface IGuild {
	guild_name: string;
	guild_id: string;
	roles: IRole[];
	roles_channel: IRoleMessageChannel;
}

interface IRole {
	icon: string;
	name: string;
	role_id: string;
}

interface IMessageChannel {
	channel_name: string;
	channel_id: string;
}

interface IRoleMessageChannel extends IMessageChannel {
	message: string;
}
