"use strict";

function Mixin() {}

Mixin.mixInto = function (target) {
  target.mixinOverride = target.mixinOverride || {};
  target.mixinOverride[this.name] = {};
  var originalProperties = target.mixinOverride[this.name];
  for (var propertyName in this) {
    if (propertyName !== "mixinOverride") {
      if (typeof target[propertyName] === "function") {
        originalProperties[propertyName] = target[propertyName];
      }
      target[propertyName] = this[propertyName];
    }
  }
};