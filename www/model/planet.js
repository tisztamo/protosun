"use strict";

function Planet(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
  this.radius = 25;
}

Planet.prototype = Object.create(SpaceObject.prototype);
Planet.prototype.constructor = Planet;