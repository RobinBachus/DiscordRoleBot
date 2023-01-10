import * as info from "../json/info.json";
import { writeFileSync } from "fs";

// Info that needs to be set at the startup of the bot should be set here

// Set the current version of the bot
info.bot_info.version = process.env.npm_package_version || "1.0.0";

// Set the date and time when the bot was started
const date = new Date();
const current_date = date.toLocaleDateString("en-BE", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});
const current_time = date.toLocaleTimeString("en-BE", {
  timeZone: "Europe/Brussels",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
});

info.bot_info.start_date = current_date;
info.bot_info.start_time = current_time;

// Set how many guilds the bot manages
info.bot_info.guild_amount = info.guilds.length;

writeFileSync(__dirname + "\\..\\json\\info.json", JSON.stringify(info));
