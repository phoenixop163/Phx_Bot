const { Discord, Client, Collection, GatewayIntentBits,ButtonBuilder,ActionRowBuilder, EmbedBuilder, Partials, ChannelType, Embed } = require("discord.js");
const client = new Client({
  partials: [
    Partials.Channel,
    Partials.GuildMember,
    Partials.Message,
    Partials.Reaction,
    Partials.User,
    Partials.GuildScheduledEvent
  ],
	intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildBans,
    GatewayIntentBits.GuildEmojisAndStickers,
    GatewayIntentBits.GuildIntegrations,
    GatewayIntentBits.GuildWebhooks,
    GatewayIntentBits.GuildInvites,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.GuildScheduledEvents,
    GatewayIntentBits.MessageContent
  ],
  restTimeOffset: 0
});

const config = require("./config.js");
const { Routes } = require("discord-api-types/v9");
const { REST } = require("@discordjs/rest");
const fs = require("fs");
const mysql = require("mysql");
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const OpenAI = require('openai')
;
  const openai = new OpenAI({
    apiKey: config.Settings.Chatgpt_api_key,
  });
  const spam = new Map();
  const mentionscount = new Map();
  const roomscount = new Map();
  const { DisTube } = require('distube')
  const { YtDlpPlugin } = require('@distube/yt-dlp')
  const { joinVoiceChannel, VoiceConnectionStatus, entersState } = require('@discordjs/voice');
  
  client.distube = new DisTube(client, {
    leaveOnStop: false,
    leaveOnFinish: true,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    plugins: [
      new YtDlpPlugin()
    ]
  }
  )
  const discordTranscripts = require('discord-html-transcripts');

client.on("ready", async () => {
  console.log(`Login In as ${client.user.tag}`);
});

var detabase = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'system_bot',
  debug: false
});


detabase.connect(function(err) {
  if (err) {
      console.error('Error In Database: ' + err.stack);
      return;
  }

  setInterval(function () {
    detabase.query('SELECT 1');
  }, 5000);
})



client.slashCommands = new Collection();
client.parseEmoji = function parseEmoji(text) {
  if (text.includes('%')) text = decodeURIComponent(text);
  if (!text.includes(':')) return { animated: false, name: text, id: undefined };
  const match = text.match(/<?(?:(a):)?(\w{1,32}):(\d{17,19})?>?/);
  return match && { animated: Boolean(match[1]), name: match[2], id: match[3] };
}

client.checkPerms = function checkPerms(flags, interaction) {
  for (let i = 0; i < flags.length; i++) {
      if (!interaction.member.permissions.has(flags[i])) {
          return false
      }
      if (!interaction.guild.members.me.permissions.has(flags[i])) {
          return false
      }
  }
}

client.checkBotPerms = function checkBotPerms(flags, interaction) {
  for (let i = 0; i < flags.length; i++) {
      if (!interaction.guild.members.me.permissions.has(flags[i])) {
          return false
      }
  }
}

function templateEmbed() {
  return new EmbedBuilder()
      .setAuthor({
          name: client.user.username,
          iconURL: client.user.avatarURL({ size: 1024 })
      })
      .setColor('#5865F2')
      .setFooter({
          text: `Phoenix Development`,
          iconURL: client.user.avatarURL({ size: 1024 })
      })
      .setTimestamp();
}

async function sendEmbed({
  embeds: embeds,
  content: content,
  components: components,
  type: type
}, interaction) {
  if (type && type.toLowerCase() == "edit") {
      return await interaction.edit({
          embeds: embeds,
          content: content,
          components: components,
          fetchReply: true
      }).catch(e => { });
  }
  else if (type && type.toLowerCase() == "editreply") {
      return await interaction.editReply({
          embeds: embeds,
          content: content,
          components: components,
          fetchReply: true
      }).catch(e => { });
  }
  else if (type && type.toLowerCase() == "reply") {
      return await interaction.reply({
          embeds: embeds,
          content: content,
          components: components,
          fetchReply: true
      }).catch(e => { });
  }
  else if (type && type.toLowerCase() == "update") {
      return await interaction.update({
          embeds: embeds,
          content: content,
          components: components,
          fetchReply: true
      }).catch(e => { });
  }
  else if (type && type.toLowerCase() == "ephemeraledit") {
      return await interaction.editReply({
          embeds: embeds,
          content: content,
          components: components,
          fetchReply: true,
          ephemeral: true
      }).catch(e => { });
  }
  else if (type && type.toLowerCase() == "ephemeral") {
      return await interaction.reply({
          embeds: embeds,
          content: content,
          components: components,
          fetchReply: true,
          ephemeral: true
      }).catch(e => { });
  }
  else {
      return await interaction.send({
          embeds: embeds,
          content: content,
          components: components,
          fetchReply: true
      }).catch(e => { });
  }
}

