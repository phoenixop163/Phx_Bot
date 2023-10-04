const { ApplicationCommandType, EmbedBuilder, ChannelType, ApplicationCommandOptionType, Discord } = require('discord.js')
const { CommandInteraction, Client, Permissions } = require("discord.js");
const config = require('../../config');
const BITLY_API_KEY = config.Settings.Bitly_api_key;

module.exports = {
        name: "short",
        description: "اختصار الروابط الطولية",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الرابط',
                description: 'الرابط الذي تريد اختصاره',
                type: ApplicationCommandOptionType.String,
                required: true
            }
        ],
    run: async (client, interaction) => {
       await interaction.deferReply({ephemeral: true})
      const link = interaction.options.getString('الرابط');
  
      try {
        const response = await fetch('https://api-ssl.bitly.com/v4/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${BITLY_API_KEY}`,
            },
            body: JSON.stringify({ long_url: link }),
        });         

        if (response.ok) {
            const data = await response.json();
            interaction.editReply(`${data.link}`);
        } else {
            interaction.editReply('حدث خطا اثناء الاختصار');
        }
    } catch (error) {
        console.error(error);
        interaction.editReply('حدث خطا');
    }

    }
}
