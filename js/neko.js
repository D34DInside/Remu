const https = require("https");

let neko = {

	imageNeko: function(message, image, word) {
		message.channel.send({"embed": {
			"color": 4295153,
			"image": { "url": image },
			"author": { "name": "It's your " + word + " neko girl.", "url": image },
			"footer": { "text": "by nekos.life" }
		}});
	},

	imageSet: function (message, url, word) {
		https.get(url, res => {
			if (res.statusCode === 200) {
				let req = "";
				res.on("data", data => req += data);
				res.on("end", () => { 
					req = JSON.parse(req);
					this.imageNeko(message, req.neko, word);
				});
			}
		}).on('error', err => message.channel.send("<:red_cross_mark"+":431911345378689034> | Une erreur c'est produite, réessayer plus tard."));     
	},

    exec: function(message) {
		if (message.channel.nsfw) { this.imageSet(message, "https://nekos.life/api/lewd/neko", "hot") } 
		else { this.imageSet(message, "https://nekos.life/api/neko", "cute") }
	}
 	
};

module.exports = neko;