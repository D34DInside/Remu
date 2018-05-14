const fs = require('fs');
const MalApi = require('mal-api'); // npm i mal-api
const https = require("https");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const perms = require('../data/permsData');

const voteData = JSON.parse(fs.readFileSync("data/voteData.json"));
const animeData = JSON.parse(fs.readFileSync("data/animeData.json"));

const vote = {

    mal: new MalApi({
        username: 'yourUsername',
        password: 'yourPassword',
    }),

    creatAnime: function(message, anime) {
        voteData[anime.id] = {
            title: anime.title,
            episodes: anime.episodes, 
            image: anime.image, 
            voter: [ message.member.id ]
        }

        message.channel.send(":white_check_mark: | **" + message.member.displayName + "**, tu as voté pour **" + anime.title + "** | votes: **" + voteData[anime.id].voter.length + "**");
        
        fs.writeFile("data/voteData.json", JSON.stringify(voteData), (err) => { if (err) console.error(err); });
    },

    checkAnime: function(message, title) {
        this.mal.anime.searchAnime(title)
            .then((res) => {
            if (res.length === undefined) return this.creatAnime(message, res);
                this.creatAnime(message, res[0]);
            })
            .catch(err => message.channel.send("<:red_cross_mark"+":431911345378689034> | Il y a une erreur lors de l'éxécution de l'API, réessayer plus tard."))     
    },

    _getURL: function(id) {
        return "https://myanimelist.net/anime/" + id;
    },

    _req: function(message, url) {
        https.get(url, (res) => {
            if (res.statusCode !== 200) return message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, l'anime n'a pas été trouvé!");  
                let req = "";
                res.on('data', data => req += data);
                res.on('end', () => {
                    let dom = new JSDOM(req);
                    vote.checkAnime(message, dom.window.document.querySelectorAll("h1")[0].textContent);
                });             
            }).on('error', err => message.channel.send("<:red_cross_mark"+":431911345378689034> | Une erreur c'est produite, réessayer plus tard."));                    
    },

    addVote: function(message, id) {
        if (voteData[id].voter.includes(message.member.id)) {
            message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, tu as déjà voté pour **" + voteData[id].title + "**");
        } else {
            voteData[id].voter.push(message.member.id);
            message.channel.send(":white_check_mark: | **" + message.member.displayName + "**, tu as voté pour **" + voteData[id].title + "** | votes: **" + voteData[id].voter.length + "**");
        }

        fs.writeFile("data/voteData.json", JSON.stringify(voteData), (err) => { if (err) console.error(err); });
    },

    unVote: function(message) {
        if (message.content.substr(10, 1) === " ") {
            let id = message.content.substr(11);
            if (isNaN(id)) {
                message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, votre message ne contient aucune **id**!");
            }
            else {
                if (voteData[id] !== undefined && voteData[id].voter.includes(message.member.id)) {
                    let pos = voteData[id].voter.indexOf(message.member.id);
                    voteData[id].voter.splice(pos, 1);
                    if (voteData[id].voter.length === 0) {
                        delete voteData[id];
                    }
                    message.channel.send(":white_check_mark: | **" + message.member.displayName + "**, tu as retiré ton vote!");
                } else {
                   message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, tu n'as pas voté pour cette anime!"); 
                }            
            }         

            fs.writeFile("data/voteData.json", JSON.stringify(voteData), (err) => { if (err) console.error(err); });   
        }
        else if (message.content.substr(10, 1) === "") {
            message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, fait `=sc unvote <animeID>` pour retirer votre vote!");
        }
    },

    checkID: function(message) {
        if (message.content.substr(8, 1) === " ") {
            let id = message.content.substr(9);
            if (isNaN(id)) {
                message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, votre message ne contient aucune **id**!");
            } else {
                if (!voteData[id]) {
                    this._req(message, this._getURL(id));
                } else {
                    this.addVote(message, id);
                }
            }
        } else if (message.content.substr(8, 1) === "") {
            message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, fait `=sc vote <animeID>` pour voter!");
        }
    },

    creatTabNbrVote: function(tabID) {
        let tabVote = [];
        for (var s = 0; s < tabID.length; s++) {
            tabVote.push(voteData[tabID[s]].voter.length);
        }
        return tabVote
    },

    sendListVote: function(message, tabID, rangNbr, id) {
        let tabVote = this.creatTabNbrVote(tabID);

        let posVote = rangNbr;
        let sendVote = "```json\n📄 Liste d'anime n°" + id + "\n\n" ;
        for (var i = 0; i < tabID.length; i++) {
            let maxVote = Math.max(...tabVote); // return nbr max
            if (maxVote !== null) {
                let pos = tabVote.indexOf(maxVote); // return first position
                posVote++;
                sendVote = sendVote + "[" + (posVote) + "] " + voteData[tabID[pos]].title + " (#" + tabID[pos] + ") Ep: " + voteData[tabID[pos]].episodes + "\n      > Vote Totale : " + voteData[tabID[pos]].voter.length + "\n"; 
                tabVote.splice(pos, 1, null);    
            }
        }
        message.channel.send(sendVote + "```");
    },

    checkNbrVote: function(message) {
        let tabID = Object.keys(voteData);
        if (tabID.length > 0) {
            if (message.content.substr(8, 1) === " ") {
                let id = message.content.substr(9);
                if (isNaN(id)) {
                    message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, votre message ne contient aucune **id**!");
                } else {
                    idlatest = eval(id + "0");
                    tabID = tabID.splice((idlatest - 10), idlatest);
                    if (tabID.length > 0) {
                        this.sendListVote(message, tabID, (idlatest - 10), id);
                    } else {
                        message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, la liste `" + id + "` n'existe pas!");
                    }
                }
            } else if (message.content.substr(8, 1) === "") {
                this.sendListVote(message, tabID.splice(0, 10), 0, 1)
            } 
        } else {
            message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, il n'y a eu aucun vote pour le moment!"); 
        }
    },

    sendHelp: function(message) {
        message.channel.send({"embed": {
            "title": "Commandes pour les simulcast:",
            "color": 4295153,
            "fields": [
                { "name": "=sc", "value": "Montre le prochaine animé programmé." },
                { "name": "=sc list", "value": "Affiches la liste des votes." },
                { "name": "=sc vote <animeID>", "value": "Vote pour animé présent sur [myanimelist.net](https://myanimelist.net/)." },
                { "name": "=sc unvote <animeID>", "value": "Enlève son vote pour un animé." }
            ]
        }});
    },

    embedAnime: function(message, anime) {
        message.channel.send({"embed": {
            "color": 4295153,
            "thumbnail": { "url": anime.image },
            "author": { "name": anime.title + " (#" + anime.id + ")"},
            "fields": [
                { "name": "Episodes","value": anime.episodes, "inline": true },
                { "name": "Vote Totale","value": anime.voter, "inline": true },
                { "name": "Lien", "value": "https://myanimelist.net/anime/" + anime.id, "inline": true },
            ]
        }});
    },

    latestAnime: function(message) {
        if (animeData["latest"] !== undefined) {
            this.embedAnime(message, animeData["latest"]);
        } else {
            message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, il n'y a aucun anime programmé pour le moment!");
        }
    },

    purgeAnime: function(message, tabID) {
        for (var i = 0; i < tabID.length; i++) {
            delete voteData[tabID[i]];
        }
        fs.writeFile("data/voteData.json", JSON.stringify(voteData), (err) => { if (err) console.error(err); });  
    },

    resetAnime: function(message, anime, id) {
        if (animeData["latest"] !== undefined) {
            delete animeData["latest"];
        }
        animeData["latest"] = {
            title: anime.title,
            id: id,
            episodes: anime.episodes, 
            image: anime.image, 
            voter: anime.voter.length
        }

        this.purgeAnime(message, Object.keys(voteData));
        this.latestAnime(message); 

        fs.writeFile("data/animeData.json", JSON.stringify(animeData), (err) => { if (err) console.error(err); });  
    },     

    checkAnimeForReset: function(message) {
        if (perms.forReset.includes(message.member.id)) {
            if (message.content.substr(9,1) === " ") { // check nbr for reset
                let id = message.content.substr(10);
                if (isNaN(id)) {
                    message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, votre message ne contient aucune **id**!");
                } else {
                    if (voteData[id] !== undefined) {
                        this.resetAnime(message, voteData[id], id);
                    } else {
                        message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, l'id ne correspond à aucun anime présent dans le liste!");
                    }
                }
            } 
            else if (message.content.substr(9,1) === "") { // reset first anime
                let tabID = Object.keys(voteData);
                if (tabID.length > 0) {
                    let tabVote = this.creatTabNbrVote(tabID); // list nbr vote
                    let pos = tabVote.indexOf(Math.max(...tabVote));
                    let id = tabID[pos];
                    this.resetAnime(message, voteData[id], id);
                } else {
                    message.channel.send("<:red_cross_mark"+":431911345378689034> | **" + message.member.displayName + "**, il n'y a aucun anime dans la liste!");
                }
            }
        }
    }

};

module.exports = vote;
