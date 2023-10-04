const { ApplicationCommandType, EmbedBuilder, ChannelType, ApplicationCommandOptionType, Discord } = require('discord.js')
const { CommandInteraction, Client, Permissions } = require("discord.js");

module.exports = {
        name: "avatar",
        description: "لسحب صورة الشخص",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'المستخدم',
                description: 'اختار الشخص او عن طريق ايديه',
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ],
    run: async (client, interaction) => {
       await interaction.deferReply({ephemeral: false})
          
       
    const user = interaction.options.getUser('المستخدم');
  
    interaction.editReply({content: user.displayAvatarURL({ dynamic: false, size: 1024 })})

    }
}
