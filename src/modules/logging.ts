import { colors } from "./common";

export enum LogLevel {
	FATAL,
	ERROR,
	WARN,
	INFO,
	DEBUG,
	TRACE,
}

/**
 * Values that indicate the result of a process
 */
export enum PR {
	SUCCESS,
	FAILED,
	SKIPPED,
}

/**
 * A logging class that provides various methods for logging information.
 */
export class logging {
	/** The log level for this instance. */
	private static logLevel = LogLevel.INFO;

	/**
	 * Changes the log level
	 * @param level The log level to use
	 */
	static setLogLevel(level: LogLevel) {
		this.logLevel = level;
	}

	/**
	 * Logs the start of an update process.
	 * @param guildName The name of the guild being updated.
	 * @param processDescription A description of the process being performed.
	 */
	static logUpdateStart(guildName: string, processDescription: string) {
		if (this.logLevel < LogLevel.INFO) return;
		const message =
			`Updating ${colors.FgBlue}${guildName}${colors.Reset} ${processDescription}`.padEnd(60);
		process.stdout.write(message);
	}

	/**
	 *  Logs the start of a general process
	 * @param processDescription
	 */
	static logProcessStart(processDescription: string) {
		if (this.logLevel < LogLevel.INFO) return;
		process.stdout.write(processDescription.padEnd(51));
	}

	/**
	 * Logs the start of a fetch process.
	 * @param type The type of data being fetched.
	 * @param guildName The name of the guild from which the data is being fetched.
	 */
	static logFetch(type: string, guildName: string) {
		if (this.logLevel < LogLevel.INFO) return;
		const message = `Fetching ${type} ${colors.FgCyan}'${guildName}'${colors.Reset}`.padEnd(60);
		process.stdout.write(message);
	}

	/**
	 * Logs the result of a process.
	 * @param processResult The resulting state of the process
	 * @param reason The reason for a failed or skipped process.
	 */
	static logProcessResult(processResult: PR.SUCCESS): void;
	static logProcessResult(success: PR.FAILED | PR.SKIPPED, reason: string): void;
	static logProcessResult(success = PR.SUCCESS, reason?: string) {
		if (this.logLevel <= LogLevel.INFO)
			switch (success) {
				case PR.SUCCESS:
					console.log(colors.FgGreen + "OK" + colors.Reset);
					break;
				case PR.FAILED:
					if (this.logLevel >= LogLevel.WARN)
						console.log(colors.FgYellow + "SKIPPED | " + reason + colors.Reset);
					break;
				case PR.SKIPPED:
					console.log(colors.FgRed + "FAILED  | " + reason + colors.Reset);
					break;
			}
	}

	/**
	 * Logs an error message.
	 * @param message The message to log.
	 * @param [newline=true] If the message should be printed on a new line. Default is ´true´
	 */
	static logMessage(message: string, level: LogLevel, newline = true) {
		const levelColors = [
			colors.BgRed,
			colors.FgRed,
			colors.FgYellow,
			colors.FgBlue,
			colors.FgGray,
			colors.BgGray,
		];
		if (this.logLevel < level) return;
		console.log(
			`${newline ? "\n" : ""}${levelColors[level]}[${LogLevel[level]}]${
				colors.Reset
			} ${message}`
		);
	}

	/**
	 * Logs a role getting toggled on a user
	 * @param roleAction Whether the role was added or removed
	 * @param username The name of the user
	 * @param roleName The name of the role
	 * @param roleIcon (optional) The icon associated with the role
	 * @param guildName (optional) The name of the guild
	 */
	static logRoleToggled(
		roleAction: "ADD" | "REMOVE",
		username: string,
		roleName: string,
		roleIcon?: string,
		guildName?: string
	) {
		if (this.logLevel < LogLevel.INFO) return;

		// Check if role name has an icon to include
		let role = roleIcon ? `${roleIcon} ` : "";
		role += roleName;

		// Check if the guild name should be mentioned in the log message
		let guild = guildName ? `on server '${colors.FgCyan}${guildName}${colors.Reset}'` : "";

		// Set username color
		// The color might be associated with certain servers later
		username = `${colors.FgBlue}${username}${colors.Reset}`;

		// Set the message according to the action performed
		let message = "";
		switch (roleAction) {
			case "ADD":
				message = `${colors.FgGreen}Gave${colors.Reset} role '${role}' to user ${username} ${guild}`;
				break;
			case "REMOVE":
				message = `${colors.FgRed}Removed${colors.Reset} role '${role}' from user ${username} ${guild}`;
				break;
		}
		// Log the message
		this.logMessage(message, LogLevel.INFO, false);
	}
}