client.embed = async function ({
  embed: embed = templateEmbed(),
  title: title,
  desc: desc,
  color: color,
  image: image,
  author: author,
  url: url,
  footer: footer,
  thumbnail: thumbnail,
  fields: fields,
  content: content,
  components: components,
  type: type
}, interaction) {
  if (title) embed.setTitle(title);
  if (desc && desc.length >= 2048) embed.setDescription(desc.substr(0, 2044) + "...");
  else if (desc) embed.setDescription(desc);
  if (image) embed.setImage(image);
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (fields) embed.addFields(fields);
  if (author) embed.setAuthor(author);
  if (url) embed.setURL(url);
  if (footer) embed.setFooter({ text: footer });
  if (color) embed.setColor(color);
  return sendEmbed({
      embeds: [embed],
      content: content,
      components: components,
      type: type
  }, interaction)
}

client.mysql = detabase
client.quickdb = db
client.generate = function generate(length) {
  var result = "";
  var characters = "ABCDEFGHIKLMNOPQRSTUVWXYZ12345678901234567890abcdefghijklmnopqrstuvwxyz";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}      


const rest = new REST({ version: "9" }).setToken(config.Bot.Token);

const slashCommands = [];
fs.readdirSync('./commands/').forEach(async dir => {
const files = fs
  .readdirSync(`./commands/${dir}/`)
  .filter((file) => file.endsWith(".js"));

for (const file of files) {
  const slashCommand = require(`./commands/${dir}/${file}`);
  slashCommands.push({
    name: slashCommand.name,
    description: slashCommand.description,
    type: slashCommand.type,
    options: slashCommand.options ? slashCommand.options : null,
    default_permission: slashCommand.default_permission ? slashCommand.default_permission : null,
    default_member_permissions: slashCommand.default_member_permissions ? PermissionsBitField.resolve(slashCommand.default_member_permissions).toString() : null,
    channel_types: slashCommand.channel_types ? slashCommand.channel_types : null
  });

  if (slashCommand.name) {
    client.slashCommands.set(slashCommand.name, slashCommand);
    console.log(`Slash Command ` + file.split(".js")[0], "✅");
  } else {
    console.log(`Slash Command ` + file.split(".js")[0], "⛔");
  }
}
});

(async () => {
  try {
    await rest.put(config.Bot.Server ? Routes.applicationGuildCommands(config.Bot.Id, config.Bot.Server) : Routes.applicationCommands(config.Bot.Id), { body: slashCommands }
    );
    console.log(`${slashCommands.length} Slash Commands Registered`);
  } catch (error) {
    console.log(error);
  }
})();

client.on('interactionCreate', async interaction => {
    if(interaction.isCommand()) {
        const slashCommand = client.slashCommands.get(interaction.commandName);
        if(!slashCommand) return;

        try {
            await slashCommand.run(client, interaction);
        } catch(error) {

            console.error(error)
        
            if(interaction.replied) {
                await interaction.editReply({ content: `${error}` });
            } else {
                try {
                    await interaction.reply({ ephemeral: true, content: `${error}` });
                } catch {
                    await interaction.followUp({ ephemeral: true, content: `${error}` });
                }
            }
        }
    } else return;
});

