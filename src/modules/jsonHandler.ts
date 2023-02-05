import * as info from "../json/info.json";

export class JsonHandler {
	/**
	 *
	 */
	constructor() {
		this.jsonFile = info as InfoJson;
	}
	jsonFile: InfoJson;

	findIRoleWithId(id: string, guild?: IGuild) {
		if (guild) {
			return guild.roles.find((r) => r.role_id === id) as IRole | undefined;
		} else {
			for (const guild of info.guilds) {
				const role = guild.roles.find((r) => r.role_id === id) as IRole;
				if (role) {
					return role;
				}
			}
			return undefined;
		}
	}

	findIRoleWithName(name: string, guild: IGuild, lowerCase?: boolean) {
		if (!lowerCase)
			return guild.roles.find((r) => r.name === name) as IRole | undefined;
		else {
			return guild.roles.find(
				(r) => r.name.toLowerCase() === name.toLowerCase()
			) as IRole | undefined;
		}
	}

	findIRoleWithIcon(icon: string, guild: IGuild) {
		return guild.roles.find((r) => r.icon === icon) as IRole | undefined;
	}

	findIGuildWithId(id: string) {
		return info.guilds.find((r) => r.guild_id === id) as IGuild | undefined;
	}

	findIGuildWithName(name: string) {
		return info.guilds.find((r) => r.guild_name === name) as IGuild | undefined;
	}
}
