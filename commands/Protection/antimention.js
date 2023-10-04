const { ApplicationCommandType, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: "antimention",
    description: "تفعيل حماية المنشن",
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
    
        const perms = await client.checkPerms([PermissionsBitField.Flags.Administrator], interaction);
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول إلى هذا الأمر`, ephemeral: true });
    
        try {
            const sql = 'SELECT antimention FROM protection';

            client.mysql.query(sql, async (error, results) => {
              if (error) {
                console.error(error);
                return;
              }

              const antimention = results[0].antimention

              if (antimention == 1)
              {
                interaction.editReply({ content: `تم ايقاف حماية المنشن` });
                client.mysql.query(`UPDATE protection SET antimention = ?`, false)

              } else {
                interaction.editReply({ content: `تم تشغيل حماية المنشن` });
                client.mysql.query(`UPDATE protection SET antimention = ?`, true)

              }
      
            });
        } catch (err) {
            interaction.editReply({ content: `حدث خطأ` });
            console.error(err);
        }
    }
}
