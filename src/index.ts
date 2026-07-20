import DiscordJS, {
    Intents,
    Message,
    MessageReaction,
    TextChannel,
    User,
} from "discord.js";
import { IGuild, loadConfig } from "./config";
import { log, error } from "./log";
import dotenv from "dotenv";

dotenv.config();

const config = loadConfig();

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ],
});

//     log("Bot startup...");
//     const channel = client.channels.cache.get(
//         "927168489075126282",
//     ) as TextChannel;
//     // check if initial message is present
//     channel.messages.fetch().then((messages) => {
//         let present = false;
//         for (let i of messages.values()) {
//             if (
//                 i.content.includes(
//                     "Click on the emoji to get the corresponding role",
//                 )
//             ) {
//                 present = true;
//             }
//         }
//         // if no message is present, send a new one
//         if (!present) {
//             // clear bot messages on roles channel
//             if (channel !== undefined) {
//                 channel.messages.fetch().then((messages) => {
//                     let messageList = messages.filter(
//                         (m: { author: { id: string } }) =>
//                             m.author.id === "926211660849500190",
//                     );
//                     for (let i of messageList) {
//                         channel.messages.delete(i[0]);
//                     }
//                     log(`deleted ${messageList.size} message(s)\n`);
//                 });
//                 // send initial role message on startup
//                 channel
//                     .send(
//                         "This bot is still being developed and will change over time \n\n\
// Use 'RAB info' for more information\n\
// Use 'RAB help' for more commands\n\n\
// Click on the emoji to get the corresponding role\n\
// Click again to remove the role\n\n\
// Roles:\n\
// 💰  |  GTA\n\
// ⚙   |  Volcanoids\n\
// 🏭  |  Satisfactory\n\
// 🦖  |  ARK\n\
// 🔪  |  Among Us\n\
// 🏴‍☠️  |  Sea Of Thieves\n\
// 🎭  |  Dead By Daylight",
//                     )
//                     .then((sentEmbed: { react: (arg0: string) => void }) => {
//                         sentEmbed.react("💰");
//                         sentEmbed.react("⚙");
//                         sentEmbed.react("🏭");
//                         sentEmbed.react("🦖");
//                         sentEmbed.react("🔪");
//                         sentEmbed.react("🏴‍☠️");
//                         sentEmbed.react("🎭");
//                     });
//             }
//         }
//     });
//     log("Bot ready");
client.on("ready", ready);

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
    if (message.content === "RAB status") {
        message.reply({
            content: "currently running!",
        });
        log(
            "replied to 'status' command from '" +
                message.author.username +
                "' on '" +
                message.guild?.name +
                "'",
        );
    }
});

client.on("messageCreate", (message) => {
    if (message.content === "RAB info") {
        message.reply({
            content: `Made by Robin Bachus\nVersion: ${getVersion()}\nCheck my source code here: github.com/RobinBachus/DiscordRoleBot\n\nSorry for spaghetti code 🙃`,
        });
        log(
            "replied to 'info' command from '" +
                message.author.username +
                "' on '" +
                message.guild?.name +
                "'",
        );
    }
});

client.on("messageCreate", (message) => {
    if (message.content === "RAB help") {
        message.reply({
            content:
                "- RAB info:     info about the bot\n- RAB status:     check if the bot is running\n",
        });
        log(
            "replied to 'help' command from '" +
                message.author.username +
                "' on '" +
                message.guild?.name +
                "'",
        );
    }
});

function getVersion() {
    const fs = require("fs");

    try {
        const data = fs.readFileSync("version.txt", "utf8");
        return data;
    } catch (err) {
        error("Failed to get version", err as Error);
    }
}

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
