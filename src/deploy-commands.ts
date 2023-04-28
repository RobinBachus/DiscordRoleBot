import { Routes } from "discord-api-types/v10";
import { REST } from "@discordjs/rest";
import fs from "node:fs";
import * as dotenv from "dotenv";
import * as _info from "./json/info.json";

dotenv.config();
const info = _info as IJsonCacheData;

const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs
	.readdirSync(__dirname + "/./commands")
	.filter((file) => file.endsWith(".js"));

// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "10" }).setToken(process.env.TOKEN!);

// and deploy your commands!
(async () => {
	try {
		console.log(
			`Started refreshing ${commands.length} application (/) commands.`
		);

		// The put method is used to fully refresh all commands in the guild with the current set
		const data = (await rest.put(
			Routes.applicationGuildCommands(
				info.bot_info.bot_id,
				info.guilds[1].guild_id
			),
			{ body: commands }
		)) as any;

		console.log(
			`Successfully reloaded ${data.length} application (/) commands.`
		);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
})();
