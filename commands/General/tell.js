const { ApplicationCommandType, EmbedBuilder, ButtonBuilder, ChannelType, ActionRowBuilder, ApplicationCommandOptionType, Discord, Embed } = require('discord.js')
const { CommandInteraction, Client, Permissions } = require("discord.js");
const config = require('../../config');

module.exports = {
        name: "tell",
        description: "ارسال رسالة مجهولة لشخص",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الشخص',
                description: 'اختار الشخص او عن طريق ايديه',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'الرسالة',
                description: 'الرسالة الذي لا تريد احد يراها سواه',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ],
    run: async (client, interaction) => {
       await interaction.deferReply({ephemeral: true})

       const user = interaction.options.getUser('الشخص');
       const message = interaction.options.getString('الرسالة');

       var mid = 'Message-' + client.generate(22)

       interaction.editReply({content: `Sent to ${user}.`})

       const embed = new EmbedBuilder()
       embed.setTitle('Anonymous message')
       embed.setDescription('هذه الرسالة مخفية ولا يمكن رؤيتها\nفقط صاحب الرسالة المقصودة يمكنه ذلك')
       embed.setThumbnail('https://cdn.discordapp.com/attachments/1097076927019352085/1112241635431043183/unnamed.png')
       embed.setColor('#FF005A')

    //    console.log(mid)
   const button = new ButtonBuilder()
       .setCustomId(`showmessage-${mid}`)
       .setLabel('اظهار الرسالة')
       .setEmoji('✉')
       .setStyle('Secondary');

   const row = new ActionRowBuilder()
       .addComponents(button);

      const themessage = await interaction.channel.send({content: `To ${user}`,embeds:[embed], components: [row]})

      client.mysql.query(`INSERT INTO private_messages (message_to,message_id,mid,message) VALUES ('${user.id}', '${themessage.id}', '${mid}', '${message}')`)

    }
}
