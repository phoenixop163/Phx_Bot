const { ApplicationCommandType, PermissionsBitField, ApplicationCommandOptionType, ButtonBuilder,ActionRowBuilder, EmbedBuilder } = require('discord.js');
const { createAudioPlayer, createAudioResource, joinVoiceChannel, VoiceConnectionStatus } = require('@discordjs/voice');
const ytdl = require('@distube/ytdl-core');

module.exports = {
    name: "play",
    description: "تشغيل صوت",
    type: ApplicationCommandType.ChatInput,
    options: [
        {
            name: 'الرابط',
            description: 'رابط الفيديو',
            type: ApplicationCommandOptionType.String,
            required: true
        }
    ],
    run: async (client, interaction) => {
        await interaction.deferReply({ ephemeral: false });
    
        const perms = await client.checkPerms([PermissionsBitField.Flags.Administrator], interaction);
        if (perms == false) return await interaction.editReply({ content: `لا تمتلك/امتلك الصلاحيات للوصول إلى هذا الأمر`, ephemeral: true });

        try {
        
            var sid = 'Sound-' + client.generate(25)
        
            const link = interaction.options.getString('الرابط');
            if (!ytdl.validateURL(link)) {
                return await interaction.editReply({ content: "فشل في تشغيل الاغنية :( هل انت متأكد من رابط اليوتيوب؟" });
            }
    
            if (!interaction.member.voice.channel) {
                return await interaction.editReply({ content: "لازم تكون في روم" });
            }
            let info = await ytdl.getInfo(link);
            client.distube.voices.join(interaction.member.voice.channel)
            await client.distube.play(interaction.member.voice.channel, link);

            // console.log(client.distube)
            
            const embed = new EmbedBuilder()
            .setTitle('Now playing 🎶')
            .setDescription(`> **Name Song :** ${info.videoDetails.title}\n > **Start Music By :** ${interaction.user}\n > **Music Status :** \`Playing.\``)
            .setThumbnail(info.videoDetails.thumbnails[0].url)
            .setColor('Purple');

            const button = new ButtonBuilder()
            .setCustomId(`stopsound-${sid}`)
            .setEmoji('🛑')
            .setStyle('Danger');

            const button2 = new ButtonBuilder()
            .setCustomId(`pausesond-${sid}`)
            .setEmoji('⏸️')
            .setStyle('Primary');

            const button3 = new ButtonBuilder()
            .setCustomId(`resumesound-${sid}`)
            .setEmoji('▶')
            .setStyle('Primary');

        const row = new ActionRowBuilder()
            .addComponents(button, button2,button3);
            
            const themessage = await interaction.editReply({embeds: [embed], components: [row]})

            client.mysql.query(`INSERT INTO sounds (user,sid,messageid,title,thumbnails,status) VALUES ('${interaction.user.id}','${sid}', '${themessage.id}', '${info.videoDetails.title}', '${info.videoDetails.thumbnails[0].url}', 'Playing')`)
        } catch (e) {
            interaction.editReply({ content: `حدث خطأ` });
            console.error(e);
        }
    }
}
