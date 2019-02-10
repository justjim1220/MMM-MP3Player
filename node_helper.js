/* Magic Mirror
 *
 * Node Helper: MMM-MP3Player
 *
 * By justjim1220 aka Jim Hallock (justjim1220@gmail.com)
 * 
 * GNU Licensed
 *
 */

var express = require("express");
var NodeHelper = require("node_helper");
var request = require("request");
var url = require("url");
var path = require("path");
var fs = require("fs");
var mime = require("mime-types");


module.exports = NodeHelper.create({
	// Override start method.
	start: function() {
		var self = this;
		console.log("Starting node helper for: " + this.name);
		this.setConfig();
		this.extraRoutes();

	},

	setConfig: function() {
		this.config = {};
		this.path_songs = path.resolve(__dirname + "/music");
		console.log("  music path = "+this.path_songs);
	},

	// Override socketNotificationReceived method.
	socketNotificationReceived: function(notification, payload) {
		if (notification === "MP3PLAYER_REGISTER_CONFIG")
			this.config = payload;
		else if (notification === "MP3PLAYER_GET_FILELIST"){
		console.log("requested to get list of files ");
			var mp3Player = this.getMusic(this.getFiles(this.path_songs)).map(function (mp3) {
			console.log("have song="+mp3);
			return {url: "/MMM-MP3Player/music/" + mp3};
			})
			this.sendSocketNotification("MP3PLAYER_FILELIST", mp3Player);
		}
	},

	// create routes for module manager.
	// recive request and send response
	extraRoutes: function() {
		var self = this;

		this.expressApp.get("/MMM-MP3Player/music", function(req, res) {
			console.log("received request for music files");
			self.getMusicSongs(req, res);
		});

		//this.expressApp.use("/MMM-MP3Player/music", express.static(self.path_songs));
	},

	// return music-songs by response in JSON format.
	getMusicSongs: function(req, res) {
		directoryMusic = this.path_songs;
		var mp3Player = this.getMusic(this.getFiles(directoryMusic)).map(function (mp3) {
			//console.log("have song="+mp3);
			return {url: "/MMM-MP3Player/music/" + mp3};
		})
    console.log("sending music list to module = " + mp3Player);
		res.send(mp3Player);
	},

	// return array with only songs
	getMusic: function(files) {
		var songs = [];
		var enabledTypes = ["audio/mpeg", "song/ogg", "audio/wav"];
console.log(" searching for files with types "+enabledTypes);
		for (idx in files) {
			type = mime.lookup(files[idx]);
console.log("mime type for file="+files[idx]+" is "+type);
			if (enabledTypes.indexOf(type) >= 0 && type !== false) {
				console.log(" accepted type file ="+files[idx]);
				songs.push(files[idx]);
			}
		}
		return songs;
	},

	getFiles: function(path) {
    console.log("looking for music in"+path);
		try {
		return fs.readdirSync(path).filter(function (file) {
			if (! fs.statSync(path + "/" + file).isDirectory() ) {
				console.log("found file="+file);
				return file;
			}
		});
		}
		catch(error)
		{
			 if(error=='EHOSTDOWN')
			 {
				 return [];
			 } 
		}
	},

});