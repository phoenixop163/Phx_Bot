const { ApplicationCommandType, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: "antispam",
    description: "تفعيل حماية السبام",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
    
        const perms = await client.checkPerms([PermissionsBitField.Flags.Administrator], interaction);
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول إلى هذا الأمر`, ephemeral: true });
    
        try {
            const sql = 'SELECT antispam FROM protection';

            client.mysql.query(sql, async (error, results) => {
              if (error) {
                console.error(error);
                return;
              }

              const antispam = results[0].antispam

              if (antispam == 1)
              {
                interaction.editReply({ content: `تم ايقاف حماية السبام` });
                client.mysql.query(`UPDATE protection SET antispam = ?`, false)

              } else {
                interaction.editReply({ content: `تم تشغيل حماية السبام` });
                client.mysql.query(`UPDATE protection SET antispam = ?`, true)

              }
      
            });
        } catch (err) {
            interaction.editReply({ content: `حدث خطأ` });
            console.error(err);
        }
    }
}
