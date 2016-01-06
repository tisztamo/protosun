"use strict";

function Moon(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
  this.radius = 25;
}

Moon.prototype = new SpaceObject();
Moon.prototype.constructor = Moon;