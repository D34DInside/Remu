let welcome = {

	sentence_1: [
		"Oh mon dieu ! ",
	    "Quoi ?! ",
	    "Attention ! " ,
	    "Hey ! ",
	    "Enfin ! ",
	    "Ah ! ",
	    "Un ",
	    "Le voilà ! ",
    ],

    sentence_2: [
		" est arrivé !",
	    " est ici ?!",
	    " a spawn !" ,
	    " nous a rejoint.",
	    " est là !",
	    " est maintenant parmis nous.",
	    " est apparu soudainement.",
	    " est arrivé !",
	],

	exec: function(message, bot) {
		let roleMembre = message.guild.roles.find("name", "Membre");
		let sentenceRandom = undefined;
		if (!message.member.roles.has(roleMembre.id)) {
			message.member.addRole(roleMembre);
			sentenceRandom = Math.round(Math.random() * this.sentence_1.length);
			bot.channels.get('417622067513524224').send(":inbox_tray: " + this.sentence_1[sentenceRandom] + message.author + this.sentence_2[sentenceRandom]);
		}
		message.delete();
	}
 	
};

module.exports = welcome;