client.on('interactionCreate', async interaction => {
  if (interaction.isButton()) {
      if (interaction.customId.startsWith('showmessage')) {
        await interaction.deferReply({ephemeral: true})
        const messageid = interaction.customId.split('-')[2];
        var mid = 'Message-' + messageid
        const sql = 'SELECT * FROM private_messages WHERE mid = ?';

        client.mysql.query(sql, [mid], async (error, results) => {
          if (error) {
            console.error(error);
            return;
          }
  
          if (results.length > 0) {
            const message = results[0];
            // console.log(message)
            if (interaction.user.id === message.message_to) {
              const m = interaction.channel.messages.cache.get(message.message_id);

              const embed = new EmbedBuilder()
              embed.setTitle('Anonymous message')
              embed.setDescription('تم فتح هذه الرسالة المخفية\nفقط صاحب الرسالة المقصودة يمكنه ذلك')
              embed.setThumbnail('https://cdn.discordapp.com/attachments/1097076927019352085/1112256811899293696/unnamed2.png')
              embed.setColor('#9D00FF')
       
          const button = new ButtonBuilder()
              .setCustomId(`showmessage-${mid}`)
              .setLabel('اظهار الرسالة')
              .setEmoji('✉')
              .setDisabled(true)
              .setStyle('Secondary');
       
          const row = new ActionRowBuilder()
              .addComponents(button);
              
              m.edit({embeds: [embed], components: [row]})
              
              await interaction.editReply({content: `> **الرسالة :**\n\`${message.message}\``}), client.mysql.query('DELETE FROM private_messages WHERE mid = ?', [mid]);
            } else {
              interaction.editReply({content: 'هذه الرسالة ليست لك!'})
            }
          } else {
            interaction.editReply('حدث خطا')
          }
        });  
      } else if (interaction.customId.startsWith('createprivateroom')) {
        await interaction.deferReply({ephemeral: true})
        const categoryid = interaction.customId.split('-')[1];
  
        client.mysql.query('SELECT * FROM private_rooms WHERE user_id = ?', [interaction.user.id], (err, results) => {
          if (err) {
              return console.error(err);
          }

          if (results.length >= 1) {
            interaction.editReply({ content: 'لديك روم بالفعل' });
        } else {
            interaction.guild.channels.create({
                name: interaction.user.username,
                type: ChannelType.GuildVoice,
                parent: categoryid,
                permissionOverwrites: [
                  {
                      id: interaction.guild.id,
                      deny: ['ViewChannel']
                  },
                  {
                      id: interaction.user.id,
                      allow: ['ViewChannel', 'Connect', 'Speak', 'MoveMembers', 'DeafenMembers', 'MuteMembers', 'UseSoundboard', 'Stream']
                  }
              ]      
            }).then((channel) => {
              client.mysql.query('INSERT INTO private_rooms SET ?', { user_id: interaction.user.id, voice_room_id: channel.id }, (err) => {
                    if (err) {
                        console.error(err);
                        interaction.editReply({ content: 'حدث خطا' });
                    } else {
                        interaction.editReply({ content: `تم انشاء الروم الخاص بك : <#${channel.id}>` });
                    }
                });
            }).catch((err) => {
                console.error(err);
                interaction.editReply({ content: 'حدث خطا' });
            });
        }

        });
      } else if (interaction.customId === 'deleteprivateroom') {
        await interaction.deferReply({ephemeral: true})  
        client.mysql.query('SELECT * FROM private_rooms WHERE user_id = ?', [interaction.user.id], (err, results) => {
          if (err) {
              return console.error(err);
          }

          if (results.length >= 1) {
            const result = results[0];
            const getchannel = client.channels.cache.get(result.voice_room_id);
            getchannel.delete()
            client.mysql.query('DELETE FROM private_rooms WHERE user_id = ?', [interaction.user.id])

            interaction.editReply({ content: `تم ازالة الروم`})
        } else {
          interaction.editReply({ content: `ليس لديك روم`})
        }

        });
      } else if (interaction.customId.startsWith('stopsound')) {
      await interaction.deferReply({ephemeral: true})
      const sid = interaction.customId.split('-')[2];
      var sid2 = 'Sound-' + sid
      const sql = 'SELECT * FROM sounds WHERE sid = ?';

      client.mysql.query(sql, [sid2], async (error, results) => {
        if (error) {
          console.error(error);
          return;
        }

        if (results.length > 0) {
          const sound = results[0];
          if (interaction.user.id !== sound.user) return await interaction.editReply('هذه ليست رسالتك لا يمكنك التحكم فيها');
            const m = interaction.channel.messages.cache.get(sound.messageid);
            
          client.mysql.query('UPDATE sounds SET status = ? WHERE sid = ?', ['Ended', sid2], async (error, results) => {
            if (error) {
                console.error(error);
            } else {
              const embed = new EmbedBuilder()
              .setTitle('Now playing 🎶')
              .setDescription(`> **Name Song :** ${sound.title}\n > **Start Music By :** <@${sound.user}>\n > **Music Status :** \`Ended :)\``)
              .setThumbnail(sound.thumbnails)
              .setColor('Red');
  
              const button = new ButtonBuilder()
              .setCustomId(`stopsound-${sid}`)
              .setEmoji('🛑')
              .setDisabled(true)
              .setStyle('Danger');
  
              const button2 = new ButtonBuilder()
              .setCustomId(`pausesond-${sid}`)
              .setEmoji('⏸️')
              .setDisabled(true)
              .setStyle('Primary');
  
              const button3 = new ButtonBuilder()
              .setCustomId(`resumesound-${sid}`)
              .setEmoji('▶')
              .setDisabled(true)
              .setStyle('Primary');
  
          const row = new ActionRowBuilder()
              .addComponents(button, button2,button3);
              
              try {
                const queue = client.distube.getQueue(interaction.guild.id);
                          
                await m.edit({ embeds: [embed], components: [row] }), queue.stop(interaction.guild.id), interaction.editReply({content: `تم`});
              } catch (e) {
                interaction.editReply('حدث خطا')
                console.log(e);
              }
            }
        });        
        } else {
          interaction.editReply('حدث خطا')
        }
      });  
    } else if (interaction.customId.startsWith('pausesond')) {
      await interaction.deferReply({ephemeral: true})
      const sid = interaction.customId.split('-')[2];
      var sid2 = 'Sound-' + sid
      const sql = 'SELECT * FROM sounds WHERE sid = ?';

      client.mysql.query(sql, [sid2], async (error, results) => {
        if (error) {
          console.error(error);
          return;
        }

        if (results.length > 0) {
          const sound = results[0];
          if (interaction.user.id !== sound.user) return await interaction.editReply('هذه ليست رسالتك لا يمكنك التحكم فيها');
            const m = interaction.channel.messages.cache.get(sound.messageid);
            
          client.mysql.query('UPDATE sounds SET status = ? WHERE sid = ?', ['Paused', sid2], async (error, results) => {
            if (error) {
                console.error(error);
            } else {
              const embed = new EmbedBuilder()
              .setTitle('Now playing 🎶')
              .setDescription(`> **Name Song :** ${sound.title}\n > **Start Music By :** <@${sound.user}>\n > **Music Status :** \`Paused :)\``)
              .setThumbnail(sound.thumbnails)
              .setColor('Yellow');
                
              try {
                const queue = client.distube.getQueue(interaction.guild.id);
                          
                await m.edit({ embeds: [embed] }), queue.pause(), interaction.editReply({content: `تم`});
              } catch (e) {
                interaction.editReply('حدث خطا')
                console.log(e);
              }
            }
        });        
        } else {
          interaction.editReply('حدث خطا')
        }
      });  
    } else if (interaction.customId.startsWith('resumesound')) {
      await interaction.deferReply({ephemeral: true})
      const sid = interaction.customId.split('-')[2];
      var sid2 = 'Sound-' + sid
      const sql = 'SELECT * FROM sounds WHERE sid = ?';

      client.mysql.query(sql, [sid2], async (error, results) => {
        if (error) {
          console.error(error);
          return;
        }

        if (results.length > 0) {
          const sound = results[0];
          if (interaction.user.id !== sound.user) return await interaction.editReply('هذه ليست رسالتك لا يمكنك التحكم فيها');
            const m = interaction.channel.messages.cache.get(sound.messageid);
            
          client.mysql.query('UPDATE sounds SET status = ? WHERE sid = ?', ['Resumed', sid2], async (error, results) => {
            if (error) {
                console.error(error);
            } else {
              const embed = new EmbedBuilder()
              .setTitle('Now playing 🎶')
              .setDescription(`> **Name Song :** ${sound.title}\n > **Start Music By :** <@${sound.user}>\n > **Music Status :** \`Resume :)\``)
              .setThumbnail(sound.thumbnails)
              .setColor('Green');
                  
              try {
                const queue = client.distube.getQueue(interaction);
                if(!queue.paused) return interaction.followUp("الصوت يتم تشغيلها بالفعل")
                
                await m.edit({ embeds: [embed] }), queue.resume(), interaction.editReply({content: `تم`});
              } catch (e) {
                interaction.editReply('حدث خطا', e)
                console.log(e);
              }
            }
        });        
        } else {
          interaction.editReply('حدث خطا')
        }
      });  
    } else if (interaction.customId === `openticket`) {
      await interaction.deferReply({ephemeral: true});
      client.mysql.query('SELECT * FROM tickets_settings', async (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
    
        const role_id = results[0].role_id;
        const category_id = results[0].category_id;
        const counts = results[0].counts;
    
        client.mysql.query('SELECT * FROM tickets WHERE owner_id = ?', [interaction.user.id], async (error, results2) => {
          if (error) {
            console.error(error);
            return;
          }

          if (results.length > 0) {
          const newCounts = counts + 1;
    
          interaction.guild.channels.create({
            name: `ticket-${newCounts}`,
            type: ChannelType.Channel,
            parent: category_id,
            permissionOverwrites: [
              {
                id: interaction.guild.id,
                deny: ['ViewChannel'],
              },
              {
                id: interaction.user.id,
                allow: ['ViewChannel', 'SendMessages'],
              },
              {
                id: role_id,
                allow: ['ViewChannel', 'SendMessages', 'ManageChannels'],
              },
            ],
          })
          .then(async (channel) => {    
            interaction.editReply({content: `تم فتح تذكرتك: ${channel}`})
            client.mysql.query('INSERT INTO tickets SET ?', {owner_id: interaction.user.id, channel_id: channel.id})
    
            const embed = new EmbedBuilder()
            embed.setTitle('تم فتح تذكرتك بنجاح!')
            embed.setDescription('يرجى الالتزام بقوانين السيرفر\nوشرح المشكلة بالتفصيل او الاستفسار.')
            // embed.setThumbnail('https://cdn.discordapp.com/attachments/955885184258019358/1155567674424823909/png-logo.png')
            embed.setThumbnail(`${config.Bot.image}`)
            embed.setColor('#F85528')


            const button = new ButtonBuilder()
            .setCustomId(`closeticket`)
            .setLabel('اغلق التذكرة')
            .setEmoji('🔒')
            .setStyle('Danger');

            const row = new ActionRowBuilder()
                .addComponents(button);


            await channel.send({content: `<@&${role_id}>\n${interaction.user}`, embeds: [embed], components: [row]});
    
            client.mysql.query('UPDATE tickets_settings SET counts = ?', newCounts, (error) => {
              if (error) {
                console.error(error);
                return;
              }
            });
          })

          .catch((error) => {
            console.error(error);
          });
        } else {
          interaction.editReply({ content: 'لديك تذكرة بالفعل', ephemeral: true});
        }
      });
      });
    } else if (interaction.customId === `closeticket`){
      await interaction.deferReply({ ephemeral: false });
      
      const button = new ButtonBuilder()
      .setCustomId(`yeahclose-${interaction.message.channelId}`)
      .setLabel('قبول')
      .setStyle('Success');

      const button2 = new ButtonBuilder()
      .setCustomId(`noclose-${interaction.message.channelId}`)
      .setLabel('رفض')
      .setStyle('Danger');

      const row = new ActionRowBuilder()
      .addComponents(button, button2);

     closemessage = await interaction.editReply({content: `هل أنت متأكد من رغبتك في إغلاق التذكرة؟`, components: [row]})

     client.mysql.query('UPDATE tickets SET close_message_id = ? WHERE channel_id = ?', [closemessage.id, closemessage.channelId])
    } else if (interaction.customId.startsWith(`noclose`)) {
      try {
      const channel_id = interaction.customId.split('-')[1];

      client.mysql.query('SELECT * FROM tickets WHERE channel_id = ?', [channel_id], function (err, rows) {
        if (err) {
          console.error(err);
        }

      // console.log(rows[0].owner_id, rows[0].channel_id, rows[0].close_message_id)

      
      // console.log(client.channels.cache.get(rows[0].channel_id).messages.cache.get(rows[0].close_message_id))
      client.channels.cache.get(rows[0].channel_id).messages.cache.get(rows[0].close_message_id).edit({content: `لم يتم إغلاق التذكرة.`, components: []}).then(async (message) => {
        setTimeout(() => {
        message.delete();
        }, 3500);
      })
    });
  } catch (err) {
    console.error(err)
  }
    } else if (interaction.customId.startsWith(`yeahclose`)) {
      interaction.reply({content: `جاري اغلاق التذكرة`, ephemeral: true})
      const channel_id = interaction.customId.split('-')[1];

      client.mysql.query('SELECT * FROM tickets WHERE channel_id = ?', [channel_id], async function (err, rows) {
        if (err) {
          console.error(err);
        }

        const channel = client.channels.cache.get(rows[0].channel_id)

        const attachment = await discordTranscripts.createTranscript(channel, {
          returnType: 'attachment',
          fileName: `ticket-${rows[0].owner_id}.html`,
          minify: true,
          saveImages: false,
          useCDN: false
        });

        const embed = new EmbedBuilder()
        embed.setTitle('تم اغلاق تذكرتك')
        embed.setDescription('اضغط على تنزيل الملف لرؤية التذكرة بالكامل')
        embed.setTimestamp()

        interaction.guild.members.cache.get(rows[0].owner_id).send({files: [attachment], embeds: [embed]})
        setTimeout(() => {
          client.mysql.query('DELETE FROM tickets WHERE channel_id = ?', [rows[0].channel_id])
          channel.delete();
        }, 1500);
      });
    }
  } else if (interaction.isModalSubmit()) {
    if (interaction.customId.startsWith(`sendnewembed`)) {
      const channel = client.channels.cache.get(interaction.customId.split('-')[1]);
      
      // const message = interaction.fields.getTextInputValue('message');
      // const reply = interaction.fields.getTextInputValue('reply');

      const embed = new EmbedBuilder()
      embed.setTitle(interaction.fields.getTextInputValue('embedtitle') || ' ')
      embed.setDescription(interaction.fields.getTextInputValue('embeddescription') || ' ')
      embed.setImage(interaction.fields.getTextInputValue('embedimage') || interaction.guild.iconURL())
      embed.setColor(interaction.fields.getTextInputValue('embedcolor') || 'ffffff')

      channel.send({embeds: [embed], content: `${interaction.fields.getTextInputValue('embedcontent') || ' '}`})
      interaction.reply({content: 'Done', ephemeral: true})
   } else if (interaction.customId === `addreply`) {
      const message = interaction.fields.getTextInputValue('message');
      const reply = interaction.fields.getTextInputValue('reply');

      const sql = 'INSERT INTO autoreply (message, reply) VALUES (?, ?)';      
      client.mysql.query(sql, [message, reply], (error, results) => {
          if (error) {
              console.error(error);
              return;
          }

          interaction.reply({ content: 'تم اضافة الرد التلقائي', ephemeral: true });
      });

    } else if (interaction.customId === `editreply`) {
      const message = interaction.fields.getTextInputValue('message');
      const newreply = interaction.fields.getTextInputValue('reply');
  
      try {

        client.mysql.query('SELECT * FROM autoreply WHERE ? LIKE CONCAT("%", message, "%")', [message], (error, results) => {
          if (error) {
              console.error(error);
              return;
          }
  
          if (results.length > 0) {  
              client.mysql.query('UPDATE autoreply SET reply = ? WHERE ? LIKE CONCAT("%", message, "%")', [newreply, message], (error, results) => {
                  if (error) {
                      console.error(error);
                      return;
                  }
  
                  interaction.reply({ content: `تم تعديل الرد`, ephemeral: true });
              });
          } else {
                  interaction.reply({ content: `هذا الرد غير موجود في قائمة الردود`, ephemeral: true });
          }
      });  

      } catch (error) {
        console.error(error);
      }

    } else if (interaction.customId === `deletereply`) {
      const message = interaction.fields.getTextInputValue('message');
  
      try {
        client.mysql.query('SELECT * FROM autoreply WHERE ? LIKE CONCAT("%", message, "%")', [message], (error, results) => {
          if (error) {
              console.error(error);
              return;
          }
  
          if (results.length > 0) {  
              client.mysql.query('DELETE FROM autoreply WHERE ? LIKE CONCAT("%", message, "%")', [message]);
  
                  interaction.reply({ content: `تم حذف الرد`, ephemeral: true });
          } else {
                  interaction.reply({ content: `هذا الرد غير موجود في قائمة الردود`, ephemeral: true });
          }
      });  

      } catch (error) {
        console.error(error);
      }

    }
  }
})

