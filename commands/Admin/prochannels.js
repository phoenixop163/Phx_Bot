const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
        name: "prochannels",
        description: "لتشغيل او ايقاف حماية الرومات",
        type: ApplicationCommandType.ChatInput,
        run: async (client, interaction) => {
            await interaction.deferReply({ ephemeral: true });
        
            const perms = await client.checkPerms([PermissionsBitField.Flags.Administrator], interaction);
            if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول إلى هذا الأمر`, ephemeral: true });
        
            try {
                const sql = 'SELECT pro_channels FROM protection';
    
                client.mysql.query(sql, async (error, results) => {
                  if (error) {
                    console.error(error);
                    return;
                  }
    
                  const antirooms = results[0].pro_channels
    
                  if (antirooms == 1)
                  {
                    interaction.editReply({ content: `تم ايقاف حماية الرومات` });
                    client.mysql.query(`UPDATE protection SET pro_channels = ?`, false)
    
                  } else {
                    interaction.editReply({ content: `تم تشغيل حماية الرومات` });
                    client.mysql.query(`UPDATE protection SET pro_channels = ?`, true)
    
                  }
          
                });
            } catch (err) {
                interaction.editReply({ content: `حدث خطأ` });
                console.error(err);
            }
        }
}
