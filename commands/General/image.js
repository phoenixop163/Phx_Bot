const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField } = require('discord.js');
const config = require('../../config');
const apikey = config.Settings.Deepai_api_key;

module.exports = {
        name: "image",
        description: "لانشاء صورة بالذكاء الاصطناعي",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الوصف',
                description: 'اكتب وصف الصورة',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ],
        run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const description = interaction.options.getString('الوصف');
        
        try {
            const response = await fetch('https://api.deepai.org/api/text2img', {
                method: 'POST',
                headers: {
                    'Api-Key': apikey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ text: description }),
            });

            console.log(response);
            if (!response.ok) {
                // throw new Error('in fetching respone');
                await interaction.editReply(`حدث خطا: ${response.status}`);
            }

            const data = await response.json();
            const imageUrl = data.output_url;
            await interaction.editReply({content: `${imageUrl}`});
        } catch (error) {
            console.error(error);
            await interaction.editReply('حدث خطا');
        }
    }
}
