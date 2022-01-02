"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const client = new discord_js_1.default.Client({
    intents: [
        discord_js_1.Intents.FLAGS.GUILDS,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES,
        discord_js_1.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]
});
client.on('ready', () => {
    sendLog("Bot startup...");
    const channel = client.channels.cache.get('927026779628126228');
    // clear bot messages on roles channel
    if (channel !== undefined) {
        channel.messages.fetch()
            .then((messages) => {
            let messageList = messages.filter((m) => m.author.id === '926211660849500190');
            for (let i of messageList) {
                channel.messages.delete(i[0]);
            }
            sendLog(`deleted ${messageList.size} messages`);
        });
    }
    // send initial role message on startup
    if (channel !== undefined) {
        channel.send("Use 'RAB info' for more information\n\
Use 'RAB help' for more commands\n\n\
Click on the emoji to get the corresponding role\n\n\
Roles:\n\
    💦 Sea of Thieves\n\
    ❤ Among Us\n\
    🥰 Dead By Daylight").then((sentEmbed) => {
            sentEmbed.react("💦");
            sentEmbed.react("❤");
            sentEmbed.react("🥰");
        });
    }
    sendLog("Bot ready");
});
client.on('messageReactionAdd', (reaction, user) => {
    if (user.id !== '926211660849500190') { // exclude bot
        if (reaction.emoji.name === '💦') {
            const roleId = '926159528549056593';
            const guild = reaction.message.guild;
            guild === null || guild === void 0 ? void 0 : guild.members.fetch(user.id).then(user => {
                user.roles.add(roleId);
            });
            guild === null || guild === void 0 ? void 0 : guild.roles.fetch(roleId).then(role => {
                sendLog(user.username + " was given the " + (role === null || role === void 0 ? void 0 : role.name) + " role on " + guild.name);
            });
        }
        if (reaction.emoji.name === '❤') {
            const roleId = '926467519236165644';
            const guild = reaction.message.guild;
            guild === null || guild === void 0 ? void 0 : guild.members.fetch(user.id).then(user => {
                user.roles.add(roleId);
            });
            guild === null || guild === void 0 ? void 0 : guild.roles.fetch(roleId).then(role => {
                sendLog(user.username + " was given the " + (role === null || role === void 0 ? void 0 : role.name) + " role on " + guild.name);
            });
        }
        if (reaction.emoji.name === '🥰') {
            const roleId = '926467631886778448';
            const guild = reaction.message.guild;
            guild === null || guild === void 0 ? void 0 : guild.members.fetch(user.id).then(user => {
                user.roles.add(roleId);
            });
            guild === null || guild === void 0 ? void 0 : guild.roles.fetch(roleId).then(role => {
                sendLog(user.username + " was given the " + (role === null || role === void 0 ? void 0 : role.name) + " role on " + guild.name);
            });
        }
    }
});
client.on('messageCreate', (message) => {
    var _a;
    if (message.content === 'RAB status') {
        message.reply({
            content: 'currently running!'
        });
        sendLog("replied to 'status' command from '" + message.author.username + "' on '" + ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.name) + "'");
    }
});
client.on('messageCreate', (message) => {
    var _a;
    if (message.content === 'RAB info') {
        message.reply({
            content: `Made by Robin Bachus\nVersion: ${getVersion()}\nCheck my source code here: github.com/RobinBachus/DiscordRoleBot\n\nSorry for spaghetti code 🙃`
        });
        sendLog("replied to 'info' command from '" + message.author.username + "' on '" + ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.name) + "'");
    }
});
client.on('messageCreate', (message) => {
    var _a;
    if (message.content === 'RAB help') {
        message.reply({
            content: "- RAB info:     info about the bot\n- RAB status:     check if the bot is running\n"
        });
        sendLog("replied to 'help' command from '" + message.author.username + "' on '" + ((_a = message.guild) === null || _a === void 0 ? void 0 : _a.name) + "'");
    }
});
function getTime() {
    let date = new Date();
    let today = date.toLocaleDateString('en-BE', { day: '2-digit', month: '2-digit', year: 'numeric' });
    let now = date.toLocaleTimeString("en-BE", { timeZone: "Europe/Brussels", hour: '2-digit', minute: '2-digit', second: '2-digit' });
    let time = today + ' ' + now;
    return time;
}
function sendLog(message) {
    console.log(`${getTime()}: ${message}`);
}
function getVersion() {
    const fs = require('fs');
    try {
        const data = fs.readFileSync("version.txt", 'utf8');
        return (data);
    }
    catch (err) {
        console.error(err);
    }
}
client.login(process.env.TOKEN);
