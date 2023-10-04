const { ApplicationCommandType, EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, Discord } = require('discord.js')
const { CommandInteraction, Client, Permissions } = require("discord.js");

module.exports = {
        name: "private",
        description: "تغير خصوصية السيرفر",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "الاجراء",
                type: ApplicationCommandOptionType.String,
                required: true,
                description: 'اختار ما تريد السيرفر',
                choices: [
                    { name: `سيرفر عام`, value: 'publicserver'  },
                    { name: `سيرفر خاص`, value: 'privateserver'  },
                ],
            },
        ],
    run: async (client, interaction) => {
          if (interaction.user.id !== interaction.guild.ownerId) return interaction.reply({content: `فقط الاونر شب يمكن يستخدم هذا الامر`, ephemeral: true})

        const alaction = interaction.options.getString('الاجراء');
      
        try {
          if(alaction === `privateserver`) {
                client.mysql.query('SELECT server_privacy FROM protection', async (error, results) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
            
                if (results.length > 0) { 
                client.mysql.query(`UPDATE protection SET server_privacy = ?`, 'private')
                await interaction.reply({ content: `تم وضع السيرفر سيرفر خاص`, ephemeral: true });        
                } else {
                    client.mysql.query('INSERT INTO protection (server_privacy) VALUES (?)', ['private'], async (error, results) => {
                        if (error) {
                            console.error(error);
                            return;
                        }
              
                        await interaction.reply({ content: `تم وضع السيرفر سيرفر خاص`, ephemeral: true });        
                    });              
                }      
                });
            } else if(alaction === `publicserver`) {
                client.mysql.query('SELECT server_privacy FROM protection', async (error, results) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
            
                if (results.length > 0) { 
                client.mysql.query(`UPDATE protection SET server_privacy = ?`, 'public')
                await interaction.reply({ content: `تم وضع السيرفر سيرفر عام`, ephemeral: true });        
                } else {
                    client.mysql.query('INSERT INTO protection (server_privacy) VALUES (?)', ['public'], async (error, results) => {
                        if (error) {
                            console.error(error);
                            return;
                        }
              
                        await interaction.reply({ content: `تم وضع السيرفر سيرفر عام`, ephemeral: true });        
                    });              
                }      
                });
            }


        } catch (err) { 
            interaction.reply({content: `حدث خطا: ${err.message}`})
            console.error(err)
        }
    }
}
