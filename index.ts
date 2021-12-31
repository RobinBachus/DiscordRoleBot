import DiscordJS, { Intents } from "discord.js"
import dotenv from 'dotenv'

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES
    ]
})


client.on('ready', () => {
    console.log('The bot is ready')
    const channel = client.channels.cache.get('926445404072058880')
    if (channel !== undefined){ 
    channel.send('💦 Sea of Thieves\n❤ Among Us\n🥰 Dead By Daylight').then(sentEmbed => {
        sentEmbed.react("💦")
        sentEmbed.react("❤")
        sentEmbed.react("🥰")
    })
    }
})


client.on('messageCreate', (message) => {
    if (message.content === 'RoleAssignBot status') {
        message.reply({
            content: 'currently running!'
        })
    }
})


client.on('messageCreate', (message) => {
    if (message.content === 'RoleAssignBot info') {
        message.reply({
            content: "Made by Robin Bachus\nCheck my source code here: github.com/RobinBachus/DiscordRoleBot\n\nSorry for spaghetti code 🙃"
        })
    }
})


client.on('messageCreate', (message) => {
    if (message.content === 'RoleAssignBot help') {
        message.reply({
            content: "- RoleAssignBot info:     info about the bot\n- RoleAssignBot status:     check if the bot is running\n"
        })
    }
})


client.login(process.env.TOKEN)