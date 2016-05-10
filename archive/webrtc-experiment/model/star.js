"use strict";

function Star(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass || 10);
  this.radius = 135;
}

Star.prototype = Object.create(SpaceObject.prototype);
Star.prototype.constructor = Star;

Star.prototype.isIndestructible = true;