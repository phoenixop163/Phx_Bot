const { ApplicationCommandType, EmbedBuilder, PermissionsBitField, ApplicationCommandOptionType, Discord } = require('discord.js')
const { CommandInteraction, Client, Permissions } = require("discord.js");

module.exports = {
        name: "addemoji",
        description: "اضافة ايموجيات من سيرفر اخر",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: "الايموجي",
                type: ApplicationCommandOptionType.String,
                required: true,
                description: 'اكتب الايموجي'
            },
        ],
    run: async (client, interaction) => {
        interaction.deferReply({ephemeral: true})

        const perms = await client.checkPerms([PermissionsBitField.Flags.ManageEmojisAndStickers], interaction)
          if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });
          
        const rawEmoji = interaction.options.getString('الايموجي');
        const parsedEmoji = client.parseEmoji(rawEmoji);
      
        if (parsedEmoji.id) {
          const extension = parsedEmoji.animated ? ".gif" : ".png";
          const url = `https://cdn.discordapp.com/emojis/${parsedEmoji.id + extension}`;
        
          try {
            await interaction.guild.emojis.create({ attachment: url, name: parsedEmoji.name });
            await interaction.editReply({ content: 'تم إضافة الإيموجي', ephemeral: true });
        } catch (err) {
            if (err.rawError.message == 'Maximum number of emojis reached (50)') {
                await interaction.editReply({ content: `لا يمكنك اضافة ايموجيات اخرى الحد الاقصى 50`, ephemeral: true });
            } else {
                await interaction.editReply({ content: `حدث خطأ: ${err}`, ephemeral: true });
            }
        }

      }
    }
}
