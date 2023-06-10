import { writeFile } from "fs/promises";

import * as info from "../../src/json/cache.json";

import fs from "fs";
import { Client } from "discord.js";

export class jsonHandler {
	/**
	 * A handler class for the json file that contains all the info about the bot (id, version...)
	 * and info the bot needs to manage the guilds.
	 *
	 * @remarks
	 * The `updateJsonFile()` method should be ran periodically and anytime a change is made to the file
	 * to ensure up to date information
	 */
	constructor() {
		this.file = info as IJsonCacheData;
		this.jsonFile.updateJsonFile();
	}

	/**
	 * Used as an internal version of the file that is never null. It is set when the
	 * object is created by importing the json and then updated using `fs.writeFile()`
	 * whenever an action is performed.
	 *
	 * @internal
	 */
	private file: IJsonCacheData;
	// The source json file is always used to enable importing
	private filePath: string = __dirname + "\\..\\..\\src\\json\\cache.json";

	jsonFile = {
		/**
		 * Get the up to date `info.json` file as an {@link IJsonCacheData | InfoJson} object.
		 * @returns The json file as an object.
		 */
		getJsonFile: async () => {
			await this.jsonFile.updateJsonFile();
			return this.file;
		},

		/**
		 * Writes an object to `info.json`. This is the json file that contains all custom info
		 * about the guilds that the bot manages.
		 * @param file This object will be written to the info.json file.
		 * @returns
		 */
		writeJsonFile: async (file?: IJsonCacheData | null) => {
			if (!file) file = this.file;
			await writeFile(this.filePath, JSON.stringify(file));
			this.jsonFile.updateJsonFile();
		},

		/**
		 * Updates the `file` property that holds the information from the json file as an object
		 * and is used by this class to provide information
		 *
		 * @param logError If the function should log errors or not.
		 * Errors will always be saved in the `state.update.errorMessage` property.
		 * Default is `true`
		 */
		updateJsonFile: async (logError = true) => {
			const update = this.state.update;
			update.errorMessage = undefined;
			const date = new Date();
			update.lastUpdate = date;

			let fileText = "";
			try {
				fileText = fs.readFileSync(this.filePath, "utf8");
			} catch (err: any) {
				if (logError) console.error("Could not read info.json:", err);
				update.errorMessage = err;
				return null;
			}

			try {
				const parsedFile = JSON.parse(fileText) as IJsonCacheData;
				this.file = parsedFile;
				update.lastSuccessfulUpdate = date;
				return parsedFile;
			} catch (err: any) {
				if (logError) console.error("Could not parse string to json", err);
				update.errorMessage = err;
				return null;
			}
		},
	};

	state: IState = {
		update: {
			errorMessage: undefined,
			lastUpdate: new Date(),
			lastSuccessfulUpdate: undefined,
		},
		write: {
			errorMessage: undefined,
			lastWrite: new Date(),
			lastSuccessfulWrite: undefined,
		},
	};

	/**
	 * Holds methods to find a role or groups of roles in the json file
	 */
	roles = {
		findIRoleWithId: (id: string, guild?: IGuild) => {
			if (guild) {
				return guild.roles.find((r) => r.role_id === id) as IRole | undefined;
			} else {
				for (const guild of info.guilds) {
					const role = guild.roles.find((r) => r.role_id === id) as IRole | undefined;
					if (role) {
						return role;
					}
				}
				return undefined;
			}
		},

		findIRoleWithName: (name: string, guild: IGuild, lowerCase?: boolean) => {
			if (!lowerCase) return guild.roles.find((r) => r.name === name) as IRole | undefined;
			else {
				return guild.roles.find((r) => r.name.toLowerCase() === name.toLowerCase()) as
					| IRole
					| undefined;
			}
		},
		findIRoleWithIcon: (icon: string, guild: IGuild) => {
			return guild.roles.find((r) => r.icon === icon) as IRole | undefined;
		},

		/**
		 * Retrieves roles from all managed guilds unless guildId is specified.
		 * If guildId is specified, then only that guild's roles will be returned.
		 * @returns An array containing all corresponding roles
		 */
		getAllRoles: async (guildId = "") => {
			let roles = new Array<IRole>();
			this.jsonFile.getJsonFile().then((f) => {
				for (let guild of f.guilds) {
					if (guild.guild_id === guildId || guildId === "")
						for (let role of guild.roles) {
							roles.push(role);
						}
				}
			});
			return roles;
		},
	};

	guilds = {
		findIGuildWithId: (id: string) => {
			return info.guilds.find((r) => r.guild_id === id) as IGuild | undefined;
		},

		findIGuildWithName: (name: string) => {
			return info.guilds.find((r) => r.guild_name === name) as IGuild | undefined;
		},
	};
}

interface IState {
	update: {
		/**
		 * If updateJsonFile() fails, then the reason/message will be saved in this variable.
		 * If the method didn't fail last time it was called, this property will be undefined.
		 */
		errorMessage: any;
		/**
		 * Last time updateJsonFile() was called
		 */
		lastUpdate: Date;
		/**
		 * Last time updateJsonFile() succeeded
		 */
		lastSuccessfulUpdate: Date | undefined;
	};
	write: {
		/**
		 * If writeJsonFile() fails, then the reason/message will be saved in this variable.
		 * If the method didn't fail last time it was called, this property will be undefined.
		 */
		errorMessage: any;
		/**
		 * Last time writeJsonFile() was called
		 */
		lastWrite: Date;
		/**
		 * Last time writeJsonFile() succeeded
		 */
		lastSuccessfulWrite: Date | undefined;
	};
}
