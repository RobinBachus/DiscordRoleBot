import DiscordJS, { Intents, TextChannel } from "discord.js"
import dotenv from 'dotenv'

dotenv.config()

const client = new DiscordJS.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    ]
})


client.on('ready', () => {
    sendLog("Bot startup...")
    const channel = client.channels.cache.get('927168489075126282') as TextChannel

    // clear bot messages on roles channel
    if (channel !== undefined){ 
        channel.messages.fetch()
        .then((messages) => {
            let messageList = messages.filter((m: { author: { id: string } }) => m.author.id === '926211660849500190')
            for (let i of messageList){
                channel.messages.delete(i[0])
            }
            sendLog(`deleted ${messageList.size} messages`)
        })
    }

    // send initial role message on startup
    if (channel !== undefined){ 
    channel.send(
"Use 'RAB info' for more information\n\
Use 'RAB help' for more commands\n\n\
Click on the emoji to get the corresponding role\n\n\
Roles:\n\
    💦 Sea of Thieves\n\
    ❤ Among Us\n\
    🥰 Dead By Daylight"
        ).then((sentEmbed: { react: (arg0: string) => void }) => {
            sentEmbed.react("💦")
            sentEmbed.react("❤")
            sentEmbed.react("🥰")
    })
    }
    sendLog("Bot ready")
})


client.on('messageReactionAdd', (reaction, user) => {
    if (user.id !== '926211660849500190'){  // exclude bot
        if (reaction.emoji.name === '💦'){
            const roleId = '926159528549056593'
            const guild = reaction.message.guild
            guild?.members.fetch(user.id)
            .then(user => {
                user.roles.add(roleId)
            })
            guild?.roles.fetch(roleId)
            .then(role => {
                sendLog(user.username + " was given the " + role?.name + " role on " + guild.name)
            })
        }
        if (reaction.emoji.name === '❤'){
            const roleId = '926467519236165644'
            const guild = reaction.message.guild
            guild?.members.fetch(user.id)
            .then(user => {
                user.roles.add(roleId)
            })
            guild?.roles.fetch(roleId)
            .then(role => {
                sendLog(user.username + " was given the " + role?.name + " role on " + guild.name)
            })
        }
        if (reaction.emoji.name === '🥰'){
            const roleId = '926467631886778448'
            const guild = reaction.message.guild
            guild?.members.fetch(user.id)
            .then(user => {
                user.roles.add(roleId)
            })
            guild?.roles.fetch(roleId)
            .then(role => {
                sendLog(user.username + " was given the " + role?.name + " role on " + guild.name)
            })
        }
    }
})



client.on('messageCreate', (message) => {
    if (message.content === 'RAB status') {
        message.reply({
            content: 'currently running!'
        })
        sendLog("replied to 'status' command from '" + message.author.username + "' on '" + message.guild?.name + "'")
    }
})


client.on('messageCreate', (message) => {
    if (message.content === 'RAB info') {
        message.reply({
            content: `Made by Robin Bachus\nVersion: ${getVersion()}\nCheck my source code here: github.com/RobinBachus/DiscordRoleBot\n\nSorry for spaghetti code 🙃`
        })
        sendLog("replied to 'info' command from '" + message.author.username + "' on '" + message.guild?.name + "'")
    }
})


client.on('messageCreate', (message) => {
    if (message.content === 'RAB help') {
        message.reply({
            content: "- RAB info:     info about the bot\n- RAB status:     check if the bot is running\n"
        })
        sendLog("replied to 'help' command from '" + message.author.username + "' on '" + message.guild?.name + "'")
    }
})


function getTime(){
    let date = new Date();
    let today = date.toLocaleDateString('en-BE', {day: '2-digit', month: '2-digit', year:'numeric'})
    let now = date.toLocaleTimeString("en-BE", {timeZone:"Europe/Brussels", hour: '2-digit', minute: '2-digit', second: '2-digit' })
    let time = today + ' ' + now
    return time
}


function sendLog(message: String){
    console.log(`${getTime()}: ${message}`)
}


function getVersion(){
    const fs = require('fs')

    try {
      const data = fs.readFileSync("version.txt", 'utf8')
      return(data)
    } catch (err) {
      console.error(err)
    }
}


client.login(process.env.TOKEN)