"use strict";

function Star(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
  this.radius = 150;
}

Star.prototype = new SpaceObject();
Star.prototype.constructor = Star;

Star.prototype.isIndestructible = true;