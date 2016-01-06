"use strict";

function Planet(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
  this.radius = 50;
}

Planet.prototype = new SpaceObject();
Planet.prototype.constructor = Planet;