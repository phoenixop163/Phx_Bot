const { ApplicationCommandType, PermissionsBitField, ApplicationCommandOptionType } = require('discord.js');
const config = require('../../config');

module.exports = {
    name: "antiword",
    description: "اضافة كلمة ممنوعة",
    options: [
        {
            name: "الكلمة",
            description: "الكلمة الذي تريد منعها من الكتابة",
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    type: ApplicationCommandType.ChatInput,
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const word = await interaction.options.getString('الكلمة');
    
        const perms = await client.checkPerms([PermissionsBitField.Flags.Administrator], interaction);
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول إلى هذا الأمر`, ephemeral: true });
    
        try {
            const sql = 'SELECT antiword_words FROM protection';

            client.mysql.query(sql, async (error, results) => {
              if (error) {
                console.error(error);
                return;
              }
      
              if (results.length > 0) {
                let klmatqdemh = [];
                const data = results[0].antiword_words;

                try {
                    if (typeof data === 'string') {
                        klmatqdemh = JSON.parse(data);
                    }
                } catch (error) {
                    console.error(error);
                }

                if (!klmatqdemh.includes(word)) {
                    klmatqdemh.push(word);

                    await client.mysql.query('UPDATE protection SET antiword_words = ?', [JSON.stringify(klmatqdemh)]);

                    interaction.editReply({ content: `تم اضافة الكلمة كلمة ممنوعة` });
                } else {
                    interaction.editReply({ content: `الكلمة المطلوبة موجودة بالفعل` });
                }
            }
            });
        } catch (err) {
            interaction.editReply({ content: `حدث خطأ` });
            console.error(err);
        }
    }
}
