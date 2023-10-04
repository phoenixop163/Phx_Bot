const { ApplicationCommandType, EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, ModalBuilder, TextInputBuilder, ActionRowBuilder, Discord } = require('discord.js')
const { CommandInteraction, Client, Permissions } = require("discord.js");

module.exports = {
        name: "autoreply",
        description: "اضافة ايموجيات من سيرفر اخر",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "الاجراء",
                type: ApplicationCommandOptionType.String,
                required: true,
                description: 'اختاج الاجراء المطلوب',
                choices: [
                    { name: `اضافة رد`, value: 'addreply'  },
                    { name: `تعديل رد`, value: 'editreply'  },
                    { name: `حذف رد`, value: 'deletereply'  },
                    { name: `معرفة الردور المضافة`, value: 'getreplyes'  },
                ],
            },
        ],
    run: async (client, interaction) => {
        const perms = await client.checkPerms([PermissionsBitField.Flags.Administrator], interaction)
          if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });
          
        const alaction = interaction.options.getString('الاجراء');
      
        try {
            if(alaction === `addreply`) {

                const modal = new ModalBuilder()
                .setCustomId('addreply')
                .setTitle('اضافة رد تلقائي');
    
            const message2 = new TextInputBuilder()
                .setCustomId('message')
                .setLabel("الرسالة")
                .setPlaceholder("مثلا: السلام عليكم")
                .setStyle('Short')
                .setRequired(true);

                const reply2 = new TextInputBuilder()
                .setCustomId('reply')
                .setLabel("الرد")
                .setPlaceholder("مثلا: وعليكم السلام")
                .setStyle('Paragraph')
                .setRequired(true);
    
                const firstActionRow = new ActionRowBuilder().addComponents(message2);
                const secondActionRow = new ActionRowBuilder().addComponents(reply2);
        
                modal.addComponents(firstActionRow, secondActionRow);
        
                await interaction.showModal(modal);
                
            } else if(alaction === `editreply`) {

                const modal = new ModalBuilder()
                .setCustomId('editreply')
                .setTitle('تعديل رد تلقائي');
    
            const message2 = new TextInputBuilder()
                .setCustomId('message')
                .setLabel("الرسالة")
                .setPlaceholder("مثلا: السلام عليكم")
                .setStyle('Short')
                .setRequired(true);

                const reply2 = new TextInputBuilder()
                .setCustomId('reply')
                .setLabel("الرد")
                .setPlaceholder("مثلا: وعليكم السلام")
                .setStyle('Paragraph')
                .setRequired(true);
    
                const firstActionRow = new ActionRowBuilder().addComponents(message2);
                const secondActionRow = new ActionRowBuilder().addComponents(reply2);
        
                modal.addComponents(firstActionRow, secondActionRow);
        
                await interaction.showModal(modal);
    
            } else if(alaction === `deletereply`) {
                
                const modal = new ModalBuilder()
                .setCustomId('deletereply')
                .setTitle('ازالة رد تلقائي');
    
            const message2 = new TextInputBuilder()
                .setCustomId('message')
                .setLabel("الرسالة")
                .setPlaceholder("مثلا: السلام عليكم")
                .setStyle('Short')
                .setRequired(true);
    
                const firstActionRow = new ActionRowBuilder().addComponents(message2);
        
                modal.addComponents(firstActionRow);
        
                await interaction.showModal(modal);
    
            } else if(alaction === `getreplyes`) {
                client.mysql.query('SELECT * FROM autoreply', async (error, results) => {
                    if (error) {
                        console.error(error);
                        return;
                    }
            
                if (results.length > 0) {  
                    const replys = results;

                    const embed = new EmbedBuilder()
                        .setTitle('الردود المضافة');
        
                    const fields = [];
        
                    replys.forEach((reply, index) => {
                        fields.push({
                            name: `رد ${index + 1}`,
                            value: `**الرسالة:** ${reply.message}\n**الرد:** ${reply.reply}`,
                        });
                    });
        
                embed.addFields(fields)
                embed.setColor('Purple');

                await interaction.reply({ embeds: [embed], ephemeral: true });        
                } else {
                interaction.reply({ content: `لا يوجد ردود تلقائية في قائمة الردود`, ephemeral: true });
                }      
                });
            }    
        } catch (err) { 
            interaction.reply({content: `حدث خطا: ${err.message}`})
            console.error(err)
        }
    }
}
