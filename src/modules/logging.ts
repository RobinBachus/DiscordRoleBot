import { Color, colorText } from "./common";

/**
 * The levels that a message can be logged on.
 * Lower log level means less messages
 */
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
	OK,
	FAILED,
	SKIPPED,
}

/**
 * A logging class that provides various methods for logging information.
 */
export class logging {
	/** The log level for this instance. */
	private static logLevel = LogLevel.TRACE;

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
		if (this.logLevel >= LogLevel.INFO) {
			const guild = colorText(Color.FgBlue, guildName);
			const message = `Updating ${guild} ${processDescription}`.padEnd(60);
			process.stdout.write(message);
		}
	}

	/**
	 *  Logs the start of a general process
	 * @param processDescription
	 */
	static logProcessStart(processDescription: string) {
		if (this.logLevel >= LogLevel.INFO) process.stdout.write(processDescription.padEnd(51));
	}

	/**
	 * Logs the start of a fetch process.
	 * @param type The type of data being fetched.
	 * @param guildName The name of the guild from which the data is being fetched.
	 */
	static logFetch(type: string, guildName: string) {
		if (this.logLevel >= LogLevel.INFO) {
			const guild = colorText(Color.FgCyan, guildName);
			const message = `Fetching ${type} '${guild}`.padEnd(60);
			process.stdout.write(message);
		}
	}

	/**
	 * Logs the result of a process.
	 * @param processResult The resulting state of the process
	 * @param reason The reason for a failed or skipped process.
	 */
	static logProcessResult(processResult: PR.OK): void;
	static logProcessResult(processResult: PR.FAILED | PR.SKIPPED, reason: string): void;
	static logProcessResult(processResult = PR.OK, reason?: string) {
		const Colors = [Color.FgGreen, Color.FgRed, Color.FgYellow];
		if (this.logLevel < LogLevel.INFO) return;
		const r = reason ? ` | ${reason}` : "";
		console.log(colorText(Colors[processResult], PR[processResult] + r));
	}

	/**
	 * Logs a message with appropriate tag and color based on log level.
	 * @param message The message to log.
	 * @param level The level the message should be logged at
	 * @param [newline=true] If the message should be printed on a new line. Default is ´true´
	 */
	static logMessage(message: string, level: LogLevel, newline = true) {
		const Colors = [
			Color.BgRed,
			Color.FgRed,
			Color.FgYellow,
			Color.FgBlue,
			Color.FgGray,
			Color.BgGray,
		];
		if (this.logLevel < level) return;
		const levelString = colorText(Colors[level], LogLevel[level]);
		console.log(`${newline ? "\n" : ""}${levelString} ${message}`);
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
		// Only logs messages if log level is set to info or higher
		if (this.logLevel < LogLevel.INFO) return;

		// Check if role name has an icon to include
		let role = roleIcon ? `${roleIcon} ` : "";
		role += roleName;

		// Check if the guild name should be mentioned in the log message
		let guild = guildName ? `on server '${colorText(Color.FgCyan, guildName)}'` : "";

		// Set username color
		// The color might be associated with certain servers later
		username = colorText(Color.FgBlue, username);

		// Set the message with appropriate colors according to the action performed
		let actionString;
		let message = "";
		switch (roleAction) {
			case "ADD":
				actionString = colorText(Color.FgGreen, "Gave");
				message = `${actionString} role '${role}' to user ${username} ${guild}`;
				break;
			case "REMOVE":
				actionString = colorText(Color.FgRed, "Removed");
				message = `${actionString} role '${role}' from user ${username} ${guild}`;
				break;
		}
		// Log the message
		this.logMessage(message, LogLevel.INFO, false);
	}
}