// الذكاء الاصطناعي

client.on('messageCreate', async function (message) {
  try {
    // console.log(await db.get("chatgpt.room"))
    if(message.author.bot) return;
    if (message.channel.id !== await db.get("chatgpt.room")) return;
    if (message.content.startsWith('!')) return;  
    await message.channel.sendTyping();

    const gptResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message.content }
      ]
  });

    message.reply(`${gptResponse.choices[0].message.content}`);
  } catch (err) {
    console.log(err);
  }
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  const sql = 'SELECT antiword_words FROM protection';
  client.mysql.query(sql, async (error, results) => {
      if (error) {
          console.error(error);
          return;
      }

      if (results.length > 0) {
          const data = results[0].antiword_words;

          try {
              let xwords = [];
                  xwords = JSON.parse(data);

              for (const word of message.content.split(' ')) {
                  if (xwords.includes(word.toLowerCase())) {
                      await message.delete(), message.author.send({content: `تم حذف رسالتك السبب كلمة ممنوعة`});
                      break;
                  }
              }
          } catch (error) {
              console.error(error);
          }
      }
  });
});

// - الحماية

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  const sql = 'SELECT * FROM protection';
  client.mysql.query(sql, async (error, results) => {
      if (error) {
          console.error(error);
          return;
      }

      const antispam = results[0].antispam;
      const antimention = results[0].antimention;

      if (antispam == 1) {
          if (spam.has(message.author.id)) {
              const oldm = spam.get(message.author.id);
              const time = message.createdTimestamp - oldm.createdTimestamp;
              
              if (time < 1000) {
                  await message.delete();
                  message.author.send({content: `لا يمكنك عمل سبام`});

                  oldm.delete();
              }
          }
          
          spam.set(message.author.id, message);
      }

      if (antimention) {

        if (!mentionscount.has(message.author.id)) {
            mentionscount.set(message.author.id, {
                count: 0,
                timestamp: Date.now(),
            });
        } else {
            const data2 = mentionscount.get(message.author.id);
    
            if (Date.now() - data2.timestamp <= 5000) {
                data2.count++;
            } else {
                data2.count = 0;
                data2.timestamp = Date.now();
            }
    
        console.log(mentionscount.get(message.author.id).count)
            if (data2.count > 3) {
                message.delete();
                message.author.send({content: `لا يمكنك عمل سبام منشن لشخص`});
            }
        }    

    }

  });
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    const sql = 'SELECT * FROM autoreply WHERE ? LIKE CONCAT("%", message, "%")';
    
    client.mysql.query(sql, [message.content], (error, results) => {
        if (error) {
            console.error(error);
            return;
        }
        
        if (results.length > 0) {
            const reply = results[0].reply;
            message.reply(reply);
        }
    });
  } catch (err) {
    console.log(err)
  }

});


