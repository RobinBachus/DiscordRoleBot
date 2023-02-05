import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { JsonHandler } from "../modules/jsonHandler";

const jsonHandler = new JsonHandler();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("role")
		.setDescription("Gives the user a role")
		.addStringOption((option) =>
			option
				.setName("role_name")
				.setDescription("The name of the role")
				.setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		const guild = jsonHandler.findIGuildWithId(interaction.guildId!)!;
		const roleName = interaction.options.get("role_name")?.value?.toString();
		sendLog("received command from " + interaction.user.username);
		if (!roleName) {
			sendLog(`[ERROR] No role name was given.`);
			await interaction.reply({
				content: `[ERROR] No role name was given. Make sure to use \`/role [roleName]\`\nFor example: \`/role ${guild.roles[0].name}\``,
				ephemeral: true,
			});
			return;
		}

		const role = jsonHandler.findIRoleWithName(roleName, guild, true);
		if (!role) {
			sendLog(
				`[ERROR] Role '${roleName}' does not exist on ${guild.guild_name}`
			);
			await interaction.reply({
				content: `[ERROR] Role '${roleName}' does not exist on ${guild.guild_name}`,
				ephemeral: true,
			});
			return;
		} else {
			sendLog(
				`${interaction.user.username} was given the '${role.icon} ${role.name}' role`
			);
			const member = await interaction.guild?.members.fetch(interaction.user);
			if (member) member.roles.add(role.role_id);
			await interaction.reply({
				content: `You were given the \`${role.icon} ${role.name}\` role`,
				ephemeral: true,
			});
			return;
		}
	},
};

function getTime() {
	let date = new Date();
	let today = date.toLocaleDateString("en-BE", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	});
	let now = date.toLocaleTimeString("en-BE", {
		timeZone: "Europe/Brussels",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
	});
	let time = today + " " + now;
	return time;
}

function sendLog(message: String) {
	console.log(`${getTime()}: ${message}`);
}
