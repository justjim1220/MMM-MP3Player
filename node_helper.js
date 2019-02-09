/* Magic Mirror
 *
 * Node Helper: MMM-MP3Player
 *
 * By justjim1220 aka Jim Hallock (justjim1220@gmail.com)
 * 
 * GNU Licensed
 *
 */

// call in the required classes
var NodeHelper = require('node_helper');
var FileSystemMP3Player = require('fs');

// the main module helper create
module.exports = NodeHelper.create({
  // subclass start method, clears the initial config array
  start: function() {
    //this.moduleConfigs = [];
  },

	// shuffles an array at random and returns it
  shuffleArray: function(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  },

	// sort by filename attribute
  sortByFilename: function(a, b) {
    aL = a.toLowerCase();
    bL = b.toLowerCase();
    if (aL > bL) return 1;
    else return -1;
  },

	// checks there's a valid audio file extension
  checkValidAudioFileExtension: function(filename, extensions) {
    var extList = extensions.split(',');
    for (var extIndex = 0; extIndex < extList.length; extIndex++) {
      if (filename.toLowerCase().endsWith(extList[extIndex])) return true;
    }
    return false;
  },

	gatherSongList: function(config) {
    var self = this;
    // create an empty main song list
    var songList = [];
    for (var i = 0; i < config.musicPath.length; i++) {
      this.getFiles(config.musicPath[i], songList, config);
    }

    songList = config.randomOrder
      ? this.shuffleArray(songList)
      : songList.sort(this.sortByFilename);

    return songList;
  },

	getFiles(path, songList, config) {
    var contents = FileSystemMP3Player.readdirSync(path);
    for (let i = 0; i < contents.length; i++) {
      var currentItem = path + '/' + contents[i];
      var stats = FileSystemMP3Player.lstatSync(currentItem);
      if (stats.isDirectory() && config.recursiveSubDirectories) {
        this.getFiles(currentItem, songList, config);
      } else if (stats.isFile()) {
        var isValidAudioFileExtension = this.checkValidAudioFileExtension(
          currentItem,
          config.validAudioFileExtensions
        );
        if (isValidAudioFileExtension) songList.push(currentItem);
      }
    }
	},

	// Override socketNotificationReceived method.
  socketNotificationReceived: function(notification, payload) {
    if (notification === "MP3PLAYER_REGISTER_CONFIG") {
      // this to self
      var self = this;
      // get the music list
      var songList = this.gatherSongList(payload);
      // build the return payload
      var returnPayload = {
        identifier: payload.identifier,
        songList: songList
      };
      // send the image list back
      self.sendSocketNotification(
        "MP3PLAYER_FILELIST",
        returnPayload
      );
    }
  }
});