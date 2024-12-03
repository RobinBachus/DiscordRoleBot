import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { jsonHandler } from "../modules/jsonHandler";
import { getDateTimeString } from "../modules/common";

const json = new jsonHandler();

module.exports = {
	data: new SlashCommandBuilder()
		.setName("role")
		.setDescription("Gives the user a role")
		.addStringOption((option) =>
			option.setName("role_name").setDescription("The name of the role").setRequired(true)
		),
	async execute(interaction: CommandInteraction) {
		const guild = json.guilds.findIGuildWithId(interaction.guildId!)!;
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

		const role = json.roles.findIRoleWithName(roleName, guild, true);
		if (!role) {
			sendLog(`[ERROR] Role '${roleName}' does not exist on ${guild.guild_name}`);
			await interaction.reply({
				content: `[ERROR] Role '${roleName}' does not exist on ${guild.guild_name}`,
				ephemeral: true,
			});
			return;
		} else {
			sendLog(`${interaction.user.username} was given the '${role.icon} ${role.name}' role`);
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

function sendLog(message: String) {
	console.log(`${getDateTimeString(new Date())}: ${message}`);
}
