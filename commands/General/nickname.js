const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField } = require('discord.js');

module.exports = {
        name: "nickname",
        description: "تغيير اسم حسابك داخل السيرفر",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الاسم',
                description: 'الاسم الجديد',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ],
        run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const name = interaction.options.getString('الاسم');
        
        const perms = await client.checkBotPerms([PermissionsBitField.Flags.ChangeNickname], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });


        try {
            await interaction.member.setNickname(name);
            await interaction.editReply(`تم تغيير اسمك إلى: ${name}`);
        } catch (error) {
            console.error(error);
            await interaction.editReply('> **🙄 حدث خطأ اثناء محاولة تغير الاسم**');
        }
    }
}
