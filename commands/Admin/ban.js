const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
        name: "ban",
        description: "حظر مستخدم من السيرفر",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الشخص',
                description: 'الشخص',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'الايام',
                description: 'اكتب ايام الحظر',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'السبب',
                description: 'اكتب سبب الحظر',
                type: ApplicationCommandOptionType.String,
                required: true
            },
        ],
        run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const member = await interaction.guild.members.fetch(interaction.options.getUser('الشخص').id);
        const reason = interaction.options.getString('السبب') || 'لا يوجد';
        const days = interaction.options.getString('الايام') || 7;

        const perms = await client.checkPerms([PermissionsBitField.Flags.BanMembers], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });

        if (member.permissions.has(PermissionsBitField.Flags.BanMembers) || member.permissions.has(PermissionsBitField.Flags.BanMembers)) return interaction.editReply({ content: `لا يمكنك تبنيد اداري`, ephemeral: true });

        try {
        const embed = new EmbedBuilder()
        embed.setTitle('🔨・باند')
        embed.addFields({name: "👤┆ تبند من قبل", value: interaction.user.tag, inline: true}, {name: "💬┆ السبب", value: reason, inline: true}, {name: "⏳┆ الايام", value: days, inline: true})
        embed.setColor('Red')
        embed.setFooter({text: interaction.guild.name, iconURL: interaction.guild.iconURL()});

        interaction.editReply({embeds: [embed]}).then(function () {
            member.ban({ days: days, reason: reason })
          }).catch(function (err) {
            console.log(err)
          })
        } catch (err) {
            interaction.editReply({content: `حدث خطا`})
            console.log(err)
        }
    }
}
