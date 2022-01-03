import DiscordJS, { Intents, Message, TextChannel } from "discord.js"
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
    console.log("\n")
    sendLog("Bot startup...")
    const channel = client.channels.cache.get('927168489075126282') as TextChannel

    // check if initial message is present
    channel.messages.fetch()
    .then((messages) => {
        let present = false
        for (let i of messages.values()){
            if (i.content.includes("Click on the emoji to get the corresponding role")){
                present = true
            }
        }
        // if no message is present, send a new one
        if (!present){ 
            // clear bot messages on roles channel
            if (channel !== undefined){ 
                channel.messages.fetch()
                .then((messages) => {
                    let messageList = messages.filter((m: { author: { id: string } }) => m.author.id === '926211660849500190')
                    for (let i of messageList){
                        channel.messages.delete(i[0])
                    }
                    sendLog(`deleted ${messageList.size} message(s)\n`)
                })

                // send initial role message on startup
                channel.send(
"This bot is still being developed and will change over time \n\n\
Use 'RAB info' for more information\n\
Use 'RAB help' for more commands\n\n\
Click on the emoji to get the corresponding role\n\
Click again to remove the role\n\n\
Roles:\n\
💰  |  GTA\n\
⚙   |  Volcanoids\n\
🏭  |  Satisfactory\n\
🦖  |  ARK\n\
🔪  |  Among Us\n\
🏴‍☠️  |  Sea Of Thieves\n\
🎭  |  Dead By Daylight"
                ).then((sentEmbed: { react: (arg0: string) => void }) => {
                    sentEmbed.react("💰")
                    sentEmbed.react("⚙")
                    sentEmbed.react("🏭")
                    sentEmbed.react("🦖")
                    sentEmbed.react("🔪")
                    sentEmbed.react("🏴‍☠️")
                    sentEmbed.react("🎭")
            })
            }
        }
    })
    sendLog("Bot ready")
})


client.on('messageReactionAdd', (reaction, user) => {
    if (reaction.message.channelId === '927168489075126282'){  
        if (user.id !== '926211660849500190'){    // exclude bot
            if (reaction.emoji.name === '💰'){
                const roleId = '673632879942565888'
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
            if (reaction.emoji.name === '⚙'){
                const roleId = '876515756777541653'
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
            if (reaction.emoji.name === '🏭'){
                const roleId = '876516149137907723'
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
            if (reaction.emoji.name === '🦖'){
                const roleId = '876516028325187585'
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
            if (reaction.emoji.name === '🔪'){
                const roleId = '876509430341058570'
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
            if (reaction.emoji.name === '🏴‍☠️'){
                const roleId = '925868985935859713'
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
            if (reaction.emoji.name === '🎭'){
                const roleId = '876507309843554304'
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
    }
})


client.on('messageReactionRemove', (reaction, user) => {
    if (reaction.message.channelId === '927168489075126282'){  
        if (user.id !== '926211660849500190'){  // exclude bot
            if (reaction.emoji.name === '💰'){
                const roleId = '673632879942565888'
                const guild = reaction.message.guild
                guild?.members.fetch(user.id)
                .then(user => {
                    user.roles.remove(roleId)
                })
                guild?.roles.fetch(roleId)
                .then(role => {
                    sendLog(user.username + " has removed the " + role?.name + " role on " + guild.name)
                })
            }
            if (reaction.emoji.name === '⚙'){
                const roleId = '876515756777541653'
                const guild = reaction.message.guild
                guild?.members.fetch(user.id)
                .then(user => {
                    user.roles.remove(roleId)
                })
                guild?.roles.fetch(roleId)
                .then(role => {
                    sendLog(user.username + " has removed the " + role?.name + " role on " + guild.name)
                })
            }
            if (reaction.emoji.name === '🏭'){
                const roleId = '876516149137907723'
                const guild = reaction.message.guild
                guild?.members.fetch(user.id)
                .then(user => {
                    user.roles.remove(roleId)
                })
                guild?.roles.fetch(roleId)
                .then(role => {
                    sendLog(user.username + " has removed the " + role?.name + " role on " + guild.name)
                })
            }
            if (reaction.emoji.name === '🦖'){
                const roleId = '876516028325187585'
                const guild = reaction.message.guild
                guild?.members.fetch(user.id)
                .then(user => {
                    user.roles.remove(roleId)
                })
                guild?.roles.fetch(roleId)
                .then(role => {
                    sendLog(user.username + " has removed the " + role?.name + " role on " + guild.name)
                })
            }
            if (reaction.emoji.name === '🔪'){
                const roleId = '876509430341058570'
                const guild = reaction.message.guild
                guild?.members.fetch(user.id)
                .then(user => {
                    user.roles.remove(roleId)
                })
                guild?.roles.fetch(roleId)
                .then(role => {
                    sendLog(user.username + " has removed the " + role?.name + " role on " + guild.name)
                })
            }
            if (reaction.emoji.name === '🏴‍☠️'){
                const roleId = '925868985935859713'
                const guild = reaction.message.guild
                guild?.members.fetch(user.id)
                .then(user => {
                    user.roles.remove(roleId)
                })
                guild?.roles.fetch(roleId)
                .then(role => {
                    sendLog(user.username + " has removed the " + role?.name + " role on " + guild.name)
                })
            }
            if (reaction.emoji.name === '🎭'){
                const roleId = '876507309843554304'
                const guild = reaction.message.guild
                guild?.members.fetch(user.id)
                .then(user => {
                    user.roles.remove(roleId)
                })
                guild?.roles.fetch(roleId)
                .then(role => {
                    sendLog(user.username + " has removed the " + role?.name + " role on " + guild.name)
                })
            }
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