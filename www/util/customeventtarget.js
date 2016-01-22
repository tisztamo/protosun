/*jshint -W098 */
"use strict";

function CustomEventTarget() {
  var customEventTarget = document.createDocumentFragment();

  this.addEventListener = function (type, listener) {
    customEventTarget.addEventListener(type, listener, true);
  };

  this.removeEventListener = function (type, listener) {
    customEventTarget.removeEventListener(type, listener, true);
  };

  this.dispatchEvent = function (event) {
    customEventTarget.dispatchEvent(event);
  };

  this.emit = function (eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail: detail
    }));
  };
}