const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config');

module.exports = {
        name: "kick",
        description: "طرد مستخدم من السيرفر",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الشخص',
                description: 'الشخص',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'السبب',
                description: 'اكتب سبب الطرد',
                type: ApplicationCommandOptionType.String,
                required: true
            },
        ],
        run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const member = await interaction.guild.members.fetch(interaction.options.getUser('الشخص').id);
        const reason = interaction.options.getString('السبب') || 'لا يوجد';;

        const perms = await client.checkPerms([PermissionsBitField.Flags.KickMembers], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });

        if (member.permissions.has(PermissionsBitField.Flags.KickMembers) || member.permissions.has(PermissionsBitField.Flags.KickMembers)) return interaction.editReply({ content: `لا يمكنك طرد اداري`, ephemeral: true });

        try {
        const embed = new EmbedBuilder()
        embed.setTitle('🔨・باند')
        embed.addFields({name: "👤┆ طردك من قبل", value: interaction.user.tag, inline: true}, {name: "💬┆ السبب", value: reason, inline: true})

        interaction.editReply({embeds: [embed]}).then(function () {
            // member.ban({ days: days, reason: reason })
            member.kick(reason)
          }).catch(function (err) {
            console.log(err)
          })
        } catch (err) {
            interaction.editReply({content: `حدث خطا`})
            console.log(err)
        }
    }
}
