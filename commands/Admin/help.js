const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
        name: "help",
        description: "للاعدادات وضبط الرومات ومعرفة الاوامر",
        type: ApplicationCommandType.ChatInput,
        run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        
            try {
                interaction.editReply({ content: `مساعدة` });
            } catch (err) {
                console.error(err);
                interaction.editReply({ content: `حدث خطا` });
            }
    }
}
