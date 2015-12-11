"use strict";

function CustomEventTarget() {
  this.customEventTarget = document.createDocumentFragment();
}

Mixin.mixInto(CustomEventTarget);

CustomEventTarget.prototype.addEventListener = function (type, listener) {
  this.customEventTarget.addEventListener(type, listener, true);
};

CustomEventTarget.prototype.removeEventListener = function (type, listener) {
  this.customEventTarget.removeEventListener(type, listener, true);
};

CustomEventTarget.prototype.dispatchEvent = function (event) {
  this.customEventTarget.dispatchEvent(event);
};
