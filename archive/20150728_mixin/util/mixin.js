"use strict";

function Mixin() {}

Mixin.mixInto = function (target) {
  if (this === Mixin) {
    target.mixInto = this.mixInto;
    return;
  }

  target.prototype.mixinOverride = target.prototype.mixinOverride || {};

  var overridenMethods = {};
  for (var propertyName in this.prototype) {
    if (typeof target.prototype[propertyName] === "function") {
      overridenMethods[propertyName] = target.prototype[propertyName];
    }
    target.prototype[propertyName] = this.prototype[propertyName];
  }
  target.prototype.mixinOverride[this.name] = overridenMethods;
};