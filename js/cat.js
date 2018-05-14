const https = require("https");

let cat = {

	imageCat: function(message, image) {
		message.channel.send({"embed": {
			"color": 4295153,
			"image": { "url": image },
			"author": { "name": "It's your cat ?!", "url": image },
			"footer": { "text": "by random.cat" }
		}});
	},

	imageSet: function (message, url) {
		https.get(url, res => {
			if (res.statusCode === 200) {
				let req = "";
				res.on("data", data => req += data);
				res.on("end", () => { 
					req = JSON.parse(req);
					this.imageCat(message, req.file);
				});
			}
		}).on('error', err => message.channel.send("<:red_cross_mark"+":431911345378689034> | Une erreur c'est produite, réessayer plus tard."));     
	},

    exec: function(message) {
		this.imageSet(message, "https://aws.random.cat/meow");
	}
 	
};

module.exports = cat;