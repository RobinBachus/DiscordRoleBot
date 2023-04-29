import { colors } from "./common";
/**
 * A logging class that provides various methods for logging information.
 */
export class logging {
	/**
	 * Creates a new logging instance with the specified log level.
	 * @param level The log level to use.
	 */
	constructor(level: number) {
		this.logLevel = level;
	}

	/** The log level for this instance. */
	private logLevel: number;

	/**
	 * Changes the log level
	 * @param level The log level to use
	 */
	setLogLevel(level: number) {
		this.logLevel = level;
	}

	/**
	 * Logs the start of an update process.
	 * @param guildName The name of the guild being updated.
	 * @param processDescription A description of the process being performed.
	 */
	logUpdateStart(guildName: string, processDescription: string) {
		if (this.logLevel < 2) return;
		const message =
			`Updating ${colors.FgBlue}${guildName}${colors.Reset} ${processDescription}`.padEnd(60);
		process.stdout.write(message);
	}

	/**
	 *  Logs the start of a general process
	 *
	 * @param processDescription
	 */
	logProcessStart(processDescription: string) {
		if (this.logLevel < 2) return;
		process.stdout.write(processDescription.padEnd(51));
	}

	/**
	 * Logs the start of a fetch process.
	 * @param type The type of data being fetched.
	 * @param guildName The name of the guild from which the data is being fetched.
	 */
	logFetch(type: string, guildName: string) {
		if (this.logLevel < 2) return;
		const message = `Fetching ${type} ${colors.FgCyan}'${guildName}'${colors.Reset}`.padEnd(60);
		process.stdout.write(message);
	}

	/**
	 * Logs the result of a process.
	 * @param success Whether the process succeeded.
	 * @param reason The reason for the result, if applicable.
	 * @param skipped Whether the process was skipped.
	 */
	logProcessResult(success: true): void;
	logProcessResult(success: false, reason: string, skipped?: boolean): void;
	logProcessResult(success = true, reason?: string, skipped?: boolean) {
		if (success === true && this.logLevel > 1) {
			console.log(colors.FgGreen + "OK" + colors.Reset);
		} else if (skipped && this.logLevel > 0) {
			console.log(colors.FgYellow + "SKIPPED | " + reason + colors.Reset);
		} else if (success === false && !skipped) {
			console.log(colors.FgRed + "FAILED  | " + reason + colors.Reset);
		} else return;
	}

	/**
	 * Logs an informational message.
	 * @param message The message to log.
	 */
	logInfoMessage(message: string) {
		if (this.logLevel < 2) return;
		process.stdout.write(`\n${colors.FgBlue}[INFO]${colors.Reset}`);
		console.log(` ${message}`);
	}
}
