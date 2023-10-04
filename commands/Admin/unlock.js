const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
        name: "unlock",
        description: "فتح اي روم",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الروم',
                description: 'الروم الذي تريد فتحه',
                type: ApplicationCommandOptionType.Channel,
                required: true
            },
        ],
        run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const channel = await interaction.options.getChannel('الروم')

        const perms = await client.checkPerms([PermissionsBitField.Flags.ManageChannels], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });

        try {
            await channel.permissionOverwrites.edit(interaction.guild.roles.cache.find(x => x.name === '@everyone'), {
                SendMessages: true,
            });
                
        interaction.editReply({content: `تم فتح الروم !`})
        } catch (err) {
            interaction.editReply({content: `حدث خطا`})
            console.log(err)
        }
    }
}
