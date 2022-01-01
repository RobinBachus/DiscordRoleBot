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
        discord_js_1.Intents.FLAGS.GUILD_MESSAGES
    ]
});
client.on('ready', () => {
    console.log(getTime() + ': Bot startup...');
    const channel = client.channels.cache.get('926445404072058880');
    if (channel !== undefined) {
        channel.send('💦 Sea of Thieves\n❤ Among Us\n🥰 Dead By Daylight').then(sentEmbed => {
            sentEmbed.react("💦");
            sentEmbed.react("❤");
            sentEmbed.react("🥰");
        });
    }
    console.log(getTime() + ": Bot ready");
});
client.on('messageCreate', (message) => {
    if (message.content === 'RoleAssignBot status') {
        message.reply({
            content: 'currently running!'
        });
        console.log(getTime() + ": replied to 'status' command");
    }
});
client.on('messageCreate', (message) => {
    if (message.content === 'RoleAssignBot info') {
        message.reply({
            content: "Made by Robin Bachus\nCheck my source code here: github.com/RobinBachus/DiscordRoleBot\n\nSorry for spaghetti code 🙃"
        });
        console.log(getTime() + ": replied to 'info' command");
    }
});
client.on('messageCreate', (message) => {
    if (message.content === 'RoleAssignBot help') {
        message.reply({
            content: "- RoleAssignBot info:     info about the bot\n- RoleAssignBot status:     check if the bot is running\n"
        });
        console.log(getTime() + ": replied to 'help' command");
    }
});
function getTime() {
    let date = new Date();
    let today = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    let now = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    let time = today + ' ' + now;
    return time;
}
client.login(process.env.TOKEN);
