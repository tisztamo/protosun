"use strict";

function Moon(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
  this.radius = 15;
}

Moon.prototype = Object.create(SpaceObject.prototype);
Moon.prototype.constructor = Moon;