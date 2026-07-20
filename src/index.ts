import DiscordJS, {
    GatewayIntentBits,
    Message,
    MessageReaction,
    TextChannel,
    User,
} from "discord.js";
import { IGuild, loadConfig } from "./config";
import { ICommand, commands } from "./commands";
import { log, error } from "./log";
import dotenv from "dotenv";

dotenv.config();

const config = loadConfig();

const client = new DiscordJS.Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
    ],
});

client.on("clientReady", ready);

client.on(
    "messageReactionAdd",
    async (reaction, user) =>
        await onReactionAdd(reaction as MessageReaction, user as User),
);
client.on(
    "messageReactionRemove",
    async (reaction, user) =>
        await onReactionRemove(reaction as MessageReaction, user as User),
);

client.on("messageCreate", (message) => {
    for (let command of commands) {
        if (
            message.content.toLowerCase().trim() ===
            `rab ${command.name.toLowerCase()}`
        ) {
            replyToCommand(message, command);
            return;
        }
    }
});

client.login(process.env.TOKEN);

async function ready() {
    log("Starting bot...");
    for (let guild of config.guilds) {
        log(`Setting up roles for ${guild.guild_name}...`);

        const channel = client.channels.cache.get(
            guild.roles_channel.channel_id,
        ) as TextChannel;

        await setupMessage(guild);
    }

    log("Bot ready");
}

async function setupMessage(guild: IGuild) {
    // Get the message
    const formattedMessage = getMessage(guild);

    // Get the channel
    const channel = client.channels.cache.get(
        guild.roles_channel.channel_id,
    ) as TextChannel;

    const messages = await channel.messages.fetch();

    const botMessages = messages.filter(
        (m: { author: { id: string } }) => m.author.id === config.bot_info.id,
    );

    // if no bot messages are present, send a new one
    if (!botMessages || botMessages.size === 0) {
        const message = await channel.send(formattedMessage);
        await setupReactions(guild, message);
        log(`Sent initial message to roles channel for ${guild.guild_name}`);
        return;
    }

    // Check if the current bot message is the same as the one in the config
    let botMessage = botMessages.find(
        (m: { content: string }) => m.content === formattedMessage,
    );

    // If no messages match the config message, but the bot does have messages, edit the oldest message
    if (!botMessage) {
        botMessages.sort((a, b) => a.createdTimestamp - b.createdTimestamp);
        botMessage = botMessages.first()!; // Never null since we checked for size above
        await botMessage.edit(formattedMessage);
        await setupReactions(guild, botMessage);
        log(`Edited bot message for ${guild.guild_name}`);
        return;
    }

    // If the message matches the config message, do nothing
    log(`Bot message matches config message for ${guild.guild_name}`);
    await setupReactions(guild, botMessage);
    return;
}

function getMessage(guild: IGuild) {
    let message = guild.roles_channel.message;

    // Add roles to the message
    let roles = "";
    for (let i of guild.roles) {
        roles += `${i.icon} | ${i.name}\n`;
    }

    // Roles are in a code block
    return `${message}\n\`\`\`${roles}\`\`\``;
}

async function setupReactions(guild: IGuild, message: Message) {
    for (let i of guild.roles) {
        await message.react(i.icon);
    }

    for (let reaction of message.reactions.cache.values()) {
        if (!guild.roles.some((r) => r.icon === reaction.emoji.name)) {
            await reaction.remove();
        }
    }
}

async function onReactionAdd(reaction: MessageReaction, user: User) {
    const guild = config.guilds.find(
        (g) => g.guild_id === reaction.message.guildId,
    );

    if (!guild) {
        error(
            `Guild not found for reaction add in ${reaction.message.guildId}`,
        );
        return;
    }

    const role = guild.roles.find((r) => r.icon === reaction.emoji.name);
    if (!role) {
        error(`Role not found for reaction add in ${reaction.message.guildId}`);
        return;
    }

    let member = await reaction.message.guild?.members.fetch({
        user: user.id,
        cache: true,
        force: true,
    });

    await member?.roles.add(role.role_id);

    log(
        `${user.username} added the ${role.name} role on ${reaction.message.guild?.name}`,
    );
}

async function onReactionRemove(reaction: MessageReaction, user: User) {
    const guild = config.guilds.find(
        (g) => g.guild_id === reaction.message.guildId,
    );

    if (!guild) {
        error(
            `Guild not found for reaction remove in ${reaction.message.guildId}`,
        );
        return;
    }

    const role = guild.roles.find((r) => r.icon === reaction.emoji.name);
    if (!role) {
        error(
            `Role not found for reaction remove in ${reaction.message.guildId}`,
        );
        return;
    }

    let member = await reaction.message.guild?.members.fetch({
        user: user.id,
        cache: true,
        force: true,
    });

    if (member?.roles.cache.has(role.role_id)) {
        await member?.roles.remove(role.role_id);
    }

    log(
        `${user.username} removed the ${role.name} role on ${reaction.message.guild?.name}`,
    );
}

function replyToCommand(message: Message, command: ICommand) {
    message.reply({
        content: command.message,
    });
    log(
        `Replied to command ${command.name} from ${message.author.username} on ${message.guild?.name}`,
    );
}
