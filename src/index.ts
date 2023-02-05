import {
	Client,
	GatewayIntentBits,
	Events,
	TextChannel,
	MessageReaction,
	PartialMessageReaction,
} from "discord.js";
import { JsonHandler } from "./modules/jsonHandler";
import { colors } from "./modules/colors";
import * as dotenv from "dotenv";

dotenv.config();

const json = new JsonHandler();

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.GuildMembers,
	],
});

client.on("ready", async () => {
	const initError = await initialize();

	console.log(colors.Bright + "");

	if (!initError) console.log(colors.FgGreen + "ready!" + colors.Reset + "\n");
	else {
		console.log(
			colors.FgRed +
				"Failed to properly initialize, exiting..." +
				colors.Reset +
				"\n"
		);
		process.exit(1);
	}
});

client.on(Events.MessageReactionAdd, (reaction, user) => {
	console.log("Reaction received");

	const filter = (reaction: MessageReaction | PartialMessageReaction) => {
		const icon = reaction.emoji.name;
		const guildID = reaction.message.guild?.id;
		if (!icon || !guildID) {
			console.warn(
				`Received reaction with empty role or guild (role icon: ${icon}, guildID: ${guildID})`
			);
			return false;
		}
		const guild = json.findIGuildWithId(guildID);
		if (!guild) {
			console.warn(`Could not find guild with id '${guildID}')`);
			return false;
		}
		return json.findIRoleWithIcon(icon, guild) !== undefined;
	};

	const message = reaction.message;

	const collector = message.createReactionCollector({ filter, time: 3000 });

	collector.on("collect", (reaction, user) => {
		console.log(`Collected ${reaction.emoji.name} from ${user.tag}`);
	});

	collector.on("end", (collected) => {
		console.log(`Collected ${collected.size} items`);
	});
});

client.login(process.env.TOKEN);

async function initialize() {
	let initializationError = false;
	const iGuilds = json.jsonFile.guilds;

	process.stdout.write("\n" + colors.FgBlue + "[INFO]" + colors.Reset);
	console.log(" Initializing guilds \n");
	// Update member caches
	for (let iGuild of iGuilds) {
		const guild = await client.guilds.fetch(iGuild.guild_id);

		process.stdout.write(
			`Updating ${
				colors.FgBlue + iGuild.guild_name + colors.Reset
			} member cache:`.padEnd(60)
		);
		await guild.members
			.fetch({ time: 5000, force: true })
			.then(() => {
				console.log(colors.FgGreen + "OK" + colors.Reset);
			})
			.catch((reason) => {
				console.log(colors.FgRed + "FAILED  | " + reason + colors.Reset);
				initializationError = true;
			});

		process.stdout.write(
			`Updating ${
				colors.FgBlue + iGuild.guild_name + colors.Reset
			} role channel cache`.padEnd(60)
		);
		await guild.channels
			.fetch(iGuild.roles_channel.channel_id, { force: true })
			.then(async (channel) => {
				channel = channel as TextChannel;
				console.log(colors.FgGreen + "OK" + colors.Reset);
				process.stdout.write(
					`Updating ${
						colors.FgBlue + iGuild.guild_name + colors.Reset
					} message cache`.padEnd(60)
				);
				if (channel) {
					await channel.messages
						.fetch({ cache: true })
						.then(() => {
							console.log(colors.FgGreen + "OK" + colors.Reset);
						})
						.catch((reason) => {
							console.log(colors.FgRed + "FAILED  | " + reason + colors.Reset);
							initializationError = true;
						});
				} else {
					console.log(
						colors.FgYellow + "SKIPPED | Role channel not found" + colors.Reset
					);
				}
			})
			.catch((reason) => {
				console.log(colors.FgRed + "FAILED  | " + reason + colors.Reset);
				initializationError = true;
			});
	}

	return initializationError;
}
