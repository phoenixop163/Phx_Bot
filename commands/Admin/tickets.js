const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField, ChannelType, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
        name: "tickets",
        description: "التكتات",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الروم',
                description: 'اختار الروم ليتم الاانشاء منه',
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildText],
                required: true
            },
            {
                name: 'القائمة',
                description: 'يتم انشاء الرومات في هذه المنطقة',
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildCategory],
                required: true
            },
            {
                name: 'الرتبة',
                description: 'رتبة الدعم',
                type: ApplicationCommandOptionType.Role,
                required: true
            },
        ],
        run: async (client, interaction) => {
            const channel = await interaction.options.getChannel('الروم')
            const category = await interaction.options.getChannel('القائمة')
            const role = await interaction.options.getRole('الرتبة')

            const embed = new EmbedBuilder()
            embed.setTitle('هل تريد فتح تذكرة جديدة؟')
            embed.setDescription('انقر على الزر ادناه لفتح تذكرة جديدة\nوسيقوم فريق الدعم الفني بالرد عليك بأسرع وقت')
            // embed.setThumbnail('https://cdn.discordapp.com/attachments/955885184258019358/1155567674424823909/png-logo.png')
            embed.setThumbnail(`${config.Bot.image}`)
            embed.setColor('#F85528')

            const button = new ButtonBuilder()
            .setCustomId(`openticket`)
            .setLabel('فتح تذكرة')
            .setEmoji('📩')
            .setStyle('Primary');

            const row = new ActionRowBuilder()
                .addComponents(button);

            const message = await client.channels.cache.get(channel.id).send({embeds: [embed], components: [row]})

            client.mysql.query(`UPDATE tickets_settings SET channel_id = ?, message_id = ?, category_id = ?, role_id = ?`, [channel.id, message.id, category.id, role.id])
              
            await interaction.reply({content: `تم تعيين الروم ${channel} كروم تكتات السيرفر!`, ephemeral: true})
    }
}
