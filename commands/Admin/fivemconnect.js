const { ApplicationCommandType, ApplicationCommandOptionType,PermissionsBitField, EmbedBuilder } = require('discord.js');
const config = require('../../config');
const FiveM = require("fivem")

module.exports = {
        name: "fivemconnect",
        description: "عرض حالة السيرفر وعدد اللاعبين المتصلين",
        type: ApplicationCommandType.ChatInput,
        options: [
            {
                name: 'الايبي',
                description: 'الايبي مع البورتات مثلا : 127.0.0.1:30120',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'الروم',
                description: 'اختار روم الحالة',
                type: ApplicationCommandOptionType.Channel,
                required: true
            },
        ],
        run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: true });
        const ip = interaction.options.getString('الايبي');
        
        if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}:30120$/.test(ip)) {
            return await interaction.editReply({ content: `الايبي غلط (يجب ان يكون مثل: 127.0.0.1:30120)`, ephemeral: true });
        }
                        
        const channel = interaction.options.getChannel('الروم');

        const perms = await client.checkPerms([PermissionsBitField.Flags.Administrator], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });

        try {            
            new FiveM.Server(ip).getServerStatus().then(data => {
                if (data.online) {
                new FiveM.Server(ip).getPlayers().then(data2 => {
                    const embed = new EmbedBuilder()
                    embed.setTitle('Server Status')
                    embed.setDescription(`This server is online.`)
                    embed.addFields({name: 'Server Status', value: 'Online', inline: true}, {name: 'Players Online', value: `${data2}`, inline: true})
                    embed.setColor('Green')
                    embed.setThumbnail(interaction.guild.iconURL())
                    channel.send({embeds: [embed]})
                })
                } else {
                    const embed = new EmbedBuilder()
                    embed.setTitle('Server Status')
                    embed.setDescription(`This server is online.`)
                    embed.addFields({name: 'Server Status', value: 'Offline', inline: true}, {name: 'Players Online', value: `0`, inline: true})
                    embed.setColor('Red')
                    embed.setThumbnail(interaction.guild.iconURL())
                    channel.send({embeds: [embed]})
                }
            })

        } catch (err) {
            interaction.editReply({content: `حدث خطا`})
            console.error(err)
        }
    }
}
