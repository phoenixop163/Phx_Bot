const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
        name: "proroles",
        description: "لتشغيل او ايقاف حماية الرتب",
        type: ApplicationCommandType.ChatInput,
        run: async (client, interaction) => {
            await interaction.deferReply({ ephemeral: true });
        
            const perms = await client.checkPerms([PermissionsBitField.Flags.Administrator], interaction);
            if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول إلى هذا الأمر`, ephemeral: true });
        
            try {    
                client.mysql.query('SELECT pro_roles FROM protection', async (error, results) => {
                  if (error) {
                    console.error(error);
                    return;
                  }
    
                  const pro_roles = results[0].pro_roles
    
                  if (pro_roles == 1)
                  {
                    interaction.editReply({ content: `تم ايقاف حماية الرتب` });
                    client.mysql.query(`UPDATE protection SET pro_roles = ?`, false)
    
                  } else {
                    interaction.editReply({ content: `تم تشغيل حماية الرتب` });
                    client.mysql.query(`UPDATE protection SET pro_roles = ?`, true)
    
                  }
          
                });
            } catch (err) {
                interaction.editReply({ content: `حدث خطأ` });
                console.error(err);
            }
        }
}
