/* MagicMIrror Module - MMM-MP3Player
 *
 * This is a 3rd Party Module for the [MagicMirror² By Michael Teeuw http://michaelteeuw.nl]
 * (https://github.com/MichMich/MagicMirror/).
 *
 * A mp3 player -- 
 * can use a url or a local directory (music) 
 *
 * NOT tested with Raspberry Pi.
 * It DOES work with Windows 10!!!
 *
 * version: 1.0.0
 *
 * Module created by justjim1220 aka Jim Hallock (justjim1220@gmail.com)
 *
 * Licensed with a crapload of good ole' Southern Sweet Tea
 * and a lot of Cheyenne Extreme Menthol cigars!!!
 */

// a decent 'beginner's' module developing instruction manual - but doesn't explain everything!
// https://forum.magicmirror.builders/topic/8534/head-first-developing-mm-module-for-extreme-beginners

// <-- used to comment out single lines of code

/*
    <-- used to comment out sections of code -->
    proper code for this is to have an empty line above (/*)
    the start of the out comment and below (* /) the ending
*/

// read comments and compare to original code 
// @ https://codepen.io/justjim1220/pen/rPpGqw?editors=1100
// to see how it was converted to MM module

// ???? --> needs work here (will show places in the code I still need to figure out)

// <-- beginning of module code -->
Module.register("MMM-MP3Player", {
    // <-- user congiurations -->
	defaults: {
        useURL: true, // set to false if using local directory (/modules/MMM-MP3Player/music/) for own music
        
        // <-- from original JS code -->
        //var songs = [ ... ] (lines 2 - 15)
        songsArray: [  // Used if wanting to link your music via URL
            { 
                title: "LA Chill Tour",
                songURL: "https://d34x6xks9kc6p2.cloudfront.net/540997b0-a35f-4b69-86d6-b1c925c4a264/540997b0-a35f-4b69-86d6-b1c925c4a264.mp3"
            },
            { 
                title: "This is it band",
                songURL: "https://d34x6xks9kc6p2.cloudfront.net/8bd0ca4f-1b57-47e9-8878-516d14196d86/8bd0ca4f-1b57-47e9-8878-516d14196d86.mp3"
            },
            { 
                title: "LA Fusion Jam",
                songURL: "https://d34x6xks9kc6p2.cloudfront.net/0024ada8-e1c3-4d75-a2df-d19ea5eb6c79/0024ada8-e1c3-4d75-a2df-d19ea5eb6c79.mp3"
            },
        ]
	},

    // minimal MM version requirement (optional)
    requiresVersion: "2.1.0",
    
    /*
    // call for any js files this module is dependent upon
    getScripts: function() {
        return ["name.js"];
    },
    */

    // call for any css files needed
	getStyles: function() {
		return ["MMM-MP3Player.css", "font-awesome.css"];
	},

    // function will be executed when your module is loaded successfully
	start: function() { 
    KitchenTimer = this;
		Log.info("Starting module: " + this.name);
        KTclock = 0;
        
        "use strict"
	},

    // place for global variables can also be placed above the
    // beginning of the module code or after the getDom function
    // <-- from original JS code --> (lines 25 - 30)
    let: currentIndex = 0,
    let: dataAvailable = false,

    //let currentLength; <---(change from original)
    let: currentLength = 0,

    // let timer; <---(change from original)
    let: timer = null,
    
    // timer = setInterval(updateDurationLabel, 100) <---(change from original)
    timer: setInterval(this.updateDurationLabel, 100),

    getDom: function() {

        // the main '<"div">' equivalent of HTML IE: replaces <html>, <head>, <body>, etc 
        var wrapper = document.createElement("div");

        // <div class="mediaplayer" id="mediaPlayer"> ( <---- start of the HTML code ---->)
            var mediaPlayer = document.createElement("div");
            mediaPlayer.className = "mediaPlayer";
            mediaPlayer.id = "mediaPlayer";

            // <audio id="audioPlayer" src="https://d34x6xks9kc6p2.cloudfront.net/540997b0-a35f-4b69-86d6-b1c925c4a264/540997b0-a35f-4b69-86d6-b1c925c4a264.mp3">
            // ???? --> needs work here
                var audio = document.createElement("audio");
        // ???? --> need to define 'audioPlayer'
                audio.src = "MMM-MP3Player-player";
                audio.id = "audioPlayer";

                // <-- from original JS code --> (lines 65 - 68)
                audioPlayer.addEventListener("loadeddata", () => {
                    dataAvailable = true;
                    currentLength = audioPlayer.duration;
                }),
                // <-- from original JS code --> (lines 103 - 106)
                audioPlayer.addEventListener("ended", () => {
                     myAudio.currentTime = 0;
                }), 
                // <-- -->

                // </audio>
                mediaPlayer.appendChild(audioPlayer);

            // <div class="discarea">
            var discArea = document.createElement("div");
            discArea.className = "discArea";
            
		    // <div class="disc"></div>
            var disc = document.createElement("div");
            disc.className = "disc";
            discArea.appendChild(disc);

		    // <div class="stylus"></div>
            var stylus = document.createElement("div");
            stylus.className = "stylus";

            // <div class="pivot"></div>
            var pivot = document.createElement("div");
            pivot.className = "pivot";
            stylus.appendChild(pivot);

            // <div class="arm"></div>
            var arm = document.createElement("div");
            arm.className = "arm";
            stylus.appendChild(arm);

            // <div class="head"></div>
            var head = document.createElement("div");
            head.className = "head";
            stylus.appendChild(head);

            // </div> (closes stylus section)
            discArea.appendChild(stylus);

            // </div> (closes discArea)
            mediaPlayer.appendChild(discArea);

            // <div class="controls">
            var controls = document.createElement("div");
            controls.className = "controls";

            // <span class="title" id="songTitleLabel">LA Chill Tour</span>
            var title = document.createElement("span");
            title.className = "title";
            title.id = "songTitleLabel";
            title.innerHTML = this.currentSongTitle;
            controls.appendChild(title);

            // <div class="buttons">
            var buttons = document.createElement("div");
            buttons.className = "buttons";

            // <button id="backItem" class="back">
            var prevButton = document.createElement("button");
            prevButton.className = "back";
            prevButton.id = "prevButton";
            // <i class="fa fa-backward"></i>
            var prev = document.createElement("i");
            prev.className = "fa fa-backward";

            // <-- from original JS code --> (lines 59 - 63)
            prevButton.addEventListener("click", () => {
                dataAvailable = false;
                loadNext(false);
            }, false),
            // <-- -->

            // </button>
            buttons.appendChild(prevButton);

            // <button id="playState" class="playstate">
            var playButton = document.createElement("button");
            playButton.className = "playButton";
            playButton.id = "playButton";
            // <i class="fa fa-play"></i>
            var play = document.createElement("i");
            play.className = "fa fa-play";
            // <i class="fa fa-pause"></i>
            var pause = document.createElement("i");
            pause.className = "fa fa-pause";

            // <-- from original JS code --> (lines 36 - 45)
            playButton.addEventListener("click", () => {
                mediaPlayer.classList.toggle("play");
                if (audioPlayer.paused) {
                    setTimeout(() => {
                        audioPlayer.play()
                    }, 300);
                    timer = setInterval(updateDurationLabel, 100);
                } else {
                    audioPlayer.pause();
                    clearInterval(timer);
                }
            }, false),
            // <-- -->

            // </button>
            buttons.appendChild(playButton);

            // <button id="stopItem" class="stop">
            var stopButton = document.createElement("button");
            stopButton.className = "stop";
            stopButton.id = "stopButton";
            // <i class="fa fa-stop"></i>
            var stop = document.createElement("i");
            stop.className = "fa fa-stop";

            // <-- from original JS code --> (lines 47 - 52)
            stopButton.addEventListener("click", () => {
                mediaPlayer.classList.remove("play");
                audioPlayer.pause();
                audioPlayer.currentTime = 0;
                updateDurationLabel();
            }, false),
            // <-- -->

            // </button>
            buttons.appendChild(stopButton);

            // <button id="nextItem" class="next">
            var nextButton = document.createElement("button");
            nextButton.className = "next";
            nextButton.id = "nextButton";
            // <i class="fa fa-forward"></i>
            var next = document.createElement("i");
            next.className = "fa fa-forward";

            // <-- from original JS code --> (lines 54 - 57)
            nextButton.addEventListener("click", () => {
                dataAvailable = false;
                loadNext(true);
            }, false),
            // <-- -->

            // </button>
            buttons.appendChild(nextButton);

            // </div> (end of buttons)            
            controls.appendChild(buttons);

            // <div class="subControls">
            var subControls = document.createElement("div");
            subControls.className = "subControls";

            // <span class="duration" id="currentDuration">00:00
            var duration = document.createElement("span");
            duration.className = "duration";
            duration.id = "currentDuration";
            duration.innerHTML = "00:00";
            // </span>
            subControls.appendChild(duration);

            // <input class="volumeSlider" type="range" id="volumeSlider" min="0" max="1" step="0.01"
            var volumeSlider = document.createElement("input");
            volumeSlider.className = "volumeSlider";
            volumeSlider.type = "range";
            volumeSlider.id = "volumeSlider";
            volumeSlider.min = "0";
            volumeSlider.max = "1";
            volumeSlider.step = "0.01";

            // <-- from original JS code --> (lines 32 - 34)
            volumeSlider.addEventListener("input", () => {
                audioPlayer.volume = parseFloat(volumeSlider.value);
            }, false);
            // <-- -->

            // (/> end of input class)
            subControls.appendChild(volumeSlider);

            // </div> (end of subControls)
            controls.appendChild(subControls);

            // </div> (end of controls)
            mediaPlayer.appendChild(controls);

        // </div> ( <---- end of the HTML code ----> )
        wrapper.appendChild(mediaPlayer);

        // ( <---- end of the getDom function ----> )
        return wrapper;
    },
    
    // function parseTime(time) { <---(change from original)
    parseTime: function(time) {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time - minutes * 60)
        const secondsZero = seconds < 10 ? "0" : ""
        const minutesZero = minutes < 10 ? "0" : ""
        return minutesZero + minutes.toString() + ":" + secondsZero + seconds.toString()
    },
    
    // function loadNext(next) { <---(change from original)
    loadNext: function(next) {
        audioPlayer.pause();
        if (next) {
            currentIndex = (currentIndex + 1) % songs.length;
        } else {
            currentIndex = (currentIndex - 1) < 0 ? songs.length - 1 : currentIndex - 1;
        };
        audioPlayer.src = songs[currentIndex].songURL;
        songTitleLabel.innerHTML = songs[currentIndex].title;
        audioPlayer.play();
    },
    
    // function updateDurationLabel(){ <---(change from original)
     updateDurationLabel: function() {
        if (dataAvailable) {
            durationLabel.innerText = parseTime(audioPlayer.currentTime) + " / " + parseTime(currentLength);
        } else {
            durationLabel.innerText = parseTime(audioPlayer.currentTime);
        }
    },

    // ???? --> needs work here
    getMusic: function() {
        if(!this.config.useURL) {
            music.src = "modules/MMM-MP3Player/music/";
        } else {
            music.src = this.config.songsArray;
        };
        return music;
    },
});