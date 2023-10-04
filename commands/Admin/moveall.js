const { ApplicationCommandType, ApplicationCommandOptionType, PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: "moveall",
    description: "نقل جميع الأشخاص من جميع الرومات الصوتية إلى روم صوتي محدد",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'الروم',
            description: 'الروم الصوتي الذي تريد نقل الأشخاص إليه',
            type: ApplicationCommandOptionType.Channel,
            channel_types: [ChannelType.GuildVoice],
            required: true
        },
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const channel = await interaction.options.getChannel('الروم');

        const perms = await client.checkPerms([PermissionsBitField.Flags.MoveMembers], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });

        if (!channel) {
            return interaction.editReply({ content: `لم يتم العثور على الروم` });
        }

        if (channel.type !== 2) {
            return interaction.editReply({ content: `هذا الروم ليس روم صوتي` });
        }

        const members = interaction.guild.members.cache;

        members.forEach(async (member) => {
            if (member.voice.channel && member.voice.channel.type === 2) {
                try {
                    await member.voice.setChannel(channel);
                } catch (err) {
                    interaction.editReply({content: `حدث خطا`})
                    console.error(err);
                }
            }
        });

        interaction.editReply({ content: `تم نقل جميع الاشخاص الى ${channel.name}` });
    },
};
