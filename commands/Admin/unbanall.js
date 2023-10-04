const { ApplicationCommandType, PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: "unbanall",
    description: "فك باند جميع الاشخاص المحظورين بالسيرفر",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });

        const perms = await client.checkPerms([PermissionsBitField.Flags.BanMembers], interaction);
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول إلى هذا الأمر`, ephemeral: true });

        try {
            const bans = await interaction.guild.bans.fetch();

            if (bans.size === 0) {
                return interaction.editReply({ content: `مافي اشخاص مبندين باليسرفر`, ephemeral: true });
            }

            bans.forEach(async (banInfo) => {
                await interaction.guild.bans.remove(banInfo.user.id, 'فك باند عن الجميع');
            });

            const embed = new EmbedBuilder()
                .setTitle('🔨 Unban All')
                .setDescription('تم فك الباند عن الجميع')
                .setColor('#00ff00');

            interaction.editReply({ embeds: [embed] });
        } catch (err) {
            interaction.editReply({ content: `حدث خطأ` });
            console.error(err);
        }
    }
}
