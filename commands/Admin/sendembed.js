const { ApplicationCommandType, ApplicationCommandOptionType, ModalBuilder, TextInputComponent, ActionRowBuilder, TextInputBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
        name: "sendembed",
        description: "ارسال امبد لروم معين",
        type: ApplicationCommandType.ChatInput,
        run: async (client, interaction) => {
        const perms = await client.checkPerms([PermissionsBitField.Flags.Administrator], interaction)
        if (perms == false) return await interaction.editReply({ content: `لا امتلك/تمتلك الصلاحيات للوصول الى هذا الامر`, ephemeral: true });

        try {

            console.log(interaction.channel.id)
        const modal = new ModalBuilder()
            .setCustomId(`sendnewembed-${interaction.channel.id}`)
            .setTitle('ارسال امبد (يجب ان تكون بالروم)');

        const title = new TextInputBuilder()
            .setCustomId('embedtitle')
            .setLabel("Title")
            .setPlaceholder("")
            .setStyle('Short')
            .setRequired(true);

        const description = new TextInputBuilder()
            .setCustomId('embeddescription')
            .setLabel("Description")
            .setPlaceholder("")
            .setStyle('Paragraph')
            .setRequired(true);

        const image = new TextInputBuilder()
            .setCustomId('embedimage')
            .setLabel("Image")
            .setPlaceholder("")
            .setStyle('Short')
            .setRequired(true);

        const color = new TextInputBuilder()
            .setCustomId('embedcolor')
            .setLabel("Color")
            .setPlaceholder("")
            .setStyle('Short')
            .setRequired(true);

        const content = new TextInputBuilder()
            .setCustomId('embedcontent')
            .setLabel("Content")
            .setPlaceholder("")
            .setStyle('Paragraph')
            .setRequired(true);

        const row = new ActionRowBuilder().addComponents(title);
        const row2 = new ActionRowBuilder().addComponents(description);
        const row3 = new ActionRowBuilder().addComponents(image);
        const row4 = new ActionRowBuilder().addComponents(color);
        const row5 = new ActionRowBuilder().addComponents(content);
        modal.addComponents(row, row2, row3, row4, row5);
        await interaction.showModal(modal);

        } catch (error) {
            console.error(error);
            await interaction.reply('> **ارسال الامبد حدث خطأ اثناء محاولة **');
        }
    }
}
