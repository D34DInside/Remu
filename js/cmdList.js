const vote = require('./vote');
const neko = require('./neko');
const cat = require('./cat');
const bunny = require('./bunny');
const welcome = require('./welcome');
const perms = require('../data/permsData');

const cmd = {

	reg: /^sc$|^sc vote|^sc unvote|^sc list|^sc help$|^sc reset|^accepte$|^neko$|^cat$|^bunny$/,

	listExec: [
		"sc",
		"sc vote",
		"sc unvote",
		"sc list",
		"sc help",
		"sc reset",

		"accepte",

		"neko",
		"cat",
		"bunny",
	],

	listCommand: [
		"sc vote",
		"sc unvote",
		"sc list",
	],

	listTime: [
		5000,
		5000,
		10000,
	],

	exec: [
		function(message) {
			if (perms.guildVote.includes(message.guild.id)) vote.latestAnime(message);
		},
		function(message) {
			if (perms.guildVote.includes(message.guild.id)) vote.checkID(message);
		},
		function(message) {
			if (perms.guildVote.includes(message.guild.id)) vote.unVote(message);
		},
		function(message) {
			if (perms.guildVote.includes(message.guild.id)) vote.checkNbrVote(message);
		},
		function(message) {
			if (perms.guildVote.includes(message.guild.id)) vote.sendHelp(message);
		},
		function(message) {
			if (perms.guildVote.includes(message.guild.id)) vote.checkAnimeForReset(message);
		},

		function(message, bot) {
			if (message.guild.id === "417333630734565406") welcome.exec(message);
		},	

		function(message) {
			neko.exec(message);
		},
		function(message) {
			cat.exec(message);
		},
		function(message) {
			bunny.exec(message);
		},
	]

};

module.exports = cmd;
