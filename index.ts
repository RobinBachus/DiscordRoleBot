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

client.login(process.env.TOKEN)