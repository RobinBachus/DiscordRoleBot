export enum colors {
	Reset = "\x1b[0m",
	Bright = "\x1b[1m",
	Dim = "\x1b[2m",
	Underscore = "\x1b[4m",
	Blink = "\x1b[5m",
	Reverse = "\x1b[7m",
	Hidden = "\x1b[8m",

	FgBlack = "\x1b[30m",
	FgRed = "\x1b[31m",
	FgGreen = "\x1b[32m",
	FgYellow = "\x1b[33m",
	FgBlue = "\x1b[34m",
	FgMagenta = "\x1b[35m",
	FgCyan = "\x1b[36m",
	FgWhite = "\x1b[37m",
	FgGray = "\x1b[90m",

	BgBlack = "\x1b[40m",
	BgRed = "\x1b[41m",
	BgGreen = "\x1b[42m",
	BgYellow = "\x1b[43m",
	BgBlue = "\x1b[44m",
	BgMagenta = "\x1b[45m",
	BgCyan = "\x1b[46m",
	BgWhite = "\x1b[47m",
	BgGray = "\x1b[100m",
}

export function getDateString(date: Date) {
	return date.toLocaleDateString("en-BE", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
}

export function getTimeString(date: Date) {
	return date.toLocaleTimeString("en-BE", {
		timeZone: "Europe/Brussels",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
}

export function getDateTimeString(date: Date) {
	return getDateString(date) + getTimeString(date);
}

export function getOffsetMs(date = new Date()) {
	// Get local timezone offset
	const timezoneOffset = date.getTimezoneOffset();
	// Convert offset to milliseconds
	return Math.abs(Math.floor(timezoneOffset) * 60000);
}

export function getLocalUnixTime(date = new Date()) {
	return date.getTime() + getOffsetMs(date);
}