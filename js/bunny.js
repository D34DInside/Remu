const https = require("https");

let bunny = {

	imageBunny: function(message, image) {
		message.channel.send({"embed": {
			"color": 4295153,
			"image": { "url": image },
			"author": { "name": "It's your bunny ?!", "url": image },
			"footer": { "text": "by bunnies.io" }
		}});
	},

	imageSet: function (message, url) {
		https.get(url, res => {
			if (res.statusCode === 200) {
				let req = "";
				res.on("data", data => req += data);
				res.on("end", () => { 
					req = JSON.parse(req);
					this.imageBunny(message, req.media.poster);
				});
			}
		}).on('error', err => message.channel.send("<:red_cross_mark"+":431911345378689034> | Une erreur c'est produite, réessayer plus tard."));     
	},

    exec: function(message) {
		this.imageSet(message, "https://api.bunnies.io/v2/loop/random/?media=poster");
	}
 	
};

module.exports = bunny;