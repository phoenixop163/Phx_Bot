const { ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: "delete",
    description: "حذف الرسائل",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'العدد',
            description: 'عدد الرسائل اللي تبي حذفها',
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const messageCount = interaction.options.getInteger('العدد');

        if (messageCount <= 0) {
            return interaction.editReply({ content: `لازم عدد الرسائل يكون اكثر من 0` });
        }

        const channel = interaction.channel;

        try {
            const messages = await channel.messages.fetch({ limit: messageCount });
            await channel.bulkDelete(messages);
            interaction.editReply({ content: `تم حذف ${messageCount} رسالة` });
        } catch (err) {
            console.error(err);
            interaction.editReply({ content: `حدث خطا اثناء الحذف` });
        }
    },
};
