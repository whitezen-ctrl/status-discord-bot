const Discord = require('discord.js');
const { TOKEN, PREFIX } = require('./config')
const client = new Discord.Client();
const tcpp = require('tcp-ping');
const async = require('async');


// Client on console
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// status
client.on("message", async message => {
    if(message.author.bot) return;
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    if (cmd === `${PREFIX}status`){
        if(!message.member.hasPermission("ADMINISTRATOR") && message.author.id != '327530696748826635') return message.channel.send(`Tu n'as pas la permission...`);
    const emoji = message.guild.emojis.cache.find(e => e.name === ":green_circle:")
    const loading = "🕒 Ping en cours ...";
    var nodes = {
        0: "192.168.0.0",
        1: "151.80.12.192",
       }


    var status = {
        1: loading,
        2: loading,
        }
    message.guild.channels.cache.get('801491765475541012').send(`**___Status de nos serveurs___**
    Les status sur cette page sont actualisés toutes les 60 secondes.`)


    function createembed() {
        var botIcon = client.user.displayAvatarURL;
        return embed = new Discord.MessageEmbed()
            .setColor("#46a7f2")
            .setTitle("Status")
            .setFooter("", botIcon)
            .setThumbnail(botIcon)
            .addField("Nodes" ,`\NSite WEB : ${status[1]}  [Lien](https://plento.fr.nf/)`)
            .setTimestamp()
    }


    message.guild.channels.cache.get('801491765475541012').send({
        embed: createembed()

    }).then(function(m) {
        setInterval(() => {
            
      status[0] = emoji;
 
 
        m.edit({
            embed: createembed()
        })

        async.forEachOf(nodes, (value, key, callback) => {
            tcpp.ping({
                address: value,
                port: 80,
                timeout: 10000
            }, function(err, data) {
                if (data.max == undefined) {
                    status[key] = "🔴 Hors Ligne";
                } else  {
                    let ping = data.avg.toFixed(0)
                    status[key] = ":green_circle: En Ligne " + `(${ping}ms)`;
                }
                m.edit({
                    embed: createembed()
                })
 
            });
        });
        }, 60000);
    })
}
}
);



client.login(TOKEN);