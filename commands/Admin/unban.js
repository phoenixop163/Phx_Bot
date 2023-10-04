const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
        name: "unban",
        description: "فك حظر مستخدم من السيرفر",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الشخص',
                description: 'ايدي الشخص',
                type: ApplicationCommandOptionType.String,
                required: true
            },
        ],
        run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const member = await client.users.fetch(interaction.options.getString('الشخص'));

        const perms = await client.checkPerms([PermissionsBitField.Flags.BanMembers], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });

        try {
        const embed = new EmbedBuilder()
        embed.setTitle('🔨・فك باند')
        embed.addFields({name: "👤┆ فك باند من قبل", value: interaction.user.tag, inline: true}, {name: "👥┆ الشخص", value: `${member.username}#${member.discriminator} - ${member.id}`, inline: true})
        embed.setColor('Green')
        embed.setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()});

        interaction.editReply({embeds: [embed]}).then(function () {
            interaction.guild.members.unban(member.id)
          }).catch(function (err) {
            console.log(err)
          })
        } catch (err) {
            interaction.editReply({content: `حدث خطا`})
            console.log(err)
        }
    }
}
