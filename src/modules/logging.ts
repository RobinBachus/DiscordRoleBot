/**
 * A logging class that provides various methods for logging information.
 */
export class logging {
  private colors = {
    Reset: "\x1b[0m",
    FgRed: "\x1b[31m",
    FgGreen: "\x1b[32m",
    FgYellow: "\x1b[33m",
    FgBlue: "\x1b[34m",
    FgCyan: "\x1b[36m",
  };

  /**
   * Creates a new logging instance with the specified log level.
   * @param level The log level to use.
   */
  constructor(level: number) {
    this.logLevel = level;
  }

  /** The log level for this instance. */
  public logLevel: number;

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
      `Updating ${this.colors.FgBlue}${guildName}${this.colors.Reset} ${processDescription}`.padEnd(
        60
      );
    process.stdout.write(message);
  }

  /**
   * Logs a message about fetching some data.
   * @param type The type of data being fetched.
   * @param guildName The name of the guild from which the data is being fetched.
   */
  logFetch(type: string, guildName: string) {
    if (this.logLevel < 2) return;
    const message =
      `Fetching ${type} ${this.colors.FgCyan}'${guildName}'${this.colors.Reset}`.padEnd(
        60
      );
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
      console.log(this.colors.FgGreen + "OK" + this.colors.Reset);
    } else if (skipped && this.logLevel > 0) {
      console.log(
        this.colors.FgYellow + "SKIPPED | " + reason + this.colors.Reset
      );
    } else if (success === false && !skipped) {
      console.log(
        this.colors.FgRed + "FAILED  | " + reason + this.colors.Reset
      );
    } else return;
  }

  /**
   * Logs an informational message.
   * @param message The message to log.
   */
  logInfoMessage(message: string) {
    if (this.logLevel < 2) return;
    process.stdout.write(`\n${this.colors.FgBlue}[INFO]${this.colors.Reset}`);
    console.log(` ${message} \n`);
  }
}
