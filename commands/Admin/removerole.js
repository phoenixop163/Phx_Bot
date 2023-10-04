const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
        name: "removerole",
        description: "ازالة رتبة من شخص",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الشخص',
                description: 'الشخص',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'الرتبة',
                description: 'اختاار الرتبة',
                type: ApplicationCommandOptionType.Role,
                required: true
            },
        ],
        run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const role = await interaction.options.getRole('الرتبة')
        const member = interaction.guild.members.cache.get(interaction.options.getUser('الشخص').id);

        if (!member) {
            return interaction.editReply({ content: `حدث خطا اثناء التعرف على الشخص حاول مجددا` });
        }
        
        const perms = await client.checkPerms([PermissionsBitField.Flags.ManageRoles], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });

            try {
                await member.roles.remove(role);

                interaction.editReply({ content: `تم ازالة الرتبة منه` });
            } catch (err) {
                console.error(err);
                interaction.editReply({ content: `حدث خطا` });
            }
    }
}
