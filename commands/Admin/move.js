const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField, ChannelType, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
        name: "move",
        description: "لنقل شخص إذا كان في قناة الى قناة اخرى",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الشخص',
                description: 'الشخص',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'الروم',
                description: 'الروم الذي تريد نقل الشخص اليه',
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildVoice],
                required: true
            },
        ],
        run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const channel = await interaction.options.getChannel('الروم')
        const member = interaction.guild.members.cache.get(interaction.options.getUser('الشخص').id);

        // console.log(channel.type)
        if (!member) {
            return interaction.editReply({ content: `حدث خطا اثناء التعرف على الشخص حاول مجددا` });
        }

        if (channel.type !== 2) {
            return interaction.editReply({ content: `هذا الروم ليس روم صوتي` });
        }
        
        const perms = await client.checkPerms([PermissionsBitField.Flags.MoveMembers], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });

        if (member.voice.channel) {
            try {
                await member.voice.setChannel(channel);
                interaction.editReply({ content: `تم نقل الشخص الى ${channel.name}` });
            } catch (err) {
                console.error(err);
                interaction.editReply({ content: `حدث خطا اثناء نقل الشخص المطلوب` });
            }
        } else {
            interaction.editReply({ content: `الشخص المطلوب ليس متواجد بروم صوتي` });
        }
    }
}
