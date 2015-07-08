"use strict";

function Mixin() {}

Mixin.mixInto = function (target) {
  if (this === Mixin) {
    target.mixInto = this.mixInto;
    return;
  }
  target.prototype.mixinOverride = target.prototype.mixinOverride || {};
  target.prototype.mixinOverride[this.name] = {};
  var overridenProperties = target.prototype.mixinOverride[this.name];
  for (var propertyName in this.prototype) {
    if (typeof target.prototype[propertyName] === "function") {
      overridenProperties[propertyName] = target.prototype[propertyName];
    }
    target.prototype[propertyName] = this.prototype[propertyName];
  }
};