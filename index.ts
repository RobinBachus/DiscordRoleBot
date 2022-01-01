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
    console.log(getTime() + ': Bot startup...')
    const channel = client.channels.cache.get('926445404072058880')
    if (channel !== undefined){ 
    channel.send('💦 Sea of Thieves\n❤ Among Us\n🥰 Dead By Daylight').then(sentEmbed => {
        sentEmbed.react("💦")
        sentEmbed.react("❤")
        sentEmbed.react("🥰")
    })
    }
    console.log(getTime() + ": Bot ready")
})


client.on('messageCreate', (message) => {
    if (message.content === 'RoleAssignBot status') {
        message.reply({
            content: 'currently running!'
        })
        console.log(getTime() + ": replied to 'status' command")
    }
})


client.on('messageCreate', (message) => {
    if (message.content === 'RoleAssignBot info') {
        message.reply({
            content: "Made by Robin Bachus\nCheck my source code here: github.com/RobinBachus/DiscordRoleBot\n\nSorry for spaghetti code 🙃"
        })
        console.log(getTime() + ": replied to 'info' command")
    }
})


client.on('messageCreate', (message) => {
    if (message.content === 'RoleAssignBot help') {
        message.reply({
            content: "- RoleAssignBot info:     info about the bot\n- RoleAssignBot status:     check if the bot is running\n"
        })
        console.log(getTime() + ": replied to 'help' command")
    }
})


function getTime(){
    let date = new Date();
    let today = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    let now = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    let time = today + ' ' + now
    return time
}

client.login(process.env.TOKEN)