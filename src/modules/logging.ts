import { colors } from "./common";

/**
 * Values that indicate the result of a process
 */
export enum PR {
	success,
	failed,
	skipped,
}

/**
 * A logging class that provides various methods for logging information.
 */
export class logging {
	/** The log level for this instance. */
	private static logLevel = 3;

	/**
	 * Changes the log level
	 * @param level The log level to use
	 */
	static setLogLevel(level: number) {
		this.logLevel = level;
	}

	/**
	 * Logs the start of an update process.
	 * @param guildName The name of the guild being updated.
	 * @param processDescription A description of the process being performed.
	 */
	static logUpdateStart(guildName: string, processDescription: string) {
		if (this.logLevel < 2) return;
		const message =
			`Updating ${colors.FgBlue}${guildName}${colors.Reset} ${processDescription}`.padEnd(60);
		process.stdout.write(message);
	}

	/**
	 *  Logs the start of a general process
	 * @param processDescription
	 */
	static logProcessStart(processDescription: string) {
		if (this.logLevel < 2) return;
		process.stdout.write(processDescription.padEnd(51));
	}

	/**
	 * Logs the start of a fetch process.
	 * @param type The type of data being fetched.
	 * @param guildName The name of the guild from which the data is being fetched.
	 */
	static logFetch(type: string, guildName: string) {
		if (this.logLevel < 2) return;
		const message = `Fetching ${type} ${colors.FgCyan}'${guildName}'${colors.Reset}`.padEnd(60);
		process.stdout.write(message);
	}

	/**
	 * Logs the result of a process.
	 * @param processResult The resulting state of the process
	 * @param reason The reason for a failed or skipped process.
	 */
	static logProcessResult(processResult: PR.success): void;
	static logProcessResult(success: PR.failed | PR.skipped, reason: string): void;
	static logProcessResult(success = PR.success, reason?: string) {
		switch (success) {
			case PR.success:
				console.log(colors.FgGreen + "OK" + colors.Reset);
				break;
			case PR.failed:
				if (this.logLevel > 0)
					console.log(colors.FgYellow + "SKIPPED | " + reason + colors.Reset);
				break;
			case PR.skipped:
				console.log(colors.FgRed + "FAILED  | " + reason + colors.Reset);
				break;
		}
	}

	/**
	 * Logs an informational message.
	 * @param message The message to log.
	 * @param [newline=true] If the message should be printed on a new line. Default is ´true´
	 */
	static logInfoMessage(message: string, newline = true) {
		if (this.logLevel < 2) return;
		console.log(`${newline ? "\n" : ""}${colors.FgBlue}[INFO]${colors.Reset} ${message}`);
	}
}
