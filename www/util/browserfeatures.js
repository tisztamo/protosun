/*globals BrowserFeatures: true */
"use strict";

var BrowserFeatures = {
  hasTouch: (('ontouchstart' in window) || (navigator.MaxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0))
};

(function addFeatureClasses() {
  document.body.className += BrowserFeatures.hasTouch ? "touch" : "no-touch";
}());
