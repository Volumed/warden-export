const { Client } = require('discord.js-selfbot-v13')
const fs = require('fs')
const path = require('path')
const yargs = require('yargs/yargs')
const { hideBin } = require('yargs/helpers')

const argv = yargs(hideBin(process.argv))
  .command('$0 <token>', 'Run the script with arguments', (yargs) => {
    yargs.positional('token', {
      describe: 'Bot token',
      type: 'string'
    })
  })
  .help().argv

const token = argv.token
const client = new Client()

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)

  try {
    const guilds = client.guilds.cache.map((guild) => ({
      skip: false,
      name: guild.name,
      guild: guild.id,
      channel: (() => {
        const channels = Array.from(
          guild.channels.cache
            .filter(
              (channel) =>
                channel.type === 'GUILD_TEXT' &&
                channel.permissionsFor(guild.members.me).has('VIEW_CHANNEL')
            )
            .values()
        )
          .slice(0, 10)
          .map((channel) => ({
            id: channel.id,
            name: channel.name,
            type: channel.type
          }))
        return channels.length > 0
          ? channels[Math.floor(Math.random() * channels.length)].id
          : null
      })(),
      type: 'NEED TO BE FILLED',
      rolesFilter: []
    }))

    const result = {
      guilds
    }

    const filename = `export_${Date.now()}.json`
    const filepath = path.join(__dirname, filename)

    fs.writeFileSync(filepath, JSON.stringify(result, null, 2))

    console.log(`Saved guild and channel information to ${filename}`)
  } catch (error) {
    console.error('Error fetching servers or channels:', error)
  }

  client.destroy()
})

client.login(token)
