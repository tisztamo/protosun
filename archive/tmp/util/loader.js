"use strict";

function Loader() {}

Loader.prototype.loadedCB = function () {
  if (--this.toBeLoadedCount === 0) {
    if (typeof this.loadDoneCB === "function") {
      this.loadDoneCB();
    }
  }
};

Loader.prototype.failedCB = function (event) {
  console.error("Error loading script: " + event.target.src);
};

Loader.prototype.loadScripts = function (scriptUrls, cb) {
  if (!(scriptUrls instanceof Array)) {
    throw "scripts parameter must be an array";
  }
  this.toBeLoadedCount = scriptUrls.length;
  this.loadDoneCB = cb;
  console.log("Loading scripts: " + scriptUrls.join(' '));
  for (var i = 0; i < scriptUrls.length; ++i) {
    this.loadScript(scriptUrls[i], this.loadedCB.bind(this), this.failedCB.bind(this));
  }
};

Loader.prototype.loadScript = function (url, success, fail) {
  var scriptElement = document.createElement("script");
  scriptElement.async = false;
  scriptElement.type = "text\/javascript";
  scriptElement.addEventListener("error", fail);
  scriptElement.addEventListener("load", success);
  document.head.appendChild(scriptElement);
  scriptElement.src = url;
};