const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: "rename",
    description: "تغير اسم الروم الحالي",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'الاسم',
            description: 'الاسم الجديد للروم',
            type: ApplicationCommandOptionType.String,
            required: true
        },
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const newName = await interaction.options.getString('الاسم');
        const channel = interaction.channel;

        const perms = await client.checkPerms([PermissionsBitField.Flags.ManageChannels], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });

        try {
            await channel.setName(newName);
            interaction.editReply({ content: `تم تغيير اسم الروم الى : ${newName}` });
        } catch (err) {
            console.error(err);
            interaction.editReply({ content: `حدث خطا اثناء تغير اسم الروم` });
        }
    },
};