client.on('messageDelete', (message) => {
  if (spam.has(message.author.id)) {
      spam.delete(message.author.id);
  }
});

client.on('guildMemberAdd', function (member) {

  client.mysql.query('SELECT server_privacy FROM protection', async (error, results) => {
      if (error) {
          console.error(error);
          return;
      }

      const server_privacy = results[0].server_privacy;

      if (server_privacy === `private`) {
        member.send({content: `عذرا, السيرفر خاص لا يمكنك دخوله`})
        setTimeout(() => {
          member.kick('سيرفر خاص')
        }, 1500);
      }
  });
});

client.on("channelDelete", async (channel) => {
  client.mysql.query('SELECT * FROM protection', async (error, results) => {
    if (error) {
        console.error(error);
        return;
    }

    const antirooms = results[0].pro_channels;

if (antirooms == 1) {
  await channel.clone(); // :)
}
  });
});

client.on('roleDelete', async (role) => {
  client.mysql.query('SELECT * FROM protection', async (error, results) => {
    if (error) {
        console.error(error);
        return;
    }

    const pro_roles = results[0].pro_roles;

if (pro_roles == 1) {
  const guild = role.guild;
  try {
      await guild.roles.create({
              name: role.name,
              color: role.color,
              permissions: role.permissions,
              position: role.position,
              mentionable: role.mentionable
      });
  } catch (error) {
      console.error(error);
  }
}
  });
});

  
client.login(config.Bot.Token);
