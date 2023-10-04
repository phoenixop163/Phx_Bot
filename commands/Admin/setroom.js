const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField, ChannelType, ButtonBuilder, ActionRowBuilder, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
        name: "setroom",
        description: "تعين روم لفتح روم صوتي مؤقت",
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
        ],
        run: async (client, interaction) => {
            await interaction.deferReply({ ephemeral: true });
            const channel = await interaction.options.getChannel('الروم')
            const category = await interaction.options.getChannel('القائمة')

            const perms = await client.checkPerms([PermissionsBitField.Flags.Administrator], interaction);
            if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول إلى هذا الأمر`, ephemeral: true });
        
            try {

                interaction.editReply({content: `Done`})

                const embed = new EmbedBuilder()
                embed.setTitle('🪐 | Create Room - انشاء روم')
                embed.setDescription('انقر على الزر ادناه لأنشاء روم مؤقت\nClick on the button below to create a temporary ROOM')
                // embed.setThumbnail('https://cdn.discordapp.com/attachments/955885184258019358/1155567674424823909/png-logo.png')
                embed.setThumbnail(`${config.Bot.image}`)
                embed.setColor('#F85528')
         
            const button = new ButtonBuilder()
                .setCustomId(`createprivateroom-${category.id}`)
                .setLabel('Create Room')
                .setEmoji('🪐')
                .setStyle('Primary');

            const button2 = new ButtonBuilder()
                .setCustomId(`deleteprivateroom`)
                .setLabel('Dleate Room')
                .setEmoji('💢')
                .setStyle('Primary');
         
            const row = new ActionRowBuilder()
                .addComponents(button, button2);
         
               channel.send({ embeds:[embed], components: [row] })
         
            } catch (err) {
                interaction.editReply({ content: `حدث خطأ` });
                console.error(err);
            }
        }
}
