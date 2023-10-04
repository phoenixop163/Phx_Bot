const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
        name: "removeallrole",
        description: "ازالة رتبة من الكل",
        type: ApplicationCommandType.ChatInput,
        options: [
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
        
        const perms = await client.checkPerms([PermissionsBitField.Flags.ManageRoles], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });

            try {
                const members = interaction.guild.members.cache;

                members.forEach(async (member) => {
                    try {
                        await member.roles.remove(role);
                    } catch (err) {
                        console.error(err);
                    }
                });
    
        
                interaction.editReply({ content: `تم ازالة الرتبة من الجميع` });
            } catch (err) {
                console.error(err);
                interaction.editReply({ content: `حدث خطا` });
            }
    }
}
