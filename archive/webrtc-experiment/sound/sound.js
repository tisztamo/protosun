/*global Media*/
"use strict";

function Sound() {}


Sound.prototype.playMusic = function (url) {
  if (!window.Media) {
    console.log("playMusic: Media plugin not found");
    return;
  }
  this.stopMusic();
  var mediaUrl = this.createLocalMediaUrl(url);
  this.runningMusic = new Media(mediaUrl,
    function () {
      console.log("playMusic(): Audio Success");
    },
    function (err) {
      console.log("playMusic():Audio Error: " + JSON.stringify(err));
    }
  );
  this.runningMusic.play();
};

Sound.prototype.stopMusic = function () {
  if (this.runningMusic) {
    this.runningMusic.stop();
    this.runningMusic.release();
  }
};

Sound.prototype.createLocalMediaUrl = function (relativeUrl) {
  if (window.device && window.device.platform == "Android") {
    var path = window.location.pathname;
    path = path.substr(path, path.lastIndexOf("/"));
    if (!path.startsWith("http") && !path.startsWith("file")) {
      path = "file://" + path;
    }
    return path + "/" + relativeUrl;
  } else {
    return relativeUrl;
  }
};