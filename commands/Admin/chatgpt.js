const { ApplicationCommandType, PermissionsBitField,ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: "chatgpt",
    description: "تعين روم ذكاء اصطناعي",
    options: [
    {
        name: "الروم",
        description: "لتعين روم الذكاء الاصطناعي",
        type: ApplicationCommandOptionType.Channel,
        required: true,
    }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const channel = await interaction.options.getChannel('الروم')

        const perms = await client.checkPerms([PermissionsBitField.Flags.Administrator], interaction);
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول إلى هذا الأمر`, ephemeral: true });

        try {

            await client.quickdb.set("chatgpt.room", channel.id);

            interaction.editReply({ content: `تم تعين روم ${channel} روم الذكاء الاصطناعي` });
        } catch (err) {
            interaction.editReply({ content: `حدث خطأ` });
            console.error(err);
        }
    }
}
