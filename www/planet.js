"use strict";

function Planet(pos, v, mass) {
  SpaceObject.call(this, pos, v, mass);
}

Planet.prototype = new SpaceObject();
Planet.prototype.constructor = Planet;