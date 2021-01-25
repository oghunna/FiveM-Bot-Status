const { Client, MessageEmbed } = require('discord.js');
const config = require('./config.json');
const request = require('request');

const client = new Client({
    disableEveryone: true,
    MESSAGE: true,
    CHANNEL: true,
});



client.on("ready", () => {
    console.log(`Zalogowano jako ${client.user.username}`);
    client.user.setPresence({
        status: "ONLINE",
        game: {
            name: `Pobieranie statusu...`,
            type: "WATCHING",
        }
    });
})

/** 
 * Wiadomość do bota DM / chat
*/

client.on("message", async message => {
    // if (!message.guild) return;
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd !== null) {
        if (cmd === "pomoc") {
            const text = new MessageEmbed()
            .setTitle('Przydatne komendy')
            .setColor('#DA242F')
            .addField(`!regulamin`, `Link do regulaminu serwera.`)
            .addField(`!ip`, `IP serwera.`)
            .setTimestamp()
            .setFooter('ExperienceRP',) 
            message.channel.send(text);
        } else if (cmd == "regulamin") {
            const text = new MessageEmbed()
            .setTitle('Regulamin (kliknij)')
            .setColor('#DA242F')
            .setURL(`https://docs.google.com/document/d/1SmBEU0Gsx3xYTKB2pAvTKWxBWUh7a0LcArl1XydhL3c/edit?usp=sharing`)
            .setTimestamp()
            .setFooter('ExperienceRP',) 
            message.channel.send(text);
        } else if (cmd == "ip") {
            const text = new MessageEmbed()
            .setTitle('**IP**')
            .setColor('#DA242F')
            .setDescription("connect 51.83.169.249:30120")
            .setTimestamp()
            .setFooter('ExperienceRP',) 
            message.channel.send(text);
        } else if (cmd == 'koniec') {
            message.channel.send('Wyspa');
        } else {
            const text = new MessageEmbed()
            .setTitle('Nieprawidłowa komenda, dostępne komendy :')
            .setColor('#DA242F')
            .addField(`!regulamin`, `Link do regulaminu serwera.`)
            .addField(`!ip`, `IP serwera.`)
            .setTimestamp()
            .setFooter('ExperienceRP',) 
            message.channel.send(text);
        }
    }
})

/** 
 * co minutowe odsiwezanie 
*/

client.setInterval(async () => {
    if (config.message_status_id === null || config.channel_status_id === null || config.fivem_info_url === null || config.fivem_players_url == null) return;
    if (config.message_status_id === '' || config.channel_status_id === '' || config.fivem_info_url === '' || config.fivem_players_url == '') return;    
    client.channels.cache.get(config.channel_status_id).messages.fetch(config.message_status_id).then(m => {
        request(config.fivem_info_url, function (err, response, fiveminfo) {
        request(config.fivem_players_url, function (err1, response1, fivemplayers) {
            const ServerError = new MessageEmbed()
                .setTitle('ExperienceRP | Serwer aktualnie jest wyłączony ')
                .setColor('#DA242F')
                .setDescription(`**Offline**`)
                .setTimestamp()
                .setFooter('ExperienceBot ©',)
            let offline_presence = client.user.setPresence({status: "ONLINE", game: { name: `Server Offline !`, type: "WATCHING",} });
            if (response === undefined || response1 === undefined) {
                m.edit(ServerError).catch(error => console.log(error));
                offline_presence
                console.log("Odswiezono (Server OFFLINE)")
                return
            }
            if (err || err1) {
                m.edit(ServerError)
                offline_presence
                console.log("Odswiezono ERROR")
                return
            } else {
                console.log("Odswiezono (SERVER ONLINE)")
                var info = JSON.parse(fiveminfo);
                var players = JSON.parse(fivemplayers);
                if (players.length === 0) {
                    const ServerOnline = new MessageEmbed()
                        .setTitle(`ExperienceRP | Lista Graczy ${players.length}/${info.vars.sv_maxClients} `)
                        .setColor('#00fbff')
                        .setTimestamp()
                        .setFooter('ExperienceBot ©',)
                    m.edit(ServerOnline).catch(error => console.log(error));
                    client.channels.cache.get('803385445588402198').setName(`🔥: ${players.length}/64`);
                } else {
                    var nick = "";
                    var id = "";
                    
                    players.forEach(function (element) {
                        nick += `\n${element.name}`
                        id += `\n${element.id}`
                    });
                    const ServerOnline = new MessageEmbed()
                        .setTitle(`ExperienceRP | Lista Graczy ${players.length}/${info.vars.sv_maxClients} `)
                        .setColor('#00fbff')
                        .addField(`ID:`, `${id}`, true)
                        .addField(`Nick:`, `${nick}`, true)
                        .setTimestamp()
                        .setFooter('ExperienceBot ©',)
                        status = `ExperienceRP: ${players.length}/64`
                        client.user.setActivity(status, {type: 'WATCHING'})
                        client.channels.cache.get('803385445588402198').setName(`🔥: ${players.length}/64`); 
                    m.edit(ServerOnline).catch(error => console.log(error));              
                }
            }
        });
        });
    }).catch(error => {
        console.log('\x1b[41m%s\x1b[0m', `Error:\n${error}`);
    });
}, 30 * 1000);

client.login(config.token);

/** 
 * koniec ROFL
*/
