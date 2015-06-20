"use strict";

function Loader() {}

Loader.prototype.loadScripts = function (scriptUrls, cb) {
  if (!(scriptUrls instanceof Array)) {
    throw "scripts parameter must be an array";
  }
  var loadedCount = 0;
  var loaded = function () {
    if (++loadedCount === scriptUrls.length) {
      if (typeof cb === "function") {
        console.log("Loaded scripts: " + scriptUrls.join(' '));
        cb();
      }
    }
  };
  var failed = function (event) {
    console.error("Error loading script: " + event.target.src);
  };
  for (var i = 0; i < scriptUrls.length; ++i) {
    this.loadScript(scriptUrls[i], loaded, failed);
  }
};

Loader.prototype.loadScript = function (url, success, fail) {
  var scriptElement = document.createElement("script");
  scriptElement.type = "text\/javascript";
  scriptElement.addEventListener("error", fail);
  scriptElement.addEventListener("load", success);
  document.head.appendChild(scriptElement);
  scriptElement.src = url;
};