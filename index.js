const Discord = require('discord.js');
const bot = new Discord.Client();
const fs = require('fs');

const cmd = require('./js/cmdList');

const prefix = "=";

bot.on('ready', () => {  

	console.log("REM est prête !")
	bot.user.setStatus('dnd')
    	bot.user.setPresence({game: {name: "être capricieuse !", type: 0}});

	bot.channels.get('418175138454962179').send({embed: {
		    "description": "**" + bot.user.username + "#" + bot.user.discriminator + "** a été redémarré.",
		    "color": 4295153,
		    "timestamp": new Date(),
		    "footer": { "icon_url": bot.user.avatarURL, "text": "Bot restart" }   
	}});

});

// -------

bot.on('message', message => {

	let msg = message.content;

	if (!message.member.user.bot && message.channel.permissionsFor(bot.user).has("SEND_MESSAGES")
				&& message.channel.permissionsFor(bot.user).has("USE_EXTERNAL_EMOJIS")
				&& message.channel.permissionsFor(bot.user).has("EMBED_LINKS")
				&& message.channel.permissionsFor(bot.user).has("ATTACH_FILES")
	) {

		const userData = JSON.parse(fs.readFileSync("data/userData.json"));

		if (!userData[message.member.id]) {
			userData[message.member.id] = {
				listCmdOff: [],
			}
		}

		function timerCmd() {
			if (userData[message.member.id] !== undefined) userData[message.member.id].listCmdOff = [];
			fs.writeFile("data/userData.json", JSON.stringify(userData), (err) => { if (err) console.error(err); });
		}

		if (userData[message.member.id] !== undefined && cmd.reg.test(msg.substr(prefix.length))) {
			let command = cmd.reg.exec(msg.substr(prefix.length))[0];
			if (userData[message.member.id].listCmdOff.includes(command)) { // if command sending by member is on "listCmdOff"
				return message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, attend **quelque seconde** avant de faire cette commande!");
			} else {
				cmd.exec[cmd.listExec.indexOf(command)](message, bot);
				if (cmd.listCommand.includes(command)) {
					userData[message.member.id].listCmdOff.push(command);
					let pos = cmd.listCommand.indexOf(command);
					setTimeout(timerCmd, cmd.listTime[pos]);
				}
			}
		}

		fs.writeFile("data/userData.json", JSON.stringify(userData), (err) => { if (err) console.error(err); });

	}

});

bot.login('TOKEN');